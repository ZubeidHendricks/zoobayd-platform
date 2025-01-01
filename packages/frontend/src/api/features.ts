import axios from 'axios';
import { Feature } from '../types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
});

export const getFeatures = async (): Promise<Feature[]> => {
  const { data } = await api.get('/features');
  return data;
};

export const updateAccess = async (featureId: string, settings: any) => {
  const { data } = await api.put(`/features/${featureId}/access`, settings);
  return data;
};

export const trackUsage = async (featureId: string, metrics: any) => {
  const { data } = await api.post(`/features/${featureId}/track`, metrics);
  return data;
};