export interface DataRow {
  [key: string]: any;
}

export interface Dataset {
  name: string;
  data: DataRow[];
  columns: string[];
}

export interface AppState {
  isAuthenticated: boolean;
  datasets: Dataset[];
  currentDatasetIndex: number;
}
