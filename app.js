const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Hello from the server side', app: 'my app' });
});

app.get('/', (req, res) => {
    res.send('HELLO FROM THE POST ROUTE');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on post ${port}....`);
});
