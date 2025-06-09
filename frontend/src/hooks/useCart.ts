import { useDispatch, useSelector } from 'react-redux';

import { CartItem } from '@/types/cart';
import { addCartSelected, addCartLocal, clearCartLocal, removeCartLocal, selectCartError, selectCartLoading, selectCartLocal, updateQuantityCartLocal, updateUnitCartLocal, selectCartSelected, removeCartSelected, addToCartStart, getCartStart, selectCart, removeCartStart } from '@/store';

export function useCart() {
    const dispatch = useDispatch();

    const cartLocal = useSelector(selectCartLocal);
    const isLoading = useSelector(selectCartLoading);
    const error = useSelector(selectCartError);
    const cart = useSelector(selectCart);

    const addToCart = (item: CartItem) => {
        dispatch(addCartLocal(item));
    };

    const getProductFromCart = (
        onSuccess: () => void,
        onFailure: (error: string) => void
    ) => {
        dispatch(getCartStart({
            onSuccess: onSuccess,
            onFailure: onFailure
        }));
        
    }

    const addProductTocart = (
        product_id: any, 
        price_id: any, 
        quantity: number,
        onSuccess: () => void,
        onFailure: (error: string) => void
    ) => {
        dispatch(addToCartStart({
            product_id: product_id,
            price_id: price_id,
            quantity: quantity,
            onSuccess: onSuccess,
            onFailure: onFailure
        }));
    };

    const removeProductFromCart = (
        product_id: any,
        price_id: any,
        onSuccess: () => void,
        onFailure: (error: string) => void
    ) => {
        dispatch(removeCartStart({
            product_id: product_id,
            price_id: price_id,
            onSuccess: onSuccess,
            onFailure: onFailure
        }));
    };
    
    const updateQuantity = (id: string, quantity: number) => {
        dispatch(updateQuantityCartLocal({ id, quantity }));
    };

    const updateUnit=(id:string, unit: string)=>{
        dispatch(updateUnitCartLocal({id, unit}))
    }

    const removeFromCart = (id: string) => {
        dispatch(removeCartLocal(id));
    };

    const clearCart = () => {
        dispatch(clearCartLocal());
    };

    // const addCartSelectedLocal = (data: string[]) => {
    //     dispatch(addCartSelected(data));
    // };

    // const removeCartSelectedLocal = (id: string) => {
    //     dispatch(removeCartSelected(id));   
    // }
    //const cartSelected = useSelector(selectCartSelected);


    return {
        //cartLocal,
        isLoading,
        error,
        addToCart,
        updateQuantity,
        updateUnit,
        removeFromCart,
        clearCart,
        //cartSelected,
        // addCartSelectedLocal,
        // removeCartSelectedLocal,
        addProductTocart,
        cart,
        getProductFromCart,
        removeProductFromCart
    };
}

