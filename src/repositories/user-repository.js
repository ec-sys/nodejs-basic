const User = require('../models/user-model');

class UserRepository {
    async findAll() {
        return await User.find();
    }

    async findById(id) {
        return await User.findById(id);
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
}

module.exports = new UserRepository();
