require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

// db

const connectDB = require('./db/connect'); 

// routers
const authRouter = require('./routes/auth')
const projectsRouter = require('./routes/projects')

// middleware
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('projects api');
});
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/projects', projectsRouter);

// error handling middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// start server
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
