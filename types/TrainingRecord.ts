export interface TrainingRecord {
  _id?: string;
  employeeId: string;
  employeeName: string;
  division: string;
  plant: string;
  trainingType: string;
  trainingName: string;
  completionDate: Date;
  expirationDate?: Date;
  status: string;
  instructor: string;
  score: number;
  createdAt?: Date;
  updatedAt?: Date;
}