import {JSEncrypt} from "jsencrypt";

const publicKey = 'MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAMbFUgBEsev1lURtNFgfr0jtz4IDJ6MEyIkA2WM' +
  'G57bPfSsT4Pei7bxsXUCyMTXQbaxV0SThX802gxrpTEBAbJsCAwEAAQ==';

export default {

  encrypt(word) {
    // console.log("rsa加密前：",word)
    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(publicKey);
    let encrypted = encrypt.encrypt(word)
    // console.log("rsa加密后：",encrypted)
    return encrypted;
  },
}

