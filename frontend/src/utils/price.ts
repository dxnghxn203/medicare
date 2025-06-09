export const getPriceFromProduct = (product: any, price_id: any) => {
    const price = product?.prices.find(
        (price: any) => price.price_id === price_id
    );
    return price;
}