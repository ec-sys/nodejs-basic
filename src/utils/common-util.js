class CommonUtil {

    /**
     * sleep current thread in the time
     * @param time is millisecond
     */
    static sleep(time) {
        const end = Date.now() + time;
        while (Date.now() < end) ;
    }

    static getTokenFromRequest(req) {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            // Set token from Bearer token in header
            token = req.headers.authorization.split(' ')[1];
        }
        return token;
    }
}

module.exports = CommonUtil;