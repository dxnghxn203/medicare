
export const selectCart = (state: any) => state.cart.cart || [];
export const selectCartLocal = (state: any) => state.cart.cartlocal || [];
export const selectCartLoading = (state: any) => state.cart.loading;
export const selectCartError = (state: any) => state.cart.error;
export const selectCartSelected = (state: any) => state.cart.cartSelected;