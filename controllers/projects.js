const Project = require('../models/Project')
const { StatusCodes } = require('http-status-codes')

// Create project
const createProject = async (req, res) => {
  req.body.createdBy = req.user.userId
  
  const project = await Project.create(req.body)
  res.status(StatusCodes.CREATED).json({ project })
}

// Get all projects


const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.status(200).json({ projects, count: projects.length });
  } catch (error) {
    console.error('Error in getAllProjects:', error);
    res.status(500).json({ msg: error.message });
  }
};

// GET single project
const getProject = async (req, res) => {
  const { id: projectId } = req.params
  const project = await Project.findOne({
    _id: projectId,
    createdBy: req.user.userId,
  })

  if (!project) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No project with id ${projectId}` })
  }

  res.status(StatusCodes.OK).json({ project })
}

// Update project
const updateProject = async (req, res) => {
  const { id: projectId } = req.params

  const project = await Project.findOneAndUpdate(
    { _id: projectId, createdBy: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  )

  if (!project) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No project with id ${projectId}` })
  }

  res.status(StatusCodes.OK).json({ project })
}

// Delete project
const deleteProject = async (req, res) => {
  const { id: projectId } = req.params

  const project = await Project.findOneAndDelete({
    _id: projectId,
    createdBy: req.user.userId,
  })

  if (!project) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ msg: `No project with id ${projectId}` })
  }

  res.status(StatusCodes.OK).json({ msg: 'Project removed' })
}

module.exports = {
  createProject,
  getAllProjects,
  getProject,
  updateProject,
  deleteProject,
}
