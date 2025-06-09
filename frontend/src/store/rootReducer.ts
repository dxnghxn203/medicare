import {combineReducers} from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';
import productReducer from './product/productSlice';
import orderReducer from './order/orderSlice';
import locationReducer from './location/locationSlice';
import categoryReducer from './category/categorySlice';
import userReducer from "./user/userSlice";
import reviewReducer from "./review/reviewSlice";
import chatReducer from "./chat/chatSlice";
import voucherReducer from "./voucher/voucherSlice";
import brandReducer from "./brand/brandSlice";
import articleReducer from "./article/articleSlice";
import documentReducer from "./document/documentSlice";

// Import other reducers here

const reducer = combineReducers({
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    location: locationReducer,
    category: categoryReducer,
    user: userReducer,
    review: reviewReducer,
    chat: chatReducer,
    voucher: voucherReducer,
    brand: brandReducer,
    article: articleReducer,
    document: documentReducer
});

const rootReducer = (state: any, action: any) => {
    return reducer(state, action);
};

export default rootReducer;
