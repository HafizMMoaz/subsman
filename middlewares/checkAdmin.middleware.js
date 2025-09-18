const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        const error = new Error('Unauthorized - Admins only');
        error.statusCode = 401;
        return next(error);
    }
    next();
}

export default checkAdmin;