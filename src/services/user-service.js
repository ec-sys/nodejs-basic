const userRepository = require('../repositories/user-repository');
const stringUtil = require('../utils/string-util');

class UserService {
    async getUsers() {
        return await userRepository.findAll();
    }

    async getUser(id) {
        return await userRepository.findById(id);
    }

    async createUser(data) {
        this.checkInputUser(data);
        return await userRepository.create(data);
    }

    async deleteUser(id) {
        this.checkRequiredId(id);
        return await userRepository.deleteById(id);
    }

    async updateUser(id, data) {
        this.checkRequiredId(id);
        this.checkInputUser(data);
        return await userRepository.update(id, data);
    }

    checkInputUser(data) {
        if (stringUtil.isBlank(data.name) || stringUtil.isBlank(data.email)) {
            throw new Error('Name And Email are required');
        }
    }

    checkRequiredId(id) {
        if (stringUtil.isBlank(id)) {
            throw new Error('Id is required!')
        }
    }
}

module.exports = new UserService();