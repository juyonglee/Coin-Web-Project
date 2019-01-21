const crypto = require('crypto');
crypto.randomBytes(64, (err, buf) => {
    crypto.pbkdf2("User Input Password", buf.toString('base64'), 100000, 64, 'sha512', function(err, derivedKey) {
        if (err) throw err;
        console.log("[Original Password]");
        console.log("User Input Password");
        console.log("[Salt]");
        console.log(buf.toString('base64'));
        console.log("[Password]");
        console.log(derivedKey.toString('base64'));
    });
});
