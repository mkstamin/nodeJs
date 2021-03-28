const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../data/tours-simple.json`));

exports.checkId = (req, res, next, val) => {
    console.log(`Id is : ${val}`);

    if (val * 1 > tours.length) {
        return res.status(404).json({
            status: 'fail',
            message: 'Invalid Id!',
        });
    }

    next();
};

exports.checkBody = (req, res, next) => {
    if (!req.body.name || !req.body.price) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing name or price!',
        });
    }

    next();
};

exports.getAllTours = (req, res) => {
    res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        result: tours.length,
        data: {
            tours,
        },
    });
};

exports.getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
};

exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = { id: newId, ...req.body };
    // const newTour = { id: newId, ...req.body };

    tours.push(newTour);
    fs.readFile(`${__dirname}/data/tours-simple.json`, 'utf8', () => {
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour,
            },
        });
    });
};

exports.updateTour = (req, res) => {
    res.status(200).json({
        status: 'success',
        data: {
            message: 'tour updated',
        },
    });
};

exports.deleteTour = (req, res) => {
    // console.log(req.params.id, tours.length);
    res.status(200).json({
        status: 'success',
        data: null,
    });
};
