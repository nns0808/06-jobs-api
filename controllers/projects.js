const Project = require('../models/Project')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')


// CREATE PROJECT

const createProject = async (req, res) => {
  const {
    user: { userId },
  } = req

  req.body.createdBy = userId
  const project = await Project.create(req.body)

  res.status(StatusCodes.CREATED).json({ project })
}


// GET ALL PROJECTS (ONLY USER'S)

const getAllProjects = async (req, res) => {
  const {
    user: { userId },
  } = req

  const projects = await Project.find({ createdBy: userId }).sort('createdAt')

  res.status(StatusCodes.OK).json({
    projects,
    count: projects.length,
  })
}


// GET SINGLE PROJECT

const getProject = async (req, res) => {
  const {
    user: { userId },
    params: { id: projectId },
  } = req

  const project = await Project.findOne({
    _id: projectId,
    createdBy: userId,
  })

  if (!project) {
    throw new NotFoundError(`No project with id ${projectId}`)
  }

  res.status(StatusCodes.OK).json({ project })
}


// UPDATE PROJECT

const updateProject = async (req, res) => {
  const {
    body: { title, description },
    user: { userId },
    params: { id: projectId },
  } = req

  if (title === '' || description === '') {
    throw new BadRequestError('Title or description cannot be empty')
  }

  const project = await Project.findOneAndUpdate(
    { _id: projectId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!project) {
    throw new NotFoundError(`No project with id ${projectId}`)
  }

  res.status(StatusCodes.OK).json({ project })
}


// DELETE PROJECT

const deleteProject = async (req, res) => {
  const {
    user: { userId },
    params: { id: projectId },
  } = req

  const project = await Project.findOneAndDelete({
    _id: projectId,
    createdBy: userId,
  })

  if (!project) {
    throw new NotFoundError(`No project with id ${projectId}`)
  }

  res.status(StatusCodes.OK).json({ msg: 'Project removed' })
}


// EXPORTS

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
}

