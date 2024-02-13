import { firestore } from "../lib/firebase";
import { Model } from "./model";

export class BatchLog extends Model {
  static collection: FirebaseFirestore.CollectionReference<
    FirebaseFirestore.DocumentData,
    FirebaseFirestore.DocumentData
  > = firestore.collection("batch_logs");
  ref: FirebaseFirestore.DocumentReference;
  data: any;
  id: string;
  constructor(id: string) {
    super(id);
    this.ref = BatchLog.collection.doc(id);
  }

  static async create(data: any): Promise<BatchLog> {
    const docRef = await this.collection.add(data);
    const object = await docRef.get();
    const newObject = new BatchLog(object.id);
    newObject.data = data;
    return newObject;
  }
}
