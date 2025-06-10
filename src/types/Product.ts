export type Variant = {
  id: string;
  size: string;
  color: string;
  stock: number;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  isService: boolean;
  isActive: boolean;
  hasDelivery: boolean;
  isFavorite?: boolean;
  category: {
    id: string;
    name: string;
    subcategories: any[];
  };
  brand?: {
    id: string;
    name: string;
    code?: string | null;
  };
  variants: Variant[];
  images: {
    id: string;
    url: string;
    order: number;
  }[];
};

export type Color = {
  id: string;
  name: string;
  hex: string;
};

export type Size = {
  id: string;
  name: string;
};

export type Gender = {
  id: string;
  name: string;
};

export type DetailedVariant = {
  id: string;
  stock?: number;
  productId?: string;
  colorId?: string;
  sizeId?: string;
  genderId?: string;
  color?: Color;
  size?: Size;
  gender?: Gender;
  images?: {
    id: string;
    url: string;
    description: string;
    order: number;
    type: 'VARIANT';
    productId: string | null;
    variantId: string;
    categoryId: string | null;
    brandId: string | null;
    userId: string | null;
    configId: string | null;
    bannerId: string | null;
  }[];
};

export type DetailedProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  isService: boolean;
  isActive: boolean;
  hasDelivery: boolean;
  isFavorite?: boolean;
  category: {
    id: string;
    name: string;
    subcategories: any[];
  };
  brand?: {
    id: string;
    name: string;
    code?: string | null;
  };
  variants: DetailedVariant[];
  images: {
    id: string;
    url: string;
    description?: string;
    order: number;
    type: string;
    productId?: string;
    variantId?: string;
    categoryId?: string;
    brandId?: string;
    userId?: string;
    configId?: string;
    bannerId?: string;
  }[];
};

export interface VariantFormValue extends Omit<Partial<Variant>, 'color' | 'size' | 'gender'> {
  color?:
    | {
        id: string;
        name: string;
        hex: string;
      }
    | string;
  size?: string;
  gender?: string;
  images?: { id: string; url: string }[];
  newFiles?: any[];
  tempId?: string;
}

export interface ProductFormValues
  extends Omit<Product, 'id' | 'images' | 'variants' | 'category' | 'brand'> {
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  variants?: VariantFormValue[];
  files?: any[];
}
