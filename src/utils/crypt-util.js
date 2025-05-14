const bcrypt = require('bcrypt');
const saltRounds = 10;
class CryptUtil {
    static hashPassword(plaintextPassword) {
        return bcrypt.hashSync(plaintextPassword, saltRounds);
    }

    static comparePassword(plaintextPassword, hashPassword) {
        return bcrypt.compareSync(plaintextPassword, hashPassword);
    }
}

module.exports = CryptUtil;