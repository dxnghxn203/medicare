
interface ItemCart {
    id: string;
    name: string;
    price: number;
    discount: number;
    originPrice: number;
    imageSrc: string;
    unit: string;
    quantity: number;
}

interface CartState {
    cart: any[];
    cartlocal: Product[];
    cartSelected: string[];
    loading: boolean;
    error: string | null;
}


import { Product } from './product';

export interface CartItem extends Product {
    quantity: number;z
}

export interface CartState {
    cartlocal: CartItem[];
    cart: CartItem[];
    loading: boolean;
    error: string | null;
}

