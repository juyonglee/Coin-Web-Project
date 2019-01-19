var mongoose = require('mongoose');

var url = 'mongodb://localhost:27017/Project';
mongoose.connect(url, {useNewUrlParser: true, useCreateIndex: true});

var db = mongoose.connection;

db.on('error', function(err){
    console.log("MongoDB Connection Error!");
});

db.once('open', function(){
    console.log("MongoDB Connection!");
});

//  Model 생성을 위한 Scheme를 정의
var UserScheme = mongoose.Schema({
    user_id: {
        type:String,
        unique: true
    }, 
    user_salt: String, 
    user_password: String
});

//  Scheme에 Method 추가
UserScheme.methods.helloMessage = function() {
    var gretting = this.user_id? "Hello, " + this.user_id + "!" : "Who are you!?";
    console.log(gretting);
};

//  Collection 정의
var USER = mongoose.model('user', UserScheme);

//  Model에서 Document 생성
const salt = 'hGt5EpSDL2hpU2M6HvwuYM4Hx5pq8JqqMhUtaPVuQohpyVV+BbrltzASJwORPUcBhxJndYmVrPMkcT6zVQIF3Q==';
const password = 'I+oXmt11UwsvowH+3bKD6EKtGgFPHw4q2wrOwTFbRIRyHNGZ04zDrWmEhv7/N9TI6UOsFEh9YCYPk8z6L7rO0Q==';
var testUser = new USER({user_id: 'juyonglee0208', user_salt: salt, user_password: password});
testUser.helloMessage();

//  Database에 반영 1
testUser.save(function(err, product){
    if(err.code == 11000) {
        return console.log("이미 저장된 데이터입니다.");
    } 
    console.log("[save를 이용한 예]");
    console.log(product);
    console.log("************************************************************************************************");
});

//  Database에 반영 2
USER.create({user_id: 'goal0208', user_salt: salt, user_password: password}, function(err, product) {
    if(err.code == 11000) {
        return console.log("이미 저장된 데이터입니다.");
    } 
    console.log("[create를 이용한 예]");
    console.log(err);
    console.log(product);
    console.log("************************************************************************************************");
});

//  Database에서 Data 검색
USER.find({user_id: 'juyonglee0208'}, function(err, res){
    if(err) return console.log("Search Error!");
    if(res.length>0) {
        console.log("이미 가입된 회원입니다.");
    } else {
        console.log("회원 가입이 가능합니다.");
    }
});
