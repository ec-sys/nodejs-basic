const bcrypt = require('bcrypt');
const saltRounds = 10;

class CryptUtil {
    static hashPassword(plainPassword) {
        return bcrypt.hashSync(plainPassword, saltRounds);
    }

    static comparePassword(plainPassword, hashPassword) {
        return bcrypt.compareSync(plainPassword, hashPassword);
    }
}

module.exports = CryptUtil;