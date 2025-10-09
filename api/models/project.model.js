import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const ProjectModelSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectTodos: [TodoSchema], // embedded subdocuments
});

const Project = mongoose.model("Project", ProjectModelSchema);

export default Project;
