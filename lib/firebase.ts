import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_CONNECTION)
    ),
  });
}

const firestore = admin.firestore();

export { firestore };
