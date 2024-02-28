// send the info here 
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

mongoose.connect(process.env.MONGO_URL)


app.get('/test', (req, res) => {
    res.json('test OK')
});

app.post('/register' , (req,res) => {

})

app.listen(4000);
