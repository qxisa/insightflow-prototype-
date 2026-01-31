import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataRow, ColumnInfo } from '../types';

export const parseFile = async (file: File): Promise<DataRow[]> => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            resolve(results.data as DataRow[]);
          } else {
            reject(new Error('CSV file is empty or invalid'));
          }
        },
        error: (error) => reject(error),
      });
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet) as DataRow[];
          resolve(jsonData);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    } else {
      reject(new Error('Unsupported file type. Please upload CSV or Excel.'));
    }
  });
};

export const analyzeData = (data: DataRow[]): ColumnInfo[] => {
  if (data.length === 0) return [];

  const keys = Object.keys(data[0]);
  const rowCount = data.length;

  return keys.map((key) => {
    const values = data.map((row) => row[key]);
    const definedValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    const uniqueValues = new Set(definedValues).size;
    const missingValues = rowCount - definedValues.length;

    // Detect Type
    const isNumber = definedValues.every((v) => typeof v === 'number');
    const isDate = definedValues.every((v) => !isNaN(Date.parse(String(v))) && isNaN(Number(v)));
    const isBoolean = definedValues.every((v) => typeof v === 'boolean' || v === 'true' || v === 'false');
    
    let type: ColumnInfo['type'] = 'string';
    if (isNumber) type = 'number';
    else if (isBoolean) type = 'boolean';
    else if (isDate) type = 'date';

    let stats: Partial<ColumnInfo> = {};
    if (type === 'number') {
      const nums = definedValues as number[];
      stats.min = Math.min(...nums);
      stats.max = Math.max(...nums);
      stats.mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    return {
      name: key,
      type,
      uniqueValues,
      missingValues,
      sample: values.slice(0, 5),
      ...stats,
    };
  });
};
