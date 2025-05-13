class StringUtil {
    static isBlank(value) {
        return (
            value === null ||
            value === undefined ||
            (typeof value === 'string' && value.trim() === '')
        );
    }
}

module.exports = StringUtil;