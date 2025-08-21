import axios, { type AxiosResponse } from 'axios';
import type { RecordToSaveType } from '../types/recordToSaveType';

// Isa: https://68a70f55639c6a54e9a0d630.mockapi.io/api
// Leo: https://68a36626c5a31eb7bb203e83.mockapi.io/api

const mAxios = axios.create({
  baseURL: 'https://68a70f55639c6a54e9a0d630.mockapi.io/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const GetAllDataRecords = async (): Promise<AxiosResponse> => {
  return mAxios.get('/automatiza_agro');
};

export const GetAllCrops = async (): Promise<AxiosResponse> => {
  return mAxios.get('/cultivos');
};

export const SaveRecord = async (data: RecordToSaveType): Promise<AxiosResponse> => {
  return mAxios.post('/automatiza_agro', data);
};
