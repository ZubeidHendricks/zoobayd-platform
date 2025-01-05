import { Feature } from '../types';

const baseURL = process.env.NEXT_PUBLIC_API_URL;

export const getFeatures = async (): Promise<Feature[]> => {
  const response = await fetch(`${baseURL}/features`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const updateAccess = async (featureId: string, settings: any) => {
  const response = await fetch(`${baseURL}/features/${featureId}/access`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const trackUsage = async (featureId: string, metrics: any) => {
  const response = await fetch(`${baseURL}/features/${featureId}/track`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metrics)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};