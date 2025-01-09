import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import TodoModel from '../models/todo.js';

const router = express.Router();

router.post("/create-todo", verifyToken, async (req, res) => {
    const { todo } = req.body;
    const userId = req.userId;

    try {
        const newTodo = new TodoModel({ todo, userId });
        await newTodo.save();
        // Return the newly created todo object
        res.status(201).json({ message: "Todo created successfully", todo: newTodo });
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error: error.message });
    }
});

router.get("/read-todos", verifyToken, async (req, res) => {
    const userId = req.userId;
    
    try {
        const todos = await TodoModel.find({ userId: userId });
        res.status(200).json({ message: "Todos retrieved successfully", todos });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving todos", error: error.message });
    }
});

router.patch("/update-todo/:id", verifyToken, async (req, res) => {
    const todoId = req.params.id;
    const { updatedTodo } = req.body;

    try {
        const updated = await TodoModel.findByIdAndUpdate(todoId, { todo: updatedTodo }, { new: true });
        if (!updated) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo updated successfully", todo: updated });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
});

router.delete("/delete-todo/:id", verifyToken, async (req, res) => {
    const todoId = req.params.id;

    try {
        const deleted = await TodoModel.findOneAndDelete({ _id: todoId });
        if (!deleted) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json({ message: "Todo deleted successfully", todo: deleted });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error: error.message });
    }
});

export { router as todoRouter };
