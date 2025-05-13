const express = require('express');
const userRoutes = require('./routes/user-route');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Mount user routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
