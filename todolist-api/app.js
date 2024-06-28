const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connexion à MongoDB
mongoose.connect('mongodb+srv://testapi:testapi@todolist-api.xdgv6xp.mongodb.net/?retryWrites=true&w=majority&appName=todolist-api')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Définition du modèle Task
const Task = mongoose.model('Task', new mongoose.Schema({
    title: String,
    description: String,
    completed: { type: Boolean, default: false }
}));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find();
    res.render('taskList', { tasks });
});

app.post('/tasks', async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.redirect('/tasks');
});

app.get('/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.render('taskDetail', { task });
});

app.post('/tasks/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/tasks');
});

app.post('/tasks/delete/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.redirect('/tasks');
  });

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
