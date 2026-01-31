export interface DataRow {
  [key: string]: string | number | boolean | null;
}

export interface ColumnInfo {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date';
  uniqueValues: number;
  missingValues: number;
  sample: (string | number | boolean | null)[];
  min?: number;
  max?: number;
  mean?: number;
}

export type ChartType = 'bar' | 'line' | 'scatter' | 'area' | 'pie';

export interface ChartConfig {
  type: ChartType;
  xAxis: string;
  yAxis: string[];
  title: string;
}

export interface AIReport {
  title: string;
  summary: string;
  keyInsights: string[];
  recommendations: string[];
  markdownContent: string;
}
