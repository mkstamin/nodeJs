const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        result: tours.length,
        data: {
            tours,
        },
    });
});

app.get('/api/v1/tours/:id', (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        res.status(404).json({
            status: 'fail',
            message: 'Can not fint the tour!',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            tour,
        },
    });
});

app.post('/api/v1/tours', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
    if (req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Can not fint the tour For update!',
        });
    }

    res.status(200).json({
        status: 'success',
        data: {
            message: 'tour updated',
        },
    });
});

app.delete('/api/v1/tours/:id', (req, res) => {
    // console.log(req.params.id, tours.length);

    if (req.params.id * 1 > tours.length) {
        res.status(404).json({
            status: 'fail',
            message: 'Can not fint the tour for DELETE!',
        });
    }

    res.status(200).json({
        status: 'success',
        data: null,
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on post ${port}....`);
});
