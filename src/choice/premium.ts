import { CredentialsPremium } from '../interfaces';
import { decrypt, hash } from '../tools/utils';
import { CRYPTO_SECRET_KEY, PRIVATE_KEY } from '../config';
import { DocumentTier } from '../boufin';

export default function (user: CredentialsPremium, pass: CredentialsPremium) {
  const requests = ['afc:consolidate', 'cmf:debt', 'sii:tax-folder'];
  const today = new Date().toUTCString();
  const username = decrypt(user.unique, PRIVATE_KEY);
  const password = decrypt(pass.unique, PRIVATE_KEY);
  return {
    docId: hash(username + today, CRYPTO_SECRET_KEY),
    tier: DocumentTier.PREMIUM,
    jobs: requests.map((action) => ({ action, username, password }))
  };
}
