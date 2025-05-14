const User = require('../models/user-model');
const commonUtil = require('../utils/common-util');

class UserRepository {
    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return User.findById(id);
    }

    async deleteById(id) {
        return await User.deleteOne({_id: id});
    }

    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async update(id, data) {
        return await User.findByIdAndUpdate(id, data, {new: true, runValidators: true});
    }

    async findByEmail(email) {
        return User.findOne({email: email});
    }
}

module.exports = new UserRepository();
