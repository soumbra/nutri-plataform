export interface ProgressRecord {
  id: string;
  userId: string;
  weight: number;
  bodyFat?: number;
  muscle?: number;
  notes?: string;
  photos: string[];
  recordDate: string;
  createdAt: string;
}

export interface ProgressStats {
  totalRecords: number;
  trends: {
    weightTrend: 'gaining' | 'losing' | 'stable';
    periodDays: number;
  };
  lastRecord: ProgressRecord | null;
  averageWeight: number;
}

export interface CreateProgressRequest {
  weight: number;
  bodyFat?: number;
  muscle?: number;
  notes?: string;
  recordDate?: string;
  photos?: string[];
}

export interface UpdateProgressRequest {
  weight?: number;
  bodyFat?: number;
  muscle?: number;
  notes?: string;
  recordDate?: string;
  photos?: string[];
}

export interface ProgressFilters {
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}