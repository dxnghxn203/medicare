
export const selectAuth = (state: any) => state.auth;
export const selectIsAuthenticated = (state: any) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: any) => state.auth.loading;
export const selectAuthError = (state: any) => state.auth.error;
export const selectUserAuth = (state: any) => state.auth.user;
export const selectAdminAuth = (state: any) => state.auth.admin;
export const selectPharmacistAuth = (state: any) => state.auth.pharmacist;