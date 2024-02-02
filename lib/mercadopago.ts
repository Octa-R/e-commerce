import { MercadoPagoConfig, MerchantOrder, Preference } from "mercadopago";

const client = new MercadoPagoConfig({
	accessToken: process.env.MP_TOKEN,
	options: { timeout: 5000, idempotencyKey: "abc" },
});

export async function getMerchantOrder(id: string | number) {
	const merchantOrder = new MerchantOrder(client);
	return await merchantOrder.get({ merchantOrderId: id });
}

export async function createPreference(order) {
	const preference = new Preference(client);
	const newPref = {
		body: {
			items: order.items,
			payer: order.payer,
			external_reference: order.id,
			notification_url: process.env.NOTIFICATION_URL,
		},
	};
	return await preference.create(newPref);
}
