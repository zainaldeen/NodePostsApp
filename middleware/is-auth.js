const jwt = require('jsonwebtoken');
const { handleErrors } = require('../utils/utils');



module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        throw handleErrors('Unauthorized', 401);
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'longTokenTpMakeTheJWTSECRETASPOSSIBLE!!OK?');
    }catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
    }
    if (!decodedToken){
        throw handleErrors('Unauthorized', 401);
    }
    req.userId = decodedToken.userId;
    next();
}
