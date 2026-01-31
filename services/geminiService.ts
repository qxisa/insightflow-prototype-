import { GoogleGenAI } from "@google/genai";
import { DataRow, ColumnInfo, AIReport } from '../types';
import { MAX_ROWS_FOR_AI, MODEL_TEXT_FAST, MODEL_TEXT_REASONING } from '../constants';

let aiClient: GoogleGenAI | null = null;

const getClient = () => {
  if (!aiClient) {
    // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      console.warn("API_KEY is missing. AI features will return mock data.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey: apiKey });
  }
  return aiClient;
};

export const generateInitialInsights = async (
  data: DataRow[],
  columns: ColumnInfo[]
): Promise<string> => {
  const client = getClient();
  const sampleData = data.slice(0, MAX_ROWS_FOR_AI);
  const columnSummaries = columns.map(c => `${c.name} (${c.type})`).join(', ');

  const prompt = `
    I have a dataset with the following columns: ${columnSummaries}.
    Here is a sample of the first ${sampleData.length} rows:
    ${JSON.stringify(sampleData)}

    Please provide a brief, high-level executive summary of what this dataset appears to be about. 
    Focus on the nature of the data and 3 potential meaningful insights or trends that might be hidden in it.
    Keep it under 200 words. Format as clean Markdown.
  `;

  if (!client) {
    return `**Mock Insight**: This dataset contains ${data.length} records with columns ${columns.map(c => c.name).join(', ')}. 
    \n\n*Note: API Key is missing. Please ensure API_KEY is set in your Netlify Environment Variables and you have triggered a new deploy.*`;
  }

  try {
    const response = await client.models.generateContent({
      model: MODEL_TEXT_FAST,
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Could not generate insights at this time due to an API error.";
  }
};

export const generateDetailedReport = async (
  data: DataRow[],
  selectedColumns: string[]
): Promise<AIReport> => {
  const client = getClient();
  const sampleData = data.slice(0, MAX_ROWS_FOR_AI);
  
  // Filter sample data to only include selected columns to save tokens and focus attention
  const filteredSample = sampleData.map(row => {
    const newRow: any = {};
    selectedColumns.forEach(col => newRow[col] = row[col]);
    return newRow;
  });

  const prompt = `
    Analyze the following dataset focusing specifically on these columns: ${selectedColumns.join(', ')}.
    Data Sample (first ${filteredSample.length} rows):
    ${JSON.stringify(filteredSample)}

    Generate a comprehensive report in structured JSON format with the following fields:
    - title: A creative title for the analysis.
    - summary: A paragraph summarizing the findings.
    - keyInsights: An array of strings, each being a distinct insight.
    - recommendations: An array of strings, actionable advice based on data.
    - markdownContent: A full detailed report in Markdown format, including headings, lists, and analysis of distributions or correlations.

    Return ONLY valid JSON.
  `;

  if (!client) {
    return {
      title: "Demo Analysis Report",
      summary: "This is a placeholder report generated because no API key was found.",
      keyInsights: ["Insight 1: Data is loaded.", "Insight 2: You selected columns."],
      recommendations: ["Add an API Key to see real magic.", "Try uploading a different file."],
      markdownContent: "## Demo Report\n\nPlease configure your environment to use Gemini API."
    };
  }

  try {
    const response = await client.models.generateContent({
      model: MODEL_TEXT_REASONING,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text) as AIReport;
  } catch (error) {
    console.error("Gemini Report Error:", error);
    throw new Error("Failed to generate report.");
  }
};