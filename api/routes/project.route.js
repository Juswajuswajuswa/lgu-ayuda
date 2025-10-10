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
  getSingleProject,
  updateProject,
  updateProjectStatus,
  updateTodoStatus,
  updateTodoTitle,
} from "../controllers/project.controller.js";

const router = express.Router();

// router.post(`/add-project`, requireAuth, requireRole("admin"), addProject);
router.post(`/add-name`, requireAuth, requireRole("admin"), addProjectName);
router.post(
  `/add-todos/:id`,
  requireAuth,
  requireRole("admin"),
  addTodoToProject
);
router.get(`/get-projects`, getProjects);
router.get(`/get-project/:id`, getSingleProject);
router.delete(
  `/:id/delete/:todoId`,
  requireAuth,
  requireRole("admin"),
  deleteTodos
);
router.delete(
  `/:id/delete-project`,
  requireAuth,
  requireRole("admin"),
  deleteProject
);
router.post(
  `/:id/update-status/:todoId`,
  requireAuth,
  requireRole("admin"),
  updateTodoStatus
);
router.post(
  `/:id/update-projectName`,
  requireAuth,
  requireRole("admin"),
  updateProject
);
router.post(
  `/:id/update-title/:todoId`,
  requireAuth,
  requireRole("admin"),
  updateTodoTitle
);
router.delete(
  `/delete-all`,
  requireAuth,
  requireRole("admin"),
  deleteAllProjects
);
router.put(
  `/:id/update-project-status`,
  requireAuth,
  requireRole("admin"),
  updateProjectStatus
);

export default router;
