const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const port = process.env.PORT || 5000;
console.log(port);
connectDB();

const {errorHandler} = require('./middleware/errorMiddleware')
const colors = require('colors')


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/test', require('./routes/testRoute'));

app.use(errorHandler);

app.listen(port, console.log('Server started on  port ' + port ))
