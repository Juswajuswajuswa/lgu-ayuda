import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  addProjectName,
  addTodoToProject,
  deleteAllProjects,
  deleteProject,
  deleteTodos,
  getProjects,
  updateProject,
  updateProjectStatus,
  updateTodoStatus,
  updateTodoTitle,
} from "../controllers/project.controller.js";

const router = express.Router();

// router.post(`/add-project`, requireAuth, requireRole("admin"), addProject);
router.post(`/add-name`, addProjectName);
router.post(`/add-todos/:id`, addTodoToProject);
router.get(`/get-projects`, getProjects);
router.delete(`/:id/delete/:todoId`, deleteTodos);
router.delete(`/:id/delete-project`, deleteProject);
router.post(`/:id/update-status/:todoId`, updateTodoStatus);
router.post(`/:id/update-projectName`, updateProject);
router.post(`/:id/update-title/:todoId`, updateTodoTitle);
router.delete(`/delete-all`, deleteAllProjects);
router.put(`/:id/update-project-status`, updateProjectStatus);

export default router;
