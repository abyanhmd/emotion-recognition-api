const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const jwtHelper = require('./helper/jwt')

require('dotenv/config');

app.use(cors());
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(express.urlencoded({ extended: true }));
app.use(jwtHelper);

// Routers
const api = process.env.API_URL;
const signupRoutes = require('./routes/signup-routes');
app.use(`${api}/signup`, signupRoutes);

const historyRoutes = require('./routes/history-routes');
app.use(`${api}/history`, historyRoutes)

const loginRoutes = require('./routes/login-routes');
app.use(`${api}/login`, loginRoutes)

const userRoutes = require('./routes/user-routes.js');
app.use(`${api}/user`, userRoutes)

mongoose.connect(process.env.CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME
})
    .then(() => {
        console.log('Database connected...')
    })
    .catch((err) => {
        console.log(err)
    });

app.listen(process.env.PORT || 3000, () => {
    console.log("Connected to localhost...")
});