import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  Id: {
    type: String,
    required: true
  },
  Title: {
    type: String,
    required: true
  },
  Status: {
    type: String,
    required: true
  },
  Summary: {
    type: String,
  },
  Type: {
    type: String,
  },
  Priority: {
    type: String,
  },
  Tags: {
    type: String,
  },
  Estimate: {
    type: Number,
  },
  Assignee: {
    type: String,
  },
  RankId: {
    type: Number,
  },
  Color: {
    type: String,
  },
  ClassName: {
    type: String,
  }
}, { timestamps: true });

export default  mongoose.model('Kanban', taskSchema);
