# InsightFlow

A privacy-friendly data analysis tool that transforms CSV and Excel files into meaningful insights, interactive visualizations, and AI-generated reports.

## Overview

InsightFlow is a web-based application that allows users to upload data files and instantly analyze them without writing any code. All data processing happens locally in your browser, ensuring privacy and security. The application leverages AI capabilities through Google's Gemini API to provide intelligent insights and comprehensive reports.

## Features

### Data Processing
- Upload and parse CSV and Excel (XLSX/XLS) files
- Automatic data type detection (string, number, boolean, date)
- Data quality analysis with missing value detection
- Statistical analysis for numeric columns (min, max, mean)

### Visualization
- Interactive chart creation with multiple chart types:
  - Bar charts
  - Line charts
  - Area charts
  - Scatter plots
  - Pie charts
- Customizable axes configuration
- Download visualizations as PNG images
- Responsive charts that adapt to screen size

### AI-Powered Insights
- Automatic generation of initial insights upon file upload
- Executive summaries of dataset characteristics
- Detailed report generation for selected columns
- AI-generated recommendations based on data patterns
- Structured reports with key insights and actionable recommendations

### User Interface
- Modern, dark-themed interface
- Drag-and-drop file upload
- Real-time data processing feedback
- Responsive design for desktop and mobile devices
- Clean, distraction-free layout

## Technology Stack

### Frontend Framework
- React 18.3 with TypeScript
- Vite for build tooling and development server

### Data Processing
- PapaParse for CSV parsing
- XLSX library for Excel file handling

### Visualization
- Recharts for interactive charts and graphs
- html-to-image for exporting visualizations

### AI Integration
- Google Gemini API (@google/genai)
- Gemini 3 Flash for quick insights
- Gemini 3 Pro for detailed reasoning and reports

### UI Components
- Lucide React for icons
- TailwindCSS for styling
- React Markdown for rendering formatted text

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd insightflow-prototype-
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the project root or configure environment variables in your deployment platform:
```
API_KEY=your_google_gemini_api_key
```

Note: The application will function without an API key, but AI features will return placeholder data.

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Uploading Data

1. Click "Browse Files" or drag and drop a CSV or Excel file onto the upload area
2. The application will automatically parse and analyze your data
3. Wait for the initial AI insights to be generated

### Exploring Data

Once your file is loaded, you'll see three main sections:

**Dataset Overview**
- View key statistics: total rows, column count, missing values, data completeness
- Read AI-generated quick insights about your dataset
- See a mini-chart of numeric column means

**Visualizer**
- Select chart type (bar, line, area, scatter, pie)
- Choose X and Y axes from your data columns
- Download your visualization as an image

**AI Report Generator**
- Select specific columns to focus on
- Click "Generate Report" to get a detailed AI analysis
- View structured insights, recommendations, and detailed analysis

### Uploading New Files

Click "Upload New File" in the header to reset the application and load a different dataset.

## Deployment

### Netlify

The application is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variable `API_KEY` with your Google Gemini API key
4. Deploy

The included `netlify.toml` file contains the necessary configuration.

### Other Platforms

The application can be deployed on any static hosting platform that supports:
- Node.js build process
- Environment variable injection
- SPA (Single Page Application) routing

## Project Structure

```
├── components/          # React components
│   ├── DataOverview.tsx      # Statistics and AI insights display
│   ├── FileUpload.tsx        # File upload interface
│   ├── ReportGenerator.tsx   # AI report generation
│   └── Visualizer.tsx        # Interactive charts
├── services/            # Business logic
│   ├── dataService.ts        # File parsing and analysis
│   └── geminiService.ts      # AI integration
├── App.tsx             # Main application component
├── constants.ts        # Application constants
├── index.html          # HTML entry point
├── index.tsx           # React entry point
├── types.ts            # TypeScript type definitions
├── vite.config.ts      # Vite configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Dependencies and scripts
└── netlify.toml        # Netlify deployment config
```

## Privacy and Security

- All file processing occurs locally in your browser
- Data is never uploaded to external servers (except AI API calls with sample data)
- Only a limited sample of data (first 50 rows) is sent to the AI service for analysis
- No data is stored on any servers
- The application operates entirely on the client side

## Limitations

- Maximum of 100 rows displayed in charts for performance reasons
- Pie charts limited to top 10 categories to avoid clutter
- AI features require a valid Google Gemini API key
- Large files may impact browser performance

## Browser Compatibility

The application works best on modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari

Minimum requirements:
- JavaScript enabled
- LocalStorage support
- ES6+ support

## Contributing

Contributions are welcome. Please ensure your code follows the existing style and structure.

## License

This project is maintained by NU ITCS students in Egypt.

## Credits

Built with modern web technologies and AI capabilities to make data analysis accessible to everyone.
