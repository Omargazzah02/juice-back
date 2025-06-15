const express = require('express');
const helmet = require('helmet');
require('dotenv').config();
const rateLimit = require("express-rate-limit");
const cookieParser = require('cookie-parser');

const app = express();


app.use(cookieParser());





app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50                
}));


const cors = require('cors');

app.use(helmet());


app.use(cors({
  origin: 'http://localhost:3000',
    credentials: true

}));

app.use(express.json());

app.disable('x-powered-by');


app.use(express.json({ limit: '10kb' }));


const authRoutes = require('./routes/auth.routes');
const productsRoutes = require ('./routes/products.routes')
const ordersRoutes = require ('./routes/orders.routes')
const logger = require('./logger');


app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
  });
  next();
});


app.use('/auth', authRoutes);





app.use('/products' , productsRoutes)

app.use('/orders', ordersRoutes)




module.exports = app;
