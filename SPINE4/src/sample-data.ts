import { Dataset } from './types';

export const sampleDataset: Dataset = {
  name: 'Sample: Keterlambatan Pertanggungjawaban 2026',
  columns: ['Bulan', 'Petty Cash', 'UM OP', 'UM SPPD', 'Cash Opname'],
  data: [
    { Bulan: 'Januari', 'Petty Cash': 9, 'UM OP': 8, 'UM SPPD': 8, 'Cash Opname': 0 },
    { Bulan: 'Februari', 'Petty Cash': 8, 'UM OP': 7, 'UM SPPD': 5, 'Cash Opname': 0 },
    { Bulan: 'Maret', 'Petty Cash': 7, 'UM OP': 4, 'UM SPPD': 7, 'Cash Opname': 0 },
    { Bulan: 'April', 'Petty Cash': 8, 'UM OP': 7, 'UM SPPD': 8, 'Cash Opname': 0 },
    { Bulan: 'Mei', 'Petty Cash': 9, 'UM OP': 5, 'UM SPPD': 6, 'Cash Opname': 0 },
    { Bulan: 'Juni', 'Petty Cash': 4, 'UM OP': 6, 'UM SPPD': 7, 'Cash Opname': 0 },
    { Bulan: 'Juli', 'Petty Cash': 2, 'UM OP': 2, 'UM SPPD': 6, 'Cash Opname': 0 },
    { Bulan: 'Agustus', 'Petty Cash': 5, 'UM OP': 4, 'UM SPPD': 5, 'Cash Opname': 0 },
    { Bulan: 'September', 'Petty Cash': 6, 'UM OP': 3, 'UM SPPD': 3, 'Cash Opname': 0 },
    { Bulan: 'Oktober', 'Petty Cash': 4, 'UM OP': 5, 'UM SPPD': 4, 'Cash Opname': 0 },
    { Bulan: 'November', 'Petty Cash': 5, 'UM OP': 2, 'UM SPPD': 3, 'Cash Opname': 0 },
    { Bulan: 'Desember', 'Petty Cash': 2, 'UM OP': 1, 'UM SPPD': 2, 'Cash Opname': 0 },
  ],
};

export const contributionData = [
  { name: 'EPC', value: 4.99 },
  { name: 'TENAGA KERJA &...', value: 5.57 },
  { name: 'PERDAGANGAN', value: 11.63 },
  { name: 'PERGUDANGAN', value: 77.81 },
];

export const performanceData = [
  { name: 'EPC', realisasi: 50, rkap: 58 },
  { name: 'TENAGA KERJA &...', realisasi: 10, rkap: 10 },
  { name: 'PERDAGANGAN', realisasi: 5, rkap: 7 },
  { name: 'PERGUDANGAN', realisasi: 8, rkap: 6 },
];
