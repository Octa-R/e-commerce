import { orderSchema } from "schemas/order.schema";
import { z } from "zod";

export interface ProductData {
  id: string;
  title: string;
  price: number;
  color: string;
  stock: number;
  active: boolean;
}

export interface FirebaseOrderData {
  user: any;
  items: any;
  createdAt: Date;
  updatedAt: Date;
  state: OrderState;
  total: number;
}

export interface MPItemsData {
  id: string;
  unit_price: number;
  quantity: number;
  title: string;
}
export interface AlgoliaProductData {
  objectID?: string;
  title: string;
  productId: string;
}

export type ItemsOrder = { id?: string; quantity?: number }[];

export enum OrderState {
  PENDING = "PENDING", // Esperando el pago
  PAID = "PAID", // Pago completado
  CANCELED = "CANCELED", // Orden cancelada
}

export type OrderData = z.infer<typeof orderSchema>;
