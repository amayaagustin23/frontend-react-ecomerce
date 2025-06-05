export type CreatePersonDto = {
  name: string;
  phone?: string;
  cuitOrDni?: string;
};

export type AddressDto = {
  street?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  lat?: number;
  lng?: number;
};

export type RegisterUserDto = {
  email: string;
  password: string;
  person: CreatePersonDto;
  address?: AddressDto;
};

export type RecoverPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  password: string;
  confirmPassword: string;
  token: string;
};
