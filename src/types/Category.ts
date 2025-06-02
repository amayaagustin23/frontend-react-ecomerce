export type Category = {
  id: string;
  name: string;
  description?: string;
  parentId?: string | null;
  parent?: Category | null;
  subcategories: Category[];
  createdAt?: string;
  updatedAt?: string;
};
