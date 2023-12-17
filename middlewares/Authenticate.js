const jwt = require('jsonwebtoken');

const isAuth = (req, res, next) => {
    const token = req.headers['token'];
    let verified
    try{
        verified = jwt.verify(token, process.env.JWT_SECRET_KEY);

    }
    catch(err){
        return res.status(401).send({
            status: 401,
            message: 'JWT not provided',
            data: err,
        })   
    }

    if(verified){
        req.locals = verified;
        next();
    }
    else{
        return res.status(401).send({
            status: 401,
            message: 'Invaid token / User not logged in'
        });
    }
}

module.exports = { isAuth };