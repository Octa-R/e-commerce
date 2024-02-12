import { compareAsc, compareDesc, isAfter } from "date-fns";
import { firestore } from "../lib/firebase";
import { Model } from "./model";
import { FirebaseOrderData, OrderState } from "types";

export class Order extends Model {
  static collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > = firestore.collection("orders");
  ref: FirebaseFirestore.DocumentReference;
  data: FirebaseOrderData;
  id: string;
  constructor(id: string) {
    super(id);
    this.ref = Order.collection.doc(id);
  }

  static async create(data: any): Promise<Order> {
    const docRef = await this.collection.add(data);
    const object = await docRef.get();
    const newObject = new Order(object.id);
    newObject.data = data;
    return newObject;
  }

  static async setPaidStatus(orderId: string) {
    const order = new Order(orderId);
    await order.pull();
    order.data.state = OrderState.PAID;
    await order.push();
    return order;
  }

  static async getByUserId(userId: string): Promise<any[]> {
    const snapshot = await this.collection.where("user.id", "==", userId).get();
    return snapshot.docs
      .map((snap) => {
        const orderData = snap.data();
        return {
          id: snap.id,
          state: orderData.state,
          total: orderData.total,
          createdAt: orderData.createdAt.toDate(),
        };
      })
      .sort((a, b) => compareDesc(a.createdAt, b.createdAt));
  }
}
