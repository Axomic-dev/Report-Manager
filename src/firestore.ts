import { Firestore } from '@google-cloud/firestore';
import { GCP_PROJECT, FIRESTORE_MANAGER_COLLECTION_NAME } from './config';
import { AnyObject } from './interfaces';

const firestore: Firestore = new Firestore({
  projectId: GCP_PROJECT,
  timestampsInSnapshots: true
});

export async function getDocument(docId: string) {
  const docRef = firestore.collection(FIRESTORE_MANAGER_COLLECTION_NAME).doc(docId);
  return await docRef.get().then((doc) => {
    if (doc.exists) {
      return doc.data() as AnyObject;
    }
    throw new Error('[Firestore] The document has not been created yet.');
  });
}
