module.exports = (callback) => {
    return (req, res, next) => {
        callback(req, res)
        .then(response => res.status(response.status).json(response))
        .catch(err => next(err));
    }
}