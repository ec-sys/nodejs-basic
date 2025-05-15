const userService = require('../services/user-service');
const { logger } = require('../utils/logger');

exports.getAllUsers = async (req, res) => {
    try {
        // const users = await userService.getUsers();
        // res.json(users);
        userService.getUsers()
            .then((users) => {
                res.json(users);
            })
            .catch((error) => {
                res.status(500).json({message: error.message});
            });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.getUserById = async (req, res) => {
    try {
        logger.info('Sample logger', {
            requestId: req.requestId
        });

        const user = await userService.getUser(req.params.id);
        if (!user) return res.status(404).json({message: 'User not found'});
        res.json(user);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};

exports.createUser = async (req, res) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(200).json({message: 'Deleted Successfully'});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
}

exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await userService.updateUser(req.params.id, req.body);
        if (!updatedUser) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({message: err.message});
    }
};