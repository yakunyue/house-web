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
    console.log("生成aesKye：",keyStr)
    return keyStr;
  },

  //aes加密
  encrypt(data, key) {
    console.log("aes加密前：",data)
    let encrypted = "";
    if (typeof data == "string") {
      let dataSrc = CryptoJS.enc.Utf8.parse(data);
      encrypted = CryptoJS.AES.encrypt(dataSrc, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7       //todo 不确定java端是否支持pkcs7，先试试
      });
    } else if (typeof data == "object") {
      //对象格式的转成json字符串
      let data = JSON.stringify(data);
      let dataSrc = CryptoJS.enc.Utf8.parse(data);
      encrypted = CryptoJS.AES.encrypt(dataSrc, key, {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    }
    console.log("ase加密后：",encrypted.ciphertext)
    return encrypted.ciphertext.toString();
  },

  // aes解密
  decrypt(encrypted, key) {
    const encryptedHexStr = CryptoJS.enc.Hex.parse(encrypted);
    const srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    const decrypt = CryptoJS.AES.decrypt(srcs, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
  },

  sign(aesKey, encryptData, timestamp, nonce, params) {
    console.log("签名参数：","aesKey:",aesKey,"encryptData:",encryptData,"timestamp:",timestamp,"nonce:",nonce,"params:",params)
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
    console.log("签名结果：",sign)
    return sign
  }
}
