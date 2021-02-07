const user = require('../services/userService');
const auth = require('../services/authService');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const jwt = require('jsonwebtoken');



exports.processLogin = (req, res, next) => {

    let email = req.body.email;
    let password = req.body.password;
    try {
        auth.authenticate(email, function(error, results) {
            if (error) {
                let message = 'Credentials are not valid.';
                console.log(error);
                return res.status(500).json({ message: message });
                //If the following statement replaces the above statement
                //to return a JSON response to the client, the SQLMap or
                //any attacker (who relies on the error) will be very happy
                //because they relies a lot on SQL error for designing how to do 
                //attack and anticipate how much "rewards" after the effort.
                //Rewards such as sabotage (seriously damage the data in database), 
                //data theft (grab and sell). 
                //return res.status(500).json({ message: message });

            } else {
                if (results.length == 1) {
                    if ((password == null) || (results[0] == null)) {
                        console.log("Login failed due to invalid password or the email is not registered")
                        return res.status(500).json({ message: 'login failed' });
                    }
                    if (bcrypt.compareSync(password, results[0].user_password) == true) {

                        let data = {
                            user_id: results[0].user_id,
                            role_name: results[0].role_name,
                            token: jwt.sign({ id: results[0].user_id, role: results[0].role_name }, config.JWTKey, {
                                expiresIn: 86400 //Expires in 24 hrs
                            })
                        }; //End of data variable setup
                        console.log("User has successfully logged in with the email: " + email)
                        return res.status(200).json(data);
                    } else {
                        console.log("Login attempt for email: " + email + " has failed due to incorrect password")
                        return res.status(500).json({ message: 'Login has failed.' });
                        // return res.status(500).json({ message: error });
                    } //End of passowrd comparison with the retrieved decoded password.
                } //End of checking if there are returned SQL results

            }

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Unable to login due to an unknown error' });
    } //end of try



};

// If user submitted data, run the code in below
exports.processRegister = (req, res, next) => {
    console.log('processRegister running');
    let fullName = req.body.fullName;
    let email = req.body.email;
    let password = req.body.password;
    var strength = 0;
    var rank = {
        TOO_SHORT: 0,
        WEAK: 1,
        MEDIUM: 2,
        STRONG: 3,
        VERY_STRONG: 4
    };
    var upper = /[A-Z]/,
        lower = /[a-z]/,
        number = /[0-9]/,
        special = /[^A-Za-z0-9]/,
        minLength = 8,
        score = 0;

    if (password.length < minLength) {
        return rank.TOO_SHORT; // End early
    };

    if (upper.test(password)) score++;
    if (lower.test(password)) score++;
    if (number.test(password)) score++;
    if (special.test(password)) score++;

    if (score < 3) score--;

    if (password.length > minLength) {
        // Increment the score for every 2 chars longer than the minimum
        score += Math.floor((password.length - minLength) / 2);
    };

    // Return a ranking based on the calculated score
    if (score < 3) {
        strength = 1;
    }
    else if (score < 4) {
        strength = 2;
    }
    else if (score < 6) {
        strength = 3;
    }
    else {
        strength = 4;
    }

    if (strength => 2) {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                console.log('Error on hashing password');
                return res.status(500).json({ message: 'Unable to complete registration' });
            } else {
                try {
                    results = await user.createUser(fullName, email, hash);
                    console.log(results);
                    return res.status(200).json({ message: 'Completed registration' });
                } catch (error) {
                    console.log('processRegister method : catch block section code is running');
                    console.log(error, '=======================================================================');
                    return res.status(500).json({ message: 'Unable to complete registration' });
                }
            }
        })
    };


}