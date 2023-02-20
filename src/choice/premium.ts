import { CredentialsPremium } from '../interfaces';
import { hash } from '../tools/utils';
import { CRYPTO_SECRET_KEY } from '../config';

export default function (user: CredentialsPremium, pass: CredentialsPremium) {
  const requests = ['afc:consolidate', 'cmf:debt', 'sii:tax-folder'];
  const today = new Date().toUTCString();
  const username = user.unique;
  const password = pass.unique;
  return {
    docId: hash(username + today, CRYPTO_SECRET_KEY),
    data: requests.map((request) => ({ request, username, password }))
  };
}
