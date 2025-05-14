const userRepository = require('../repositories/user-repository');
const stringUtil = require('../utils/string-util');
const cryptUtil = require('../utils/crypt-util');
const externalApiService = require('../thirdParties/external-api-service')

class UserService {
    async getUsers() {
        return await userRepository.findAll();
    }

    async getUser(id) {
        let user = await userRepository.findById(id);
        let response = {
            id: user._id,
            name: user.name
        }
        if (user.age > 18) {
            response.text = "He is OK";
        } else {
            response.text = "He is BAD";
        }
        response.greeting = await externalApiService.fetchGreeting();
        return response;
    }

    async createUser(data) {
        this.checkInputUser(data);
        let hashPassword = cryptUtil.hashPassword(data.password);
        data.password = hashPassword;
        return await userRepository.create(data);
    }

    async deleteUser(id) {
        this.checkRequiredId(id);
        return await userRepository.deleteById(id);
    }

    async updateUser(id, data) {
        this.checkRequiredId(id);
        return await userRepository.update(id, data);
    }

    checkInputUser(data) {
        if (stringUtil.isBlank(data.name) || stringUtil.isBlank(data.email) || stringUtil.isBlank(data.password)) {
            throw new Error('Name, Email, Password are required');
        }
    }

    checkRequiredId(id) {
        if (stringUtil.isBlank(id)) {
            throw new Error('Id is required!')
        }
    }
}

module.exports = new UserService();