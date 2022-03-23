const jwt = require('jsonwebtoken');
const { handleErrors } = require('../utils/utils');



module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        next();
        return;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try{
        decodedToken = jwt.verify(token, 'longTokenTpMakeTheJWTSECRETASPOSSIBLE!!OK?');
    }catch (err) {
        req.isAuth = false;
        next();
    }
    if (!decodedToken){
        req.isAuth = false;
        next();
        return;
    }
    req.userId = decodedToken.userId;
    req.isAuth = true;
    next();
}
