// src/utils/crypto.js
import CryptoJS from 'crypto-js';

const secretKey = 'yourSecretKey';

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function decryptData(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
