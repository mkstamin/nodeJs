const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const mongoose = require('mongoose');
const Tour = require('../models/tourModel');

// Database Connection String
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);

// Connection with the database
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('DB connectioned successfully!');
    });

// read data from the file system
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf8'));

// Inport data to DB
const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data import successfully!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// Delete all Data from DB
const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data delete successfully!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}
