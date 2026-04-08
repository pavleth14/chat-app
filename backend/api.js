const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors'); // koristi cors paket
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const api = express();
const indexRouter = require('./index');

// ========== MongoDB ==========
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ========== CORS ==========
const corsOptions = {
  origin: 'http://localhost:3000', // frontend
  credentials: true,               // dozvoljava cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// CORS middleware pre parsers i ruta
api.use(cors(corsOptions));

// Middleware
api.use(logger('dev'));
api.use(express.json());
api.use(express.urlencoded({ extended: false }));
api.use(cookieParser());
api.use(express.static(path.join(__dirname, 'public')));

// Routes
api.use('/', indexRouter);

// 404 handler
api.use((req, res, next) => {
  next(createError(404));
});

// Error handler
api.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({ error: true, message: err.message });
});

module.exports = api;