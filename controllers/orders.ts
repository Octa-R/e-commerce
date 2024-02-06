import { getAllProducts, updateproducts } from "lib/airtable";
import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { ItemsOrder, OrderStatus } from "types";

function orderTotalAmount(itemsOrder: ItemsOrder) {
	return itemsOrder
		.map(
			(item: { quantity?: number; unit_price?: number }) =>
				item.quantity * item.unit_price
		)
		.reduce((acc: any, subtotal: any) => acc + subtotal, 0);
}

export async function createNewOrder({ items, userData }) {
	//recuperar productos segun los id enviados
	const itemsData = await getAllProducts({
		filter: { products: items },
	});

	if (!itemsData) {
		throw "no existe el producto";
	}

	//chequear stock
	const mpOrderDataItems = items.map(
		(orderItem: { id: string; quantity: number }) => {
			const productData = itemsData.find((p) => p.id === orderItem.id);

			if (!productData) {
				throw "producto no encontrado";
			}
			if (productData.stock < orderItem.quantity) {
				throw "no hay stock";
			}
			return {
				id: productData.id,
				unit_price: productData.price,
				quantity: orderItem.quantity,
				title: productData.title,
			};
		}
	);

	//calcular total
	const totalAmount = orderTotalAmount(items);

	//crear orden en nuestra bd firebase
	const firebaseOrderData = {
		user: userData,
		items: mpOrderDataItems,
		state: OrderStatus.PAYMENT_PENDING,
		total: totalAmount,
	};

	const newOrder: Order = await Order.create(firebaseOrderData);
	newOrder.push();

	//crear preferencia en mp
	const mpCreatePreference = createPreference({
		body: {
			external_reference: newOrder.id,
			items: mpOrderDataItems,
			notification_url: process.env.NOTIFICATION_URL,
			payer: userData,
		},
	});

	//se resta el stock en nuestra bd y asi
	//queda reservado hasta que se pague la orden
	//en caso de que se cancele la orden, el stock vuelve a sumarse
	const airtableUpdate = updateproducts(items);

	const [updatedProducts, mpResponse] = await Promise.all([
		airtableUpdate,
		mpCreatePreference,
	]);
	console.log({ updatedProducts, mpResponse });
	return { ok: true };
}
