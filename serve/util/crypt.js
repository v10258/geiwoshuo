const bcrypt = require('bcrypt');

/**
 * 加密
 *
 * 拷贝自:  https://stackoverflow.com/questions/14015677/node-js-encryption-of-passwords
 */
exports.encode = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

/**
 * 判断给定密码是否与加密密码匹配
 *
 * 返回的是一个promise,resolved值是bool类型
 */
exports.test = (pass, hash) => {
    return bcrypt.compare(pass, hash);
};