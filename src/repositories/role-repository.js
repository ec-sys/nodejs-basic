const Role = require('../models/role-model');

class RoleRepository {
    async findById(id) {
        return Role.findById(id);
    }

    async findByIds(ids) {
        return Role.find({'_id': {$in: ids}}).exec();
    }
}

module.exports = new RoleRepository();
