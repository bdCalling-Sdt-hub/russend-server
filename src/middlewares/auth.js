const jwt = require('jsonwebtoken');
const response = require("../helpers/response");
const logger = require('../helpers/logger');

const isValidUser = async (req, res, next) => {
    try {
        console.log(req.body)
        const { authorization } = req.headers;
        console.log(authorization);
        let token;
        let decodedData;
        if (authorization && authorization.startsWith("Bearer")) {
            token = authorization.split(" ")[1];
            //console.log(token);
            decodedData = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
        }
        if (!authorization || !decodedData) {
            return res.status(401).json(response({ status: 'Unauthorised', statusCode: '401', type: 'auth', message: req.t('unauthorised') }));
        }
        req.body.userId = decodedData._id;
        next();
    } catch (error) {
        console.log("Middleware Error", error.message)
        logger.error(error, req.originalUrl);
        return res.status(401).json(response({ status: 'Unauthorised', statusCode: '401', type: 'auth', message: req.t('exception-in-authorization') }));
    }
};


module.exports = { isValidUser };