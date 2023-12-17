class APIError extends Error{
    constructor(message, status, err){
        super();
        this.message = message;
        this.status = status;
        this.data = err,
        Error.captureStackTrace(this);
    }
}

module.exports = APIError;