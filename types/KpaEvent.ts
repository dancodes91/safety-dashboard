export interface KpaEvent {
  _id?: string;
  reportNumber: string;
  link?: string;
  observer: string;
  employeeId: string;
  employeeName: string;
  division: string;
  homePlant: string;
  hireDate: Date;
  hireDuration: string;
  supervisor: string;
  eventType: string;
  unitNumber: string;
  equipmentType: string;
  jobNumber: string;
  dateTime: Date;
  location: string;
  plant: string;
  videoLink?: string;
  description: string;
  injuries: boolean;
  preventability: string;
  eventCategory: string;
  severityRating: number;
  createdAt?: Date;
  updatedAt?: Date;
}