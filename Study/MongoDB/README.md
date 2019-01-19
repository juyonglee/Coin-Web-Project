# MongoDB
- MongoDB는 Collection 안에 document들을 저장한다. 
- Collection은 Scheme가 없으며 관계형 데이터 베이스의 Table의 개념과 유사하다.
- 즉, 콜렉션은 동적 스키마를 가지며 이는 하나의 콜렉션 내 문서들이 모두 다른 구조를 가질 수 있다는 것을 의미한다.
- 모든 Document는 Collection 내에서 고유한 특수키인 “_id”를 가지고 있다.

# MongoDB vs Mongoose
1. mongodb: MongoDB Nodejs Driver (Native)
    - mongo Console client 명령과 동일하게 조작 가능!
    - 설치
        ```javascript
        npm install mongodb
        ```
    - MongoClient 획득
        ```javascript
        var MongoClient = require('mongodb').MongoClient;
        ```
    - MongoClient로 Database를 연결하고 참조를 얻을 수 있다.
2. Mongoose: ODM (Object Document Mapper)
    - ODM (Object Document Mapper)의 약자로 ORM (Object Relational Mapping)과 비슷하게 데이터를 다룬다.
    - Scheme, Model을 사용하며 mongo shell 명령어 사용이 불가능하다!

## Mongoose 설치
npm을 이용하여 mongoose module을 설치한다. 
```javascript
npm install mongoose
```
## Mongoose 사용법
### Step1. Database 연결
  ```javascript
  //  Mongoose Module Loading
  var mongoose = require('mongoose');

  //  MongoDB url 선언
  var url = 'mongodb://localhost:27017/Project';
  
  //  MongoDB Connection Open
  mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true});
  var db = mongoose.connection;

  //  Connection이 성공한 경우
  db.once('open', function(){
    console.log("MongoDB Connection!");
  });
  
  //  Connection이 실패한 경우
  db.on('error', function(err){
    console.log("MongoDB Connection Error!");
  });
  ```
### Step2. Scheme 정의
  Document의 Type과 향태를 정의 (MySQL에서의 Table 정의와 비슷하다.)
  ```javascript
  var UserScheme = mongoose.Schema({
    user_id: String, 
    user_salt: String, 
    user_password: String
  });
  ```
### Step3. Scheme에서 Model을 얻어냄
```javascript
//  Collection 정의 (UserScheme을 이용하여 Model을 얻어낸다.)
var USER = mongoose.model('user', UserScheme);
```
### Step4. Model을 이용해서 데이터 다루기
* Document 생성
    ```javascript
    var testUser = new USER({user_id: 'juyonglee0208', user_password: `1234`});
    ```
* Database에 반영
sava와 create를 이용한다. create인 경우 Document를 생성하지 않고 수행이 가능하다.
    ```javascript
    //  Database에 반영 1 - [save를 이용한 예]
    testUser.save(function(err, product){
        console.log(product);
    });

    //  Database에 반영 2 - [create를 이용한 예]
    USER.create({user_id: 'goal0208', user_salt: salt, user_password: password}, function(err, product){
        console.log(product);
    });
    ```
