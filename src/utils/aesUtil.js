import CryptoJS from "crypto-js";

const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
/****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/

export default {

  getAesKey(len) {
    len = len || 32;

    let maxPos = chars.length;
    let keyStr = '';
    for (let i = 0; i < len; i++) {
      keyStr += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    // console.log("生成aesKye：",keyStr)
    return keyStr;
  },

  //aes加密
  encrypt(data, key) {
    // console.log("aes加密前：",data)
    if (!data){
      return data
    }
    let encrypted = "";
    let dataStr = '';
    if (typeof data == "string") {
      // console.log("typeof：string")
      dataStr = CryptoJS.enc.Utf8.parse(data);
      encrypted = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(key), {//这是一个大坑，utf8字符串的密钥必须转换城一个WordArray对象才会被当成密码，否则会被当成生成密码的口令
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    } else if (typeof data == "object") {
      // console.log("typeof：object")
      //对象格式的转成json字符串
      dataStr = JSON.stringify(data);
      // console.log("aes加密前：",dataStr)
      encrypted = CryptoJS.AES.encrypt(dataStr, CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
    }
    // console.log("ase加密后,encrypted：",encrypted)
    // console.log("ase加密后,encrypted.key：",encrypted.key.toString())
    // console.log("ase加密后,encrypted.iv：",encrypted.iv.toString())
    // console.log("ase加密后,encrypted.salt：",encrypted.salt.toString())
    // console.log("ase加密后,encrypted.ciphertext：",encrypted.ciphertext.toString())
    // console.log("ase加密后,encrypted.tostring()：",encrypted.toString())
    //这里有个坑，加密结果是个对象，里面有很多属性。。。
    let encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted.ciphertext.toString());
    // console.log("传给后端：",CryptoJS.enc.Base64.stringify(encryptedHexStr))
    return CryptoJS.enc.Base64.stringify(encryptedHexStr);//
  },

  // aes解密
  decrypt(encrypted, key) {
    // console.log("ase解密前：",encrypted)
    let decrypt = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    // console.log(decrypt.toString(CryptoJS.enc.Utf8))
    let decryptedObj = JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
    // console.log("ase解密后：",decryptedObj)
    return decryptedObj;
  },

  sign(aesKey, encryptData, timestamp, nonce, params) {
    // console.log("签名参数：","aesKey:",aesKey,"encryptData:",encryptData,"timestamp:",timestamp,"nonce:",nonce,"params:",params)
    //排序所有属性
    let allParams = {aesKey: aesKey, timestamp: timestamp, nonce: nonce, body: encryptData}
    if (params) {
      for (let p in params) {
        if (params.hasOwnProperty(p) && (!allParams.hasOwnProperty(p)))
          allParams[p] = params[p];
      }
    }
    //将值拼接到一起
    let values = []
    Object.keys(allParams).sort().map(key=>{
      values.push(allParams[key])
    })
    let valuesStr = values.join('')
    let sign = CryptoJS.MD5(valuesStr).toString()
    // console.log("签名结果：",sign)
    return sign
  }
}
