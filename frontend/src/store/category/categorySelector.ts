

export const selectAllCategory = (state: any) => state.category.categories;
export const selectMainCategory = (state: any) => state.category.mainCategories;
export const selectSubCategory = (state: any) => state.category.subCategories;
export const selectChildCategory = (state: any) => state.category.childCategories;
export const selectProductByMainSlug = (state: any) => state.category.products;
export const selectCategoryAdmin = (state: any) => state.category.categoryAdmin;
// export const selectUpdateMainCategory = (state: any) => state.category.updateMainCategory;
