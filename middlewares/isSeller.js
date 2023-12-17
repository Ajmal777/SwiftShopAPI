const isSeller = (req, res, next) => {
    const { sellerId } = req.locals
    if(!sellerId){
        return res.status(403).send({
            status: 403,
            message: 'Only seller can access this page',
        });
    }
    else next();
}

module.exports = { isSeller };