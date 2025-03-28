const express = require('express');
// require('dotenv').config()
const app = express();
// const port = 3000;
// const mongoose = require('mongoose');
// const usersRouter = require('./routes/users');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
// const express = require('express');
require('dotenv').config()
// const app = express();
const port = 3000;
const mongoose = require('mongoose');
const usersRouter = require('./routes/users');
const newsRouter = require('./routes/news');

app.use("/v1/users", usersRouter);
app.use("/v1/news", newsRouter);

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log("Connected to MongoDB!");
    
    app.listen(process.env.PORT, () => {
        console.log("Server running on port:", process.env.PORT);
    }).on('error', (e) => console.log(e));    
});
//


module.exports = app;