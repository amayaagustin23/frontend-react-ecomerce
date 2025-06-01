export type User = {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'ADMIN' | 'SELLER';
};
