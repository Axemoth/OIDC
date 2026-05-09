import { pem2jwk } from 'pem-jwk';
import { publicKey } from '../config/keys.js';

export const getJwks = () => {
  const jwk = pem2jwk(publicKey);
  return {
    keys: [
      {
        ...jwk,
        use: 'sig',
        alg: 'RS256',
        kid: 'axemoth-key-1'
      }
    ]
  };
};
