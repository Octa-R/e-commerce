import { getAllProducts, updateproducts } from "lib/airtable";
import { createPreference } from "lib/mercadopago";
import { Order } from "models/order";
import { PreferenceResponse } from "mercadopago/dist/clients/preference/commonTypes";
import {
  FirebaseOrderData,
  ItemsOrder,
  MPItemsData,
  OrderData,
  OrderState,
  ProductData,
} from "types";
import _ from "lodash";

function orderTotalAmount(itemsOrder: MPItemsData[]) {
  return itemsOrder
    .map((item) => item.quantity * item.unit_price)
    .reduce((acc: any, subtotal: any) => acc + subtotal, 0);
}

export async function getUserOrders(userId: string) {
  return await Order.getByUserId(userId);
}

export async function createNewOrder({
  orderData,
  userData,
}: {
  orderData: OrderData;
  userData: any;
}) {
  //recuperar productos segun los id enviados
  const itemsData = await getAllProducts({
    filter: { products: orderData.items },
  });

  if (!itemsData) {
    throw "no existe el producto";
  }

  //chequear stock
  const mpOrderDataItems: MPItemsData[] = orderData.items.map((orderItem) => {
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
  });

  //calcular total
  const totalAmount = orderTotalAmount(mpOrderDataItems);

  //crear orden en nuestra bd firebase
  const firebaseOrderData: FirebaseOrderData = {
    user: userData,
    items: mpOrderDataItems,
    createdAt: new Date(),
    updatedAt: new Date(),
    state: OrderState.PENDING,
    total: totalAmount,
  };

  const newOrder: Order = await Order.create(firebaseOrderData);
  newOrder.push();

  //crear preferencia en mp
  const mpCreatePreference: PreferenceResponse = await createPreference({
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
  await updateproducts(orderData.items);

  return mpCreatePreference;
}
