const jwtExpress = require('express-jwt');
require('dotenv/config');
const secret = '' + process.env.JWT_SECRET;
const api = process.env.API_URL;

function authJwt() {
    return jwtExpress.expressjwt({
        secret: secret,
        algorithms: ['HS256']
    }).unless({ path: [`${api}/login`, `${api}/signup`] });
}

module.exports = authJwt();