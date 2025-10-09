import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/roles.js";
import {
  addProjectName,
  addTodoToProject,
  deleteTodos,
  getProjects,
  updateProjectName,
  updateToComplete,
  updateTodoTitle,
} from "../controllers/project.controller.js";

const router = express.Router();

// router.post(`/add-project`, requireAuth, requireRole("admin"), addProject);
router.post(`/add-name`, addProjectName);
router.post(`/add-todos/:id`, addTodoToProject);
router.get(`/get-projects`, getProjects);
router.delete(`/:id/delete/:todoId`, deleteTodos);
router.post(`/:id/update-complete/:todoId`, updateToComplete);
router.post(`/:id/update-projectName`, updateProjectName);
router.post(`/:id/update-title/:todoId`, updateTodoTitle);

export default router;
