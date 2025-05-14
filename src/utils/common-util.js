class CommonUtil {

    /**
     * sleep current thread in the time
     * @param time is millisecond
     */
    static sleep(time) {
        const end = Date.now() + time;
        while (Date.now() < end) ;
    }
}

module.exports = CommonUtil;