import { firestore } from "../lib/firebase";
import { cleanEmail } from "../utils";

export class Auth {
	static collection: FirebaseFirestore.CollectionReference<
		FirebaseFirestore.DocumentData,
		FirebaseFirestore.DocumentData
	> = firestore.collection("auths");
	ref: FirebaseFirestore.DocumentReference;
	data: any;
	id: string;
	constructor(id: string) {
		this.id = id;
		this.ref = Auth.collection.doc(id);
	}

	static async findByEmail(email: string) {
		const cleanedEmail = cleanEmail(email);
		const results = await Auth.collection
			.where("email", "==", cleanedEmail)
			.get();
		if (results.docs.length) {
			const first = results.docs[0];
			const newAuth = new Auth(first.id);
			newAuth.data = first.data();
			return newAuth;
		} else {
			return null;
		}
	}

	static async create(data: any): Promise<Auth> {
		const docRef = await this.collection.add(data);
		const object = await docRef.get();
		const newObject = new Auth(object.id);
		newObject.data = data;
		return newObject;
	}
}
