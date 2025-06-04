export type Address = {
  id: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
  lat: number | null;
  lng: number | null;
  userId: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  phone: string;
  cuitOrDni: string;
  role: 'CLIENT' | 'ADMIN' | 'SELLER';
  points: number;
  addresses: Address[];
};

export type AddressInputDto = {
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    lat?: number | null;
    lng?: number | null;
  };
};
