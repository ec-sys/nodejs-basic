// Simulate a simple in-memory user list
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
];

exports.getAllUsers = (req, res) => {
    res.json(users);
};

exports.getUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.createUser = (req, res) => {
    const { name } = req.body;
    const newUser = {
        id: users.length + 1,
        name
    };
    users.push(newUser);
    res.status(201).json(newUser);
};
