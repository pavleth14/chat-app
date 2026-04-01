const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

require('dotenv').config();

const api = express();
const indexRouter = require('./index'); // ← ovo je router, ne app

// ========== MongoDB ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// middleware
api.use(cors());
api.use(logger('dev'));
api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.use(cookieParser());
api.use(express.static(path.join(__dirname, 'public')));

// routes
api.use('/', indexRouter); 

// catch 404
api.use((req, res, next) => {
  next(createError(404));
});

// error handler
api.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: true, message: err.message });
});

module.exports = api;