# Passport
- Passport는 Node.js를 위한 인증 middleware이다.
- Passport는 각 응용 프로그램마다 고유한 인증 요구 사항이 있음을 인식합니다. 
- 인증 메커니즘인 Strategy는 개별 모듈로 패키지됩니다.
- 즉, 응용 프로그램은 불필요한 Dependency을 만들지 않고 상황에 맞는 Strategy를 선택할 수 있습니다.
- 인증 절차는 학습하기 복잡하지만 Passport를 사용하면 손쉽게 이용 가능.
```javascript
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
```
## 설치
```javascript
$ npm install passport
```

## Authenticate
Passport에서 인증 요청을 아주 간단하다. 
* 인증요청을 위해 `passport.authenticate()`를 호출
* Application에서 사용할 `Strategy`를 지정
```javascript
app.post('/login', passport.authenticate('local'), function(req, res) {
    // 인증이 성공한 경우 함수가 호출된다.
    // `req.user` 에 인증된 사용자 정보가 들어있다.
    res.redirect('/users/' + req.user.username);
  });
```
* 인증에 실패하면 Passport는 `401 Unauthorized`로 응답하며 `route handler`는 호출되지 않습니다.
* 인증에 성공하면 인증이 성공하면 `handler`가 호출되고 `req.user property`가 인증 된 사용자로 설정됩니다.

### Redirects
Redirection은 일반적으로 인증 요청 후에 수행됩니다.
* 인증에 성공하는 경우: 사용자는 `home page`로 redirection.
* 인증에 실패하는 경우: 사용자는 `login page`로 redirection
    ```javascript
    app.post('/login',passport.authenticate('local', { successRedirect: '/',
                                    failureRedirect: '/login' }));
    ```
### Flash Messages
* `failureFlash option`을 true로 설정하면 Strategy의 `verify callback`에 의해 주어진 메시지를 Flash합니다.
* `Verify callback`은 인증이 실패한 이유를 가장 정확하게 알 수 있는 좋은 방법입니다.
    ```javascript
    app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                        failureRedirect: '/login',
                                                        failureFlash: true }));
    ```
* Flash Message를 구체적으로 설정할 수 있습니다.
    ```javascript
    passport.authenticate('local', { failureFlash: 'Invalid username or password.' });
    ```
* 인증 성공시 성공 메시지를 출력하기 위해 `successFlash option`을 사용할 수 있습니다.
    ```javascript
    passport.authenticate('local', { successFlash: 'Welcome!' });
    ```
### Custom Callback
기본 제공 옵션으로 인증 요청을 처리하기에 충분하지 않은 경우, Application이 성공 또는 실패를 처리 할 수 있도록 `사용자 지정 callback`을 제공 할 수 있습니다.
* 이 예제에서, authenticate ()는 라우트 미들웨어로 사용되기보다는 라우트 핸들러 내에서 호출된다는 점에 유의하십시오. 이렇게하면 closure를 통해 req 및 res 객체에 대한 콜백 액세스가 제공됩니다.
* `Optional info 인수`가 전달되며 Strategy의 `verify callback`에 의해서 제공하는 추가 정보가 포함됩니다.
* `Custom Callback`을 사용할 때는 `Session`을 설정하고 `응답`을 보내는 것은 Applicaion의 책임이됩니다. `(req.login ()을 호출해서 이용한다.)`
```javascript
app.get('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
            if(err)
                return next(err); 
            if(!user)
                return res.redirect('/login'); 
            req.logIn(user, function(err) {
                if (err)
                    return next(err); 
                return res.redirect('/users/' + user.username);
            }    
        });
    })(req, res, next);
});
```

## Configure
Passport를 사용하연 인증을 수행하려면 `세 가지`의 설정이 필요합니다.
1. Authentication strategies
2. Application middleware
3. Sessions (optional)

