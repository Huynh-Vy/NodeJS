const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const morgan = require('morgan');

const port = 8080;

// log request
app.use(morgan('combined'));

// Import routes
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const noteRoute = require('./routes/notes');

dotenv.config();

// Connect to DB
mongoose.connect(process.env.DB_CONNECT, () => {
    console.log('Connected to DB');
});

// MiddleWares
app.use(bodyParser.urlencoded({ extended: true }));

// Routes Middlewares
app.use('/api/auth/', authRoute);
app.use('/api/users/me', userRoute);
app.use('/api/notes', noteRoute);

app.listen(process.env.PORT || port, ()=> {
    console.log(`App is listening to port ${port}`);
});

