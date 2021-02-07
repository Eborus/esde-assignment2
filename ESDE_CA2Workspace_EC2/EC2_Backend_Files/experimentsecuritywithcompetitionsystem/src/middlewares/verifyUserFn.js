const config = require('../config/config');
const jwt = require('jsonwebtoken');

module.exports.verifyAdmin = (req, res, next) => {
    var token = req.headers['authorization'];
    var userId = req.headers['user'];

    res.type('json');
    if (!token || !token.includes("Bearer ")) {
        console.log("A restricted resource was being accessed and denied");
        res.status(403).json({ message: 'Unauthorized access' });
    } else {
        token = token.split('Bearer ')[1]; //obtain the token’s value
        jwt.verify(token, config.JWTKey, function(err,decoded){
            if(err || decoded.id == null || decoded.id != userId) { //key invalid or role is not admin
                console.log("A restricted resource was being accessed and denied");
            } else if(decoded.role != "admin") {
                console.log("User " + decoded.id + " tried to access restricted content");
            } else {
                next();
                return;
            }
            res.status(403).json({ message: 'Unauthorized access' });
        });
    }
} //End of verifyAdmin

module.exports.verifyUser = (req, res, next) => {
    var token = req.headers['authorization'];
    var userId = req.headers['user'];
    
    res.type('json');
    if (!token || !token.includes("Bearer ")) {

        res.status(403);
        res.send(`{"Message":"Not Authorized"}`);

    } else {
        token = token.split('Bearer ')[1]; //obtain the token’s value
        jwt.verify(token, config.JWTKey, function(err,decoded){
            if(err || decoded.id == null || decoded.id != userId) { //key invalid or role is not admin
                console.log("A restricted resource was being accessed and denied");
            } else if(decoded.role != "user") {
                console.log("User " + decoded.id + " tried to access restricted content");
            } else {
                next();
                return;
            }
            res.status(403).json({ message: 'Unauthorized access' });
        });
    }
} //End of verifyUser