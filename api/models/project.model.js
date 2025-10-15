import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["in progress", "completed", "cancelled"],
    default: "in progress",
  },
});

const ProjectModelSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
    unique: true,
  },
  projectTodos: [TodoSchema], // embedded subdocuments
  description: {
    type: String,
  },
  budget: {
    type: Number,
    default: 0,
    required: true,
  },
  status: {
    type: String,
    enum: ["in progress", "completed", "cancelled"],
    default: "in progress",
  },
});

const Project = mongoose.model("Project", ProjectModelSchema);

export default Project;
