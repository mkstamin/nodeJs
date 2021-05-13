const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT REJECTION! 💥 Shutting down....');
    console.log(err.name, err.message);
    process.exit(1);
});

dotenv.config({ path: './.env' });
const app = require('./app');

// Database Connection String
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// Connection with the database
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB connectioned successfully!'));

// Start Server
const port = process.env.PORT || 3030;
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}....`);
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, err.message);
    console.log('UNHANDLED REJECTION! 💥 Shutting down....');
    server.close(() => {
        process.exit(1);
    });
});
