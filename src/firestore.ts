import { Firestore } from '@google-cloud/firestore';
import { GCP_PROJECT, FIRESTORE_MANAGER_COLLECTION_NAME } from './config';
import { AnyObject } from './interfaces';

const firestore: Firestore = new Firestore({
  projectId: GCP_PROJECT,
  timestampsInSnapshots: true
});

export async function createDocument(docId: string) {
  const newDoc = firestore.collection(FIRESTORE_MANAGER_COLLECTION_NAME).doc(docId);
  await newDoc.set({ docId });
}

export async function getDocument(docId: string) {
  const docRef = firestore.collection(FIRESTORE_MANAGER_COLLECTION_NAME).doc(docId);
  return await docRef.get().then((doc) => {
    if (doc.exists) {
      const data = doc.data() as AnyObject;
      if (Object.keys(data).length > 1) {
        return { completed: true, report: data };
      } else {
        return { completed: false, report: {} };
      }
    }
    throw new Error('[Firestore] The document has not been created yet.');
  });
}
