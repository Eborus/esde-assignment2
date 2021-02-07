const aws = require("aws-sdk");
const headers = { "Content-Type": "application/json; charset=utf-8" };
const auth = require("./authService.js");
const bcrypt = require('bcrypt');

exports.handler = (event, context, callback) => {
    let body = JSON.parse(event.body);
    let email = body.email;
    let password = body.password;

    try {
        auth.authenticate(email, function(error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                console.log(error);
                return callback(Error(error), { statusCode: 500, headers, body: JSON.stringify({ message: message }) });
            } else {
                if (results.Count == 1) {
                    if (password == null || results.Items[0] == null) {
                        console.log("Login failed due to invalid password or the email is not registered");
                        return callback(Error(error), { statusCode: 500, headers, body: JSON.stringify({ message: "Login failed" }) });
                    }
                    if (bcrypt.compareSync(password, results.Items[0].user_password.S)) {
                        
                        let role_name;
                        
                        if (results.Items[0].role_id.N == 1) {
                            role_name = "admin";
                        } else {
                            role_name = "user";
                        }
                        
                        let data = {
                            user_id: results.Items[0].user_id.N,
                            role_name: role_name
                        }; //End of data variable setup
                        
                        console.log("User has successfully logged in with the email: " + email)
                        return callback(null, { statusCode: 200, headers, body: JSON.stringify(data) }); 
                    } else {
                        console.log("Login attempt for email: " + email + " has failed due to incorrect password");
                        return callback(Error(error), { statusCode: 500, headers, body: JSON.stringify({ message: "Login has failed" }) });
                    }
                }
            }
        })
    } catch (error) {
        return callback(Error(error));
    }
}