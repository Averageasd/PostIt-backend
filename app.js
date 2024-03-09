require('dotenv').config()

const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const mongoose = require("mongoose");
const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5173",
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', 1);

const loginRoute = require("./route/login");
const signupRoute = require("./route/signup");
const logoutRoute = require("./route/logout");
const postRoute = require("./route/post");
const commentRoute = require('./route/comment');
console.log('yo');
async function main() {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
}

main().catch((err) => console.log(err));

app.use('/user', loginRoute);
app.use('/user', signupRoute);
app.use('/user', logoutRoute);
app.use('/posts', postRoute);
app.use('/comments', commentRoute);

app.listen(process.env.PORT, function () {
    console.log('Listening on port 3000');
});