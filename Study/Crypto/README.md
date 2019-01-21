# 암호화
- 비밀번호를 입력받은 그대로 Database에 저장하는 것은 **_엄청난 범죄!!_** 
- 비밀번호는 반드시 암호화해서 저장해야 한다!!

## 암호화의 방법
암호화에는 크게 두가지 카테고리로 분리된다.
1. **단방향 암호화**
    - 단방향 암호화는 복호화(암호화된 문자열을 다시 원래 문자열로 복원하는 기능)가 불가능한 암호화 방법이다. 
    - 이론적으로는 복호화가 불가능하지만 이미 해커들에 의해서 MD5나 SHA256같은 암호화 알고리즘은 이미 뚤렸다.
    - 홈페이지 비밀번호같은 경우는 복호화할 필요가 없는 대표적인 예제이다. 
        
        **[Step1]** 비밀번호를 암호화해서 DB에 저장해둔다. 
        
        **[Step2]** 로그인시 입력받은 비밀번호를 암호화 알고리즘으로 암호화한다.
        
        **[Step3]** DB에 저장된 문자열과 비교한다. 즉 사용자가 입력한 비밀번호를 저장하지 않고 암호화된 문자열로만 비교를 수행하게 된다.

    ```javascript
    //  암호화를 위한 모듈 추가 w
    const crypto = require('crypto');
    //  sha512기반의 hash 암호화 
    const hash = crypto.createHash('sha512');
    hash.update("User Input Password", 'utf-8');
    console.log(hash.digest('base64'));
    ```
    
    ```javascript
    //  암호화를 위한 모듈 추가 
    const crypto = require('crypto');
    crypto.randomBytes(64, (err, buf) => {
        crypto.pbkdf2("User Input Password", buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
            if (err) throw err;
            console.log("[Salt]");
            console.log(buf.toString('base64'));
            console.log("[Password]");
            console.log(derivedKey.toString('base64'));
        });
    });
    ```
