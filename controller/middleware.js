let jwToken = require('jsonwebtoken');
const User = require('../models/user');

module.exports = {

    checkToken : async (req, res,next) => {

        let token = req.headers['x-access-token'] || req.headers['authorization'];

        if(token){

            jwToken.verify(token, 'brizo');
        }
    }

}