export interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  division: string;
  plant: string;
  supervisor: string;
  createdAt?: Date;
  updatedAt?: Date;
}