import KanbanModel from "../Models/KanbanModel.js";

// Async function to get a task by its Id
export const GetTask = async (req, res, next) => {
  try {
    KanbanModel.find({ Id: req.params.id }).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Async function to get all tasks
export const GetAllTasks = async (req, res, next) => {
  try {
    KanbanModel.find({}).exec(function (error, data) {
      if (error) {
        return next(error);
      }
      res.json(data);
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// Async function to add a new task
export const AddNewTask = async (req, res) => {
  try {
    const newTask = new KanbanModel({
      Id: req.body.Id,
      Title: req.body.Title,
      Status: req.body.Status,
      Summary: req.body.Summary,
      Type: req.body.Type,
      Priority: req.body.Priority,
      Tags: req.body.Tags,
      Estimate: req.body.Estimate,
      Assignee: req.body.Assignee,
      RankId: req.body.RankId,
      Color: req.body.Color,
      ClassName: req.body.ClassName
    });

    const savedTask = await newTask.save(); // Save the new task to the database

    res.status(201).json(savedTask); // Return the saved task as a response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Handle any errors that occur
  }
};

// Async function to update a task by its Id
export const UpdateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { Title, Status, Summary, Type, Priority, Tags, Estimate, Assignee, RankId, Color, ClassName } = req.body;

    const task = await KanbanModel.findByIdAndUpdate(id, {
      Title,
      Status,
      Summary,
      Type,
      Priority,
      Tags,
      Estimate,
      Assignee,
      RankId,
      Color,
      ClassName
    }, { new: true });

    if (!task) {
      return res.status(404).send({ message: "Task not found" });
    }

    res.status(200).send({ task });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

// Async function to delete a task by its Id
export const DeleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await KanbanModel.findOneAndDelete({ Id: id });
    if (!deletedTask) {
      return res.status(404).send({ message: 'Task not found' });
    }
    return res.status(200).send({ message: 'Task deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

