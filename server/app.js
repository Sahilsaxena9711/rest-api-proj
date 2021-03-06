const express = require('express');
const app =  express();
const morgan = require('morgan');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const blogRoutes = require('./api/routes/blog');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb://sahil:saxena@ds251179.mlab.com:51179/restapi')
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use('/blog',blogRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error,req,res,next) => {
        res.status(error.status || 500);
        res.json({
            error: {
                message : error.message
            }
        })
})

module.exports = app;