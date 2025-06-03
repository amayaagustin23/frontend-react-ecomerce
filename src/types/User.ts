export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  cuitOrDni: string;
  role: 'CLIENT' | 'ADMIN' | 'SELLER';
  points: number;
};
