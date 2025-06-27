export interface KpiGoal {
  _id?: string;
  metricName: string;
  description: string;
  targetValue: number;
  yellowThreshold: number;
  redThreshold: number;
  unit: string;
  division: string;
  plant: string;
  applicableTo: string;
  effectiveDate: Date;
  expirationDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}