const path = require('path');
const fs = require('fs');
const stringUtil = require("./string-util");
class FileUtil {
    static getUploadDir(dirPath) {
        if(stringUtil.isBlank(dirPath)) {
            throw new Error('Directory path is required');
        }
        const uploadDir = path.join(__dirname, dirPath);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        return uploadDir;
    }

    static getExtName(fileName) {
        return path.extname(fileName);
    }
}

module.exports = FileUtil;