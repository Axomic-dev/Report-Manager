import { createHmac } from 'crypto';

export function hash(target: string, key: string) {
  return createHmac('sha256', key).update(target).digest('hex');
}