### Strategies
- Strategy에는 `사용자 이름과 비밀번호 확인`, `OAuth`를 사용한 인증 위임 또는 `OpenID`를 사용한 연합 인증이 존재한다.
- **`Passport을 사용하여 인증 요청을 수행하기 전에 Application에서 사용하려는 Strategy를 설정해야한다.`**
```javascript
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
            if (err)
                return done(err);
            if (!user)
                return done(null, false, { message: 'Incorrect username.' });
            if (!user.validPassword(password))
                return done(null, false, { message: 'Incorrect password.' });
            return done(null, user);
        });
    }
));
```

### Verify Callback
- Strategy는 `Verify Callback`이 필요하다.
- Verify callback의 목적은 자격 증명이 있는 사용자를 찾는 것입니다.
- Passport가 요청을 인증할 때, 요청안에 포함된 자격 증명을 분석합니다.
- 그 후 해당 자격 증명 (usrname, password)을 사용하여 `Verify callback`을 호출합니다.
- 자격 증명이 유효하면 `Verify callback`은 done()을 호출하여 Passport에 인증된 사용자를 제공합니다.
    ```javascript
    return done(null, user);
    ```

#### 자격 증명이 유효하지 않은 경우1 (예 : 암호가 틀린 경우)
- 인증 실패를 나타 내기 위해 사용자 대신 false로 done을 호출해야합니다.
    ```javascript
    return done(null, false);
    ```

#### 자격 증명이 유효하지 않은 경우2
오류의 원인을 표시하기 위해 추가 정보 메시지를 제공 할 수 있습니다. 사용자에게 다시 시도하라는 `Flash Message`를 표시 할 때 유용합니다.

```javascript
return done(null, false, { message: 'Incorrect password.' });
```

#### 자격 증명을 확인하는 동안 예외가 발생하는 경우 (예 : 데이터베이스를 사용할 수없는 경우)
Node.js의 error와 함께 done을 호출해야합니다.
```javascript
return done(err);
```

### Middleware
* Express에서 Passport를 초기화하려면 `passport.initialize() Middleware`가 필요하다.
* Application이 지속적 Login Session을 사용하는 경우 `passport.session() Middleware`도 함께 사용해야한다.
* **[중요] Session이 활성화 된 경우 `passport.session()` 전에 `session()`을 사용하여 로그인 session이 올바른 순서로 복원되는지 확인해야한다.**
    ```javascript
    app.configure(function() {
        app.use(express.static('public'));
        app.use(express.cookieParser());
        app.use(express.bodyParser());
        app.use(express.session({ secret: 'keyboard cat' }));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use(app.router);
    });
    ```
* Express 4.x부터는 Connect middleware가 Express core에 포함되어있지 않으므로 **`express-session module`** 을 사용해야 한다.
    ```javascript
    //  [주의] Express-Session을 사용해야 한다.
    var session = require("express-session");
    var bodyParser = require("body-parser");

    app.use(express.static("public"));
    //  Express Session 설정
    app.use(session({ secret: "cats" }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());
    //  Passport Session 설정
    app.use(passport.session());
    ```

### Sessions
* 일반적인 Web Application에서 사용자 인증에 사용되는 자격 증명은 로그인 요청 중에만 전송됩니다.
* 인증이 성공하면 사용자의 브라우저에 설정된 쿠키를 통해 세션이 설정되고 유지 관리됩니다.
* 이후의 각 요청에는 자격 증명이 포함되지 않고 세션을 식별하는 고유 쿠키가 포함됩니다.
* 로그인 session을 지원하기 위해 Passport는 session간에 **`user instances`** 를 **`직렬화 (Serialize)`** 및 **`역직렬화 (Deserialize)`** 합니다.
    ```javascript
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
    ```
    * 이 예제에서는 `user ID`만 `Session`에 직렬화하여 Session에 저장된 데이터의 양을 적게 유지하였습니다.
    * 요청을 받으면 이 ID를 사용하여 사용자를 찾은 다음 req.user에 복원합니다.
    * 직렬화 및 역직렬화 개념이 Application에 의해서 제공되므로, Application에서 인증 계층의 도입 없이 적절한 데이터베이스 및 객체 매퍼 (Object Mapper)를 선택할 수 있습니다.
