import dotenv from 'dotenv';

dotenv.config();

const getEnv = (variable: string, defaultValue: string | undefined = undefined): string => {
  const value = process.env[variable] || defaultValue;
  if (typeof value !== 'undefined') {
    return value;
  } else {
    throw new Error(`Variable '${variable}' is missing`);
  }
};

const optionsNodeEnv = ['production', 'development', 'beta', 'test'];
if (!optionsNodeEnv.includes(process.env.NODE_ENV || 'development')) {
  throw new Error(
    'The NODE_ENV environment variable is required but was not specified or is not production, development, beta, test.'
  );
}

export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';
export const IS_DEV = NODE_ENV === 'development';
export const IS_BETA = NODE_ENV === 'beta';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_TEST = NODE_ENV === 'test';
export const PORT = process.env.PORT || '8080';

// GCP Function variables
const FIRESTORE_COLLECTION_PREFIX = getEnv('FIRESTORE_COLLECTION_PREFIX', '');
const MANAGER_COLLECTION_NAME = getEnv('MANAGER_COLLECTION_NAME');
export const GCP_PROJECT = getEnv('GCP_PROJECT');
export const GCP_SUBSCRIPTION = getEnv('GCP_SUBSCRIPTION');
export const FIRESTORE_MANAGER_COLLECTION_NAME = `${FIRESTORE_COLLECTION_PREFIX}${MANAGER_COLLECTION_NAME}`;
export const CRYPTO_SECRET_KEY = getEnv('CRYPTO_SECRET_KEY');
export const PRIVATE_KEY = getEnv('PRIVATE_KEY');
