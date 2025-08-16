export interface Application {
  id: number;
  company: string;
  role: string;
  status: string;
  // TODO: Make this into Date type if the data coming from backend is incompatible.
  date: string;
}
