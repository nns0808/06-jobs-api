const express = require('express')
const router = express.Router()

const authenticateUser = require('../middleware/authentication')

const {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projects')


router.use(authenticateUser)

router
  .route('/')
  .post(createProject)
  .get(getAllProjects)

router
  .route('/:id')
  .get(getProject)
  .patch(updateProject)
  .delete(deleteProject)

module.exports = router
