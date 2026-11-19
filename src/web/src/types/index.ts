export type FinalLabel = 'BENIGN' | 'PHISHING' | 'ADULT';
export type FinalAction = 'ALLOW' | 'BLOCK';

export interface XaiFactor {
  title: string;
  type: 'RISK' | 'TRUST';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'SAFE';
  evidence: string;
  description: string;
}

export interface XaiFeature {
  name: string;
  key: string;
  value: string | number;
  benchmark: string;
  status: 'DANGER' | 'WARNING' | 'SAFE';
  explanation: string;
}

export interface XaiExplanation {
  verdict: string;
  summary: string;
  factors: XaiFactor[];
  features: XaiFeature[];
  recommendations: string[];
}

export interface ScanResult {
  id?: number;
  url: string;
  label: FinalLabel;
  action: FinalAction;
  confidence: number;
  reason: string;
  phishing_score?: number;
  adult_score?: number;
  phishing_threshold?: number;
  adult_threshold?: number;
  phishingScore?: number;
  adultScore?: number;
  phishingThreshold?: number;
  adultThreshold?: number;
  created_at?: string;
  createdAt?: string;
  is_whitelisted?: boolean;
  is_blacklisted?: boolean;
  userId?: string;
  xai?: XaiExplanation;
}

export interface RecentScanItem {
  id: number;
  url: string;
  label: FinalLabel;
  action: FinalAction;
  confidence: number;
  phishingScore?: number;
  adultScore?: number;
  reason: string;
  createdAt: string;
}

export interface TrendDay {
  date: string;
  benign: number;
  phishing: number;
  adult: number;
  total: number;
}

export interface DashboardSummary {
  totalScans: number;
  allowed: number;
  blocked: number;
  phishingDetected: number;
  adultDetected: number;
  modelStatus: string;
  activeSecurityModel: string;
  activeAdultModel: string;
  securityThreshold: number;
  adultThreshold: number;
  recentTrend: TrendDay[];
}

export interface ResearchModelMetric {
  branch: string;
  model_name: string;
  test_set: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  pr_auc: number;
}

export interface ResearchSummary {
  totalResearchModels: number;
  securityBestModel: string;
  securityThreshold: number;
  adultBestModel: string;
  adultThreshold: number;
  featureCount: number;
  datasetStats: {
    totalUrls: number;
    benignCount: number;
    phishingCount: number;
    adultCount: number;
  };
  availableMetricsFiles: string[];
  availableFigureFiles: string[];
}

export interface ModelInfo {
  status: string;
  artifact_name: string;
  security_model: string;
  adult_model: string;
  security_threshold: number;
  adult_threshold: number;
  feature_count: number;
  final_labels: string[];
  actions: Record<string, string>;
  priority: string;
  zero_crawl_policy: boolean;
}

export interface ListEntry {
  id: number;
  pattern: string;
  description: string;
  createdAt: string;
}

export interface SettingItem {
  key: string;
  value: string;
  description?: string;
}

export type UserRole = 'Admin' | 'User';

export interface AuthUser {
  username: string;
  role: UserRole;
  token?: string;
}

export interface UserSummary {
  id: string;
  username: string;
  role: UserRole;
  createdAt: string;
  scanCount: number;
}

export interface UserReportRequest {
  url: string;
  threatType: 'PHISHING' | 'ADULT' | 'MALWARE';
  reason: string;
}
