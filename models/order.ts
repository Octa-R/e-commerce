import { firestore } from "../lib/firebase";

export class Order {
	static collection: FirebaseFirestore.CollectionReference<
		FirebaseFirestore.DocumentData,
		FirebaseFirestore.DocumentData
	> = firestore.collection("orders");
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: string;
	constructor(id: string) {
		this.id = id;
		this.ref = Order.collection.doc(id);
	}

	static async create(data: any): Promise<Order> {
		const docRef = await this.collection.add(data);
		const object = await docRef.get();
		const newObject = new Order(object.id);
		newObject.data = data;
		return newObject;
	}
}
