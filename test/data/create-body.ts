import { DocumentTier } from '../../src/boufin';

const createBody = {
  tier: DocumentTier.STANDARD,
  username: {
    unique: '111111111'
  },
  password: {
    unique: '00AA001111s'
  }
};

export default createBody;
