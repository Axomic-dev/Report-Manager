import { DocumentTier, EntityId } from './boufin';

export type AnyObject = Record<string, unknown> | Record<string, never>;

export interface Credentials {
  unique: string;
  bank?: EntityId;
  servipag?: AnyObject;
}

export interface CredentialsPlus {
  unique: string;
  bank: EntityId;
  servipag?: AnyObject;
}

export interface CredentialsPremium {
  unique: string;
  bank: EntityId;
  servipag: AnyObject;
}

export interface MessageCreate {
  tier: DocumentTier;
  username: Credentials;
  password: Credentials;
}

export interface MessageRecover {
  reportId?: string;
}

export interface BoufinRequest {
  request: string;
  username: string;
  password: string;
}

export interface PubsubRequest {
  docId: string;
  tier: DocumentTier;
  jobs: Array<BoufinRequest>;
}
