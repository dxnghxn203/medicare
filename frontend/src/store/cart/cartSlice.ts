import { CartState, CartItem } from "@/types/cart";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: CartState = {
    cartlocal: [] as CartItem[],  
    cart: [],      
    cartSelected: [],
    loading: false,
    error: null,
};

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // cart local
        addCartLocal: (state, action: PayloadAction<CartItem>) => {
            
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
            }
            const existingItem = state.cartlocal.find(
                item => item.id === action.payload.id && item.unit === action.payload.unit
            );
        
            if (existingItem) {
                
                existingItem.quantity += action.payload.quantity;
            } else {
                
                state.cartlocal.push(action.payload);
            }
        },
        
        updateQuantityCartLocal: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: item.quantity + action.payload.quantity };
                }
                return item;
            });
        },
        updateUnitCartLocal: (state, action: PayloadAction<{ id: string; unit: string }>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.map((item) => {
                if (item.id === action.payload.id) {
                    return { ...item, unit: action.payload.unit };
                }
                return item;
            });
        },
        removeCartLocal: (state, action: PayloadAction<string>) => {
            if (!Array.isArray(state.cartlocal)) {
                state.cartlocal = [];
                return;
            }
            
            state.cartlocal = state.cartlocal.filter((item) => item.id !== action.payload);
        },
        clearCartLocal: (state) => {
            state.cartlocal = [];
        },

        // product selected
        addCartSelected: (state, action: PayloadAction<string[]>) => {
            if (!Array.isArray(state.cartSelected)) {
                state.cartSelected = [];
            }

            state.cartSelected = action.payload;
        },
        removeCartSelected: (state, action: PayloadAction<string>) => {
            state.cartSelected = state.cartSelected.filter((item) => item !== action.payload);
        },

        // add cart
        addCartStart: (state) => {
            state.loading = true;
        },
        addCartSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = null;
        },
        addCartFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // get cart
        getCartStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
        },
        getCartSuccess: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.cart = action.payload;
            state.error = null;
        },
        getCartFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },

        // add to cart session
        addToCartStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
            
        },  
        addToCartSuccess: (state) => {
            state.loading = false;
        },
        addToCartFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        },
        // remove cart session
        removeCartStart: (state, action: PayloadAction<any>) => {
            state.loading = true;
        },
        removeCartSuccess: (state) => {
            state.loading = false;
        },
        removeCartFailure: (state, action: PayloadAction<any>) => {
            state.loading = false;
            state.error = action.payload;
        }
    },
});

export const {
    addCartLocal,
    updateQuantityCartLocal,
    updateUnitCartLocal,
    removeCartLocal,
    clearCartLocal,

    addCartSelected,
    removeCartSelected,

    addCartStart,
    addCartSuccess,
    addCartFailure,

    getCartStart,
    getCartSuccess,
    getCartFailure,

    addToCartStart,
    addToCartSuccess,
    addToCartFailure,

    removeCartStart,
    removeCartSuccess,
    removeCartFailure,
} = cartSlice.actions;

export default cartSlice.reducer;


