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
