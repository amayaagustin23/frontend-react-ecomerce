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

export interface VariantFormValue extends Omit<Partial<Variant>, 'color'> {
  color?: string | { metaColor: { toHexString: () => string } };
}

export interface ProductFormValues
  extends Omit<Product, 'id' | 'images' | 'variants' | 'category' | 'brand'> {
  category?: { id: string; name: string };
  brand?: { id: string; name: string };
  variants?: VariantFormValue[];
  files?: any[];
}
