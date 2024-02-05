import { firestore } from "../lib/firebase";
import { cleanEmail } from "../utils";
import { Model } from "./model";

export class Product extends Model {
	static collection: FirebaseFirestore.CollectionReference<
		FirebaseFirestore.DocumentData,
		FirebaseFirestore.DocumentData
	> = firestore.collection("products");
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: string;
	constructor(id: string) {
		super(id);
		this.ref = Product.collection.doc(id);
	}

	static async create(data: any): Promise<Product> {
		const docRef = await this.collection.add(data);
		const object = await docRef.get();
		const newObject = new Product(object.id);
		newObject.data = data;
		return newObject;
	}
}
