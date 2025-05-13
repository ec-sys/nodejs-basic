const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./configs/db-config');
const userRoutes = require('./routes/user-route');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
