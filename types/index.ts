export interface ProductData {
	id: string;
	title: string;
	price: number;
	color: string;
	stock: number;
	active: boolean;
}

export type ItemsOrder = { id: string; quantity: number }[];

export enum OrderStatus {
	PAYMENT_PENDING = "PAYMENT_PENDING", // Esperando el pago
	PAYMENT_COMPLETED = "PAYMENT_COMPLETED", // Pago completado
	CANCELED = "CANCELED", // Orden cancelada
}
