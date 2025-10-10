import mongoose, { set } from "mongoose";
import Project from "../models/project.model.js";
import { validateTypes } from "../utils/validateType.js";

const VALID_STATUS = ["in progress", "completed", "cancelled"];

export const addProjectName = async (req, res, next) => {
  try {
    const { projectName, budget, description } = req.body;

    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is required" });
    }

    if (!budget)
      return res
        .status(400)
        .json({ sucess: false, message: "Budget is requied" });

    if (!typeof budget === "number") {
      return res
        .status(400)
        .json({ success: false, message: "Budget must be a number" });
    }

    if (!projectName)
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });

    const project = new Project({
      projectName,
      budget,
      description,
      status: "in progress",
      projectTodos: [],
    });

    await project.save();

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: project,
    });
  } catch (error) {
    next(error);
  }
};

export const addTodoToProject = async (req, res, next) => {
  try {
    const { id } = req.params; // project ID
    const { title } = req.body;

    if (!title) throw new AppError(400, "Todo title is required");

    // find project
    const project = await Project.findById(id);

    if (!project) {
      return res
        .status(400)
        .json({ success: true, message: `Project not found for ID: ${id}` });
    }

    project.projectTodos.push({ title });
    await project.save();

    res.status(200).json({
      success: true,
      message: "Todo added successfully",
      project,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    if (!projects)
      return res.json({
        success: false,
        message: "empty projects",
        projects: [],
      });

    res.status(200).json({ success: true, message: "fetched", data: projects });
  } catch (error) {
    next(error);
  }
};

export const deleteTodos = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project id" });
    const projectTodo = project.projectTodos.id(todoId);
    if (!projectTodo)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project todo id" });

    projectTodo.deleteOne();

    await project.save();

    res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
      project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodoStatus = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    const { status } = req.body;

    validateTypes(VALID_STATUS, status, res);

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(todoId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    if (!status)
      return res
        .status(400)
        .json({ success: false, message: "status is required" });

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "invalid project id" });
    const projectTodo = project.projectTodos.id(todoId);
    const projectTodosArray = project.projectTodos;
    if (!projectTodo)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project todo id" });

    projectTodo.status = status;

    if (projectTodosArray && projectTodosArray.length > 0) {
      const allCompleted = projectTodosArray.every(
        (item) => item.status === "completed"
      );

      if (allCompleted) {
        project.status = "completed";
      } else {
        project.status = "in progress";
      }
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Todo status updated successfully",
      projectTodo,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectName, description, budget } = req.body;

    if (description) {
      if (!description) {
        return res
          .status(400)
          .json({ success: false, message: "Description is required" });
      }
    }

    if (budget) {
      if (!typeof budget === "number") {
        return res
          .status(400)
          .json({ success: false, message: "Budget must be a number" });
      }

      if (!budget)
        return res
          .status(400)
          .json({ sucess: false, message: "Budget is requied" });
    }

    if (projectName) {
      if (!projectName)
        return res
          .status(400)
          .json({ success: false, message: "Project name is required" });
    }

    const project = await Project.findByIdAndUpdate(
      id,
      {
        $set: {
          projectName: projectName,
          description: description,
          budget: budget,
        },
      },
      { new: true }
    );

    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "invalid project id" });
    }

    res.status(200).json({
      success: true,
      message: "successfully updated a projec tname",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTodoTitle = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    const { title } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(todoId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    if (!title)
      return res
        .status(400)
        .json({ success: false, message: "title is required" });

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "invalid project id" });

    const projectTodo = project.projectTodos.id(todoId);
    if (!projectTodo)
      return res.status(400).json({ success: false, message: "Invalid id" });

    projectTodo.title = title;

    await project.save();

    res.status(200).json({
      success: true,
      message: "successfully updated a title",
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deleteProject = await Project.findByIdAndDelete(id);
    if (!deleteProject)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project id" });
    res.status(200).json({
      success: true,
      message: "successfully deleted a project",
      deleted: deleteProject,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllProjects = async (req, res, next) => {
  try {
    const project = await Project.find();
    if (project.length === 0)
      return res
        .status(400)
        .json({ success: true, message: "No projects to be deleted " });

    const projects = await Project.deleteMany();
    res.status(204).json({
      success: true,
      message: "all projects are deleted",
      deleted: projects,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProjectStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    validateTypes(VALID_STATUS, status, res);

    const project = await Project.findById(id);
    const projectTodo = project.projectTodos;

    if (!project) {
      return res
        .status(400)
        .json({ sucess: false, message: "invalid project update id" });
    }

    project.status = status;

    updateStatus(status, projectTodo);

    await project.save();

    res.status(200).json({
      success: true,
      message: `Successfully updated a status to ${status}`,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateStatus = (status, array) => {
  if (status === `${status}`) {
    array.map((item) => {
      item.status = `${status}`;
    });
  }
};

export const getSingleProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "project does not exist" });
    res
      .status(200)
      .json({ success: true, message: "project found", data: project });
  } catch (error) {
    next(error);
  }
};
