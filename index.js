require('dotenv').config();
require('./util/connectDatabase');

const express = require('express');
const cors = require('cors');
const router = require('./Routes');
const error = require('./middlewares/error');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({
    origin: '*',
}))

app.use('/', router);
app.get('*', (req, res) =>{
    res.status(404).send('Not Found!');
})

app.use(error);

app.listen(PORT, () => console.log("Server started at port:", PORT));


