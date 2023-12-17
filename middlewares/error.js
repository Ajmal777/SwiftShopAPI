const APIError = require("../util/APIError");

module.exports = (err, req, res, next) => {
    console.log(err);

    if(err instanceof APIError){
        return res.status(err.status).json({
            status: err.status,
            message: err.message
        });
    }
    return res.status(500).json({
        status: 500,
        message: 'An error occurred',
    });
}