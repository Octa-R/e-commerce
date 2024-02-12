import { MercadoPagoConfig, MerchantOrder, Preference } from "mercadopago";
import { MerchantOrderResponse } from "mercadopago/dist/clients/merchantOrder/commonTypes";
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";
import type { PreferenceCreateData } from "mercadopago/dist/clients/preference/create/types";

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_TOKEN,
  options: { timeout: 5000, idempotencyKey: "abc" },
});

export async function getMerchantOrder(
  id: string | number
): Promise<MerchantOrderResponse> {
  const merchantOrder = new MerchantOrder(client);
  return await merchantOrder.get({
    merchantOrderId: id,
  });
}

export async function createPreference(
  preferenceData: PreferenceCreateData
): Promise<PreferenceResponse> {
  const preference = new Preference(client);
  return await preference.create(preferenceData);
}
