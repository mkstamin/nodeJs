const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// console.log(app.get('env'));

const port = process.env.PORT || 3030;
app.listen(port, () => {
    console.log(`Server is running on post ${port}....`);
});
