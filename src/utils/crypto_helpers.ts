import crypto from 'crypto';
import { ethers } from 'ethers';

export function hashPDFData(data: Uint8Array) {
  const hash = crypto.createHash('sha256');
  hash.update(data);
  const hashValue = hash.digest('hex');
  return hashValue;
}



export function verifySignature(
  message: string,
  signature: string,
  signerPublicKey: string
): boolean {
  const recoveredAddress = ethers.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === signerPublicKey.toLowerCase();
}