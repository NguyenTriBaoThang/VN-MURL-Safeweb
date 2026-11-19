import axios from 'axios';
import {
  ScanResult,
  DashboardSummary,
  ResearchSummary,
  ResearchModelMetric,
  ModelInfo,
  ListEntry,
  SettingItem,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('safeweb_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Scan API
export const scanUrl = async (url: string): Promise<ScanResult> => {
  const response = await apiClient.post<ScanResult>('/scan', { url });
  return response.data;
};

export const getScans = async (
  page = 1,
  pageSize = 20,
  search = '',
  label = '',
  onlyMine = false
): Promise<{ items: ScanResult[]; total: number; page: number; pageSize: number }> => {
  const response = await apiClient.get('/scans', {
    params: { page, pageSize, search, label, onlyMine },
  });
  return response.data;
};

export const getScanById = async (id: number): Promise<ScanResult> => {
  const response = await apiClient.get<ScanResult>(`/scans/${id}`);
  return response.data;
};

// Dashboard API
export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await apiClient.get<DashboardSummary>('/dashboard/summary');
  return response.data;
};

export const getRecentScans = async (count = 10): Promise<ScanResult[]> => {
  const response = await apiClient.get<ScanResult[]>('/dashboard/recent-scans', {
    params: { count },
  });
  return response.data;
};

// Research API
export const getResearchSummary = async (): Promise<ResearchSummary> => {
  const response = await apiClient.get<ResearchSummary>('/research/summary');
  return response.data;
};

export const getResearchModels = async (): Promise<ResearchModelMetric[]> => {
  const response = await apiClient.get<ResearchModelMetric[]>('/research/models');
  return response.data;
};

export const getResearchCsvData = async (filename: string): Promise<any[]> => {
  const response = await apiClient.get<any[]>(`/research/metrics/${filename}`);
  return response.data;
};

export const getModelInfo = async (): Promise<ModelInfo> => {
  const response = await apiClient.get<ModelInfo>('/research/model-info');
  return response.data;
};

// Allowlist & Blocklist
export const getAllowlist = async (): Promise<ListEntry[]> => {
  const response = await apiClient.get<ListEntry[]>('/allowlist');
  return response.data;
};

export const addToAllowlist = async (pattern: string, description: string): Promise<ListEntry> => {
  const response = await apiClient.post<ListEntry>('/allowlist', { pattern, description });
  return response.data;
};

export const deleteFromAllowlist = async (id: number): Promise<void> => {
  await apiClient.delete(`/allowlist/${id}`);
};

export const getBlocklist = async (): Promise<ListEntry[]> => {
  const response = await apiClient.get<ListEntry[]>('/blocklist');
  return response.data;
};

export const addToBlocklist = async (pattern: string, description: string): Promise<ListEntry> => {
  const response = await apiClient.post<ListEntry>('/blocklist', { pattern, description });
  return response.data;
};

export const deleteFromBlocklist = async (id: number): Promise<void> => {
  await apiClient.delete(`/blocklist/${id}`);
};

// Settings
export const getSettings = async (): Promise<SettingItem[]> => {
  const response = await apiClient.get<SettingItem[]>('/settings');
  return response.data;
};

export const updateSetting = async (key: string, value: string): Promise<void> => {
  await apiClient.put('/settings', { key, value });
};

// Auth & User Management API
export const loginApi = async (username: string, password: string): Promise<{ token: string; username: string; role: 'Admin' | 'User'; expiresAt: string }> => {
  const response = await apiClient.post('/auth/login', { username, password });
  return response.data;
};

export const getMeApi = async (): Promise<{ isAuthenticated: boolean; username: string | null; role: 'Admin' | 'User' | null }> => {
  const response = await apiClient.get('/auth/me');
  return response.data;
};

export const getUsersApi = async (): Promise<any[]> => {
  const response = await apiClient.get('/auth/users');
  return response.data;
};

// User Report API
export const submitUserReportApi = async (url: string, threatType: string, reason: string): Promise<{ message: string; id: number }> => {
  const response = await apiClient.post('/user/report', { url, threatType, reason });
  return response.data;
};
