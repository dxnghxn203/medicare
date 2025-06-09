export interface ProductSliceState {
    listProduct: Product[];
    loading: boolean;
}

interface ProductInStock {
    key: string,
    _id: string,
    name: string,
    uint: string,
    stock: number
}

interface Product {
    id: string;
    name: string;
    price: number;
    discount: number;
    originPrice: number;
    imageSrc: string | StaticImageData;
    unit: string;
    quantity: number
}
interface ProductData {
    id: string,
    discount?: string;
    imageSrc: string | StaticImageData;
    category: string;
    rating: number;
    name: string;
    price: number;
    originPrice?: number;
    unit: string;
    brand: string = "Brand";
}

interface Price {
    id: string;
    price: number;
    original_price: number;
    unitPrice: string;
    discount: number;
    unit: string[];
    amount_per_unit: string;
}

interface Category {
    main_category_id: string;
    main_category_slug: string;
    sub_category_id: string;
    sub_category_slug: string;
    child_category_id: string;
    child_category_slug: string;
    main_category_name: string;
    sub_category_name: string;
    child_category_name: string;

}

interface ProductImage {
    images_id: string;
    images_url: string;
}
interface Manufacturer {
    manufacture_name: string;
    manufacture_address: string;
    manufacture_contact: string;
}
interface Ingredient {
    ingredient_name: string;
    ingredient_amount: string;
}
interface Brand {
    name: string;
    imageSrc: string;
    description: string;
}
interface FullDescription {
    title: string;
    content: string;
}
