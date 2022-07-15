const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const app = express();

dotenv.config();

const port = 8080;

// Log request
app.use(morgan('combined'));

// Import routes
const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const loadRoute = require('./routes/loadRoute');
const truckRoute = require('./routes/truckRoute');

// Connect to DB
mongoose
.connect(process.env.DB_CONNECT)
.then(() => console.log('Connect DB'))
.catch((e) => console.log(e));

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes Middlewares
app.use('/api/auth', authRoute);
app.use('/api/users/me', userRoute);
app.use('/api/loads', loadRoute);
app.use('/api/trucks', truckRoute);

app.listen(port || process.env.PORT, () => {
    console.log(`App listening to port ${port}`);
});

