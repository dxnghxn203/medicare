"use client";

import { is } from "date-fns/locale";

export interface PriceItem {
  price_id: string;
  original_price: number;
  discount: number;
  unit: string;
  amount: number;
  weight: number;
  inventory: number;
  expired_date: string;
}

export interface IngredientItem {
  ingredient_name: string;
  ingredient_amount: string;
}

export interface Manufacturer {
  manufacture_name: string;
  manufacture_address: string;
  manufacture_contact: string;
}

export interface Category {
  main_category_name: string;
  main_category_slug: string;
  child_category_name: string;
  child_category_slug: string;
  sub_category_name: string;
  sub_category_slug: string;
  main_category_id: string;
  child_category_id: string;
  sub_category_id: string;
}

export interface ProductFormData {
  product_id: string;
  product_name: string;
  slug: string;
  name_primary: string;
  origin: string;
  description: string;
  brand: string;
  uses: string;
  dosage_form: string;
  registration_number: string;
  dosage: string;
  side_effects: string;
  precautions: string;
  storage: string;
  full_descriptions: string;
  prescription_required: boolean;
  rejected_note: string;
  prices: PriceItem[];
  ingredients: IngredientItem[];
  manufacturer: Manufacturer;
  category: Category;
  selectedCategories: {
    main: string;
    sub: string;
    child: string;
  };
}

export interface ProductFormProps {
  formData: ProductFormData;
  updateFormData: (updates: Partial<ProductFormData>) => void;
  errors: Record<string, string>;
  hasError: (fieldName: string) => boolean;
  isViewOnly: boolean;
  productId: string;
  verified_by: string;
  is_approved: boolean;
}

export interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <p className="text-red-500 text-xs mt-1">{message}</p>
);
