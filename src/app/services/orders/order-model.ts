import { Product } from "../products/product-model"

export interface Order {
    id: number,
    userId: number,
    value: number,
    status: string,
}

export interface OrderProduct {
    id: number,
    orderId: number,
    productId: number,
    quantity: number,
    name: string,
    score: number
}

export interface OrderAndProducts {
    id: number,
    order: Order,
    orderProducts: OrderProduct[],
    products: Product[]
}