import React from 'react';
import '@testing-library/jest-dom';
import {render, screen, waitFor, act} from '@testing-library/react';
import {jest, describe, beforeEach, test, expect} from '@jest/globals';

// Define types for better type checking
interface Category {
    main_category_slug: string;
    main_category_name: string;
    sub_category_slug: string;
    sub_category_name: string;
    child_category_name: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    category: Category;
}

// Mock the hooks and components
jest.mock('@/hooks/useProduct');
jest.mock('@/components/Product/detailProduct', () => ({product}: { product: Product }) => (
    <div data-testid="product-detail">{product.name}</div>
));
jest.mock('@/components/Product/productsRelatedList', () => ({product}: { product: Product }) => (
    <div data-testid="related-products">{product.id}</div>
));
jest.mock('@/app/loading', () => () => <div data-testid="loading"/>);
jest.mock('next/link', () => ({children, href}: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">{children}</a>
));

describe('ProductPage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders loading state initially', () => {
        // Mock implementation
        const mockFetchProductBySlug = jest.fn();
        const useProductMock = {
            fetchProductBySlug: mockFetchProductBySlug,
            productBySlug: null
        };

        require('@/hooks/useProduct').useProduct.mockReturnValue(useProductMock);

        // Import and render component
        const ProductPage = require('@/app/chi-tiet-san-pham/[slug]/page').default;
        render(<ProductPage params={{slug: 'test-product'}}/>);

        // Check loading state is displayed
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(mockFetchProductBySlug).toHaveBeenCalledWith(
            'test-product',
            expect.any(Function),
            expect.any(Function)
        );
    });

    // test('renders product details when product is loaded', async () => {
    //     // Mock product data
    //     const mockProduct = {
    //         id: '123',
    //         name: 'Test Product',
    //         slug: 'test-product',
    //         category: {
    //             main_category_slug: 'main',
    //             main_category_name: 'Main Category',
    //             sub_category_slug: 'sub',
    //             sub_category_name: 'Sub Category',
    //             child_category_name: 'Child Category'
    //         }
    //     };
    //
    //     // Mock implementation with success callback execution
    //     const mockFetchProductBySlug = jest.fn((slug, onSuccess, onError) => {
    //         setTimeout(() => onSuccess(), 0);
    //     });
    //
    //     const useProductMock = {
    //         fetchProductBySlug: mockFetchProductBySlug,
    //         productBySlug: mockProduct
    //     };
    //
    //     require('@/hooks/useProduct').useProduct.mockReturnValue(useProductMock);
    //
    //     // Import and render component
    //     const ProductPage = require('@/app/chi-tiet-san-pham/[slug]/page').default;
    //
    //     act(() => {
    //         render(<ProductPage params={{slug: 'test-product'}}/>);
    //     });
    //
    //     // Wait for loading to complete
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    //         expect(screen.getByTestId('product-detail')).toBeInTheDocument();
    //         expect(screen.getByTestId('related-products')).toBeInTheDocument();
    //         expect(screen.getByText('Những sản phẩm liên quan')).toBeInTheDocument();
    //     });
    // });
    //
    // test('renders not found message when product is not available', async () => {
    //     // Mock implementation with success callback but no product
    //     const mockFetchProductBySlug = jest.fn((slug, onSuccess, onError) => {
    //         setTimeout(() => onSuccess(), 0);
    //     });
    //
    //     const useProductMock = {
    //         fetchProductBySlug: mockFetchProductBySlug,
    //         productBySlug: null
    //     };
    //
    //     require('@/hooks/useProduct').useProduct.mockReturnValue(useProductMock);
    //
    //     // Import and render component
    //     const ProductPage = require('@/app/chi-tiet-san-pham/[slug]/page').default;
    //
    //     act(() => {
    //         render(<ProductPage params={{slug: 'non-existent-product'}}/>);
    //     });
    //
    //     // Wait for loading to complete
    //     await waitFor(() => {
    //         expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    //         expect(screen.getByText('Không tìm thấy sản phẩm')).toBeInTheDocument();
    //         expect(screen.getByText('Xin lỗi, chúng tôi không thể tìm thấy sản phẩm bạn đang tìm kiếm.')).toBeInTheDocument();
    //     });
    // });
});