  //  암호화를 위한 모듈 추가 w
  const crypto = require('crypto');
  //  sha512기반의 hash 암호화 
  const hash = crypto.createHash('sha512');
  hash.update("User Input Password", 'utf-8');
  console.log("[Original Input]");
  console.log("User Input Password");
  console.log("[SHA-512 Hash]");
  console.log(hash.digest('base64'));
  