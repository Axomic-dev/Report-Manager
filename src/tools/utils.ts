import { createHmac, privateDecrypt, constants } from 'crypto';

export function hash(target: string, key: string) {
  return createHmac('sha256', key).update(target).digest('hex');
}

export function decrypt(encryptedText: string, privateKey: string) {
  return privateDecrypt(
    {
      key: privateKey,
      padding: constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256'
    },
    Buffer.from(encryptedText, 'base64')
  ).toString('utf-8');
}
