import { firestore } from "../lib/firebase";
import { cleanEmail } from "../utils";
import { Model } from "./model";
export class User extends Model {
  static collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > = firestore.collection("users");

  ref: FirebaseFirestore.DocumentReference;
  data: any;
  constructor(id: string) {
    super(id);
    this.ref = User.collection.doc(id);
  }

  static async create(data: any): Promise<User> {
    const docRef = await this.collection.add(data);
    const object = await docRef.get();
    const newObject = new User(object.id);
    newObject.data = data;
    return newObject;
  }

  static async findByEmail(email: string) {
    const cleanedEmail = cleanEmail(email);
    const results = await User.collection
      .where("email", "==", cleanedEmail)
      .get();
    if (results.docs.length) {
      const first = results.docs[0];
      const newObj = new User(first.id);
      newObj.data = first.data();
      return newObj;
    } else {
      return null;
    }
  }
}
