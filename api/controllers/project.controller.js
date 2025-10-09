import mongoose from "mongoose";
import Project from "../models/project.model.js";

export const addProjectName = async (req, res, next) => {
  try {
    const { projectName } = req.body;

    if (!projectName)
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });

    const project = new Project({
      projectName,
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

export const updateToComplete = async (req, res, next) => {
  try {
    const { id, todoId } = req.params;
    const { completed } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(todoId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ID format" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Completed field must be true or false",
      });
    }

    const project = await Project.findById(id);
    if (!project)
      return res
        .status(400)
        .json({ success: false, message: "invalid project id" });
    const projectTodo = project.projectTodos.id(todoId);
    if (!projectTodo)
      return res
        .status(400)
        .json({ success: false, message: "Invalid project todo id" });

    projectTodo.completed = completed;

    // 5️⃣ Save the updated project
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

export const updateProjectName = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { projectName } = req.body;

    const project = await Project.findByIdAndUpdate(
      id,
      {
        $set: {
          projectName: projectName,
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
    res
      .status(200)
      .json({
        success: true,
        message: "successfully deleted a project",
        deleted: deleteProject,
      });
  } catch (error) {
    next(error);
  }
};
