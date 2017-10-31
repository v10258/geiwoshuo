const {User} = require('../../mongo');


/**
 * 要求用户必须登录
 */
module.exports = (req, res, next) => {
    if (!req.session.user_id) {
        return next(new Error('Login required.'));
    }
    User.findById(req.session.user_id)
        .then(doc => {
            if (!doc) {
                throw new Error('Login required.')
            }
            req.user = doc;
            next();
        })
        .catch(next);
};