const fs = require('fs');
const express = require('express');

const app = express();

// app.get('/', (req, res) => {
//     res.status(200).json({ message: 'Hello from the server side', app: 'my app' });
// });

// app.get('/', (req, res) => {
//     res.send('HELLO FROM THE POST ROUTE');
// });

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

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on post ${port}....`);
});
