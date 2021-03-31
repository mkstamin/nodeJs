const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const app = require('./app');

// Database Connection String
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// Connection with the database
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log('DB connectioned successfully!'));

// Start Server
const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server is running on post ${port}....`);
});
