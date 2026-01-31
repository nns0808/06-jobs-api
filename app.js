require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

// db
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/auth');
const projectsRouter = require('./routes/projects');


app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));
app.use(helmet());
app.use(cors());
app.use(xss());

// json parser
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('projects api');
});
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/projects', projectsRouter);

// error handling middleware (last)
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

// start server
const port = process.env.PORT || 3000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}...`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

start();
