const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(morgan("combined"));

const port = 8080;

const filesRouter = require('./routers/files');

app.use('/', filesRouter);

app.listen(port, () => {
  console.log(`App starting at port ${port}`);
})