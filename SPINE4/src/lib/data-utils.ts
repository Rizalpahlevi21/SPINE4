import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { DataRow, Dataset } from '../types';

export const parseCSV = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data as DataRow[];
        const columns = results.meta.fields || [];
        resolve({
          name: file.name,
          data,
          columns,
        });
      },
      error: (error) => reject(error),
    });
  });
};

export const parseExcel = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet) as DataRow[];
        const columns = json.length > 0 ? Object.keys(json[0]) : [];
        resolve({
          name: file.name,
          data: json,
          columns,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

export const parseJSON = (file: File): Promise<Dataset> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const data = Array.isArray(json) ? json : [json];
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        resolve({
          name: file.name,
          data,
          columns,
        });
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const exportToExcel = (data: DataRow[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
