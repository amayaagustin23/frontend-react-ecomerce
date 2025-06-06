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

export type SubcategoryDto = {
  id?: string;
  name: string;
  description: string;
};

export type UpdateCategoryDto = {
  name?: string;
  description?: string;
  subcategories?: SubcategoryDto[];
  subcategoriesToUpdate?: SubcategoryDto[];
  subcategoriesToDelete?: string[];
};
