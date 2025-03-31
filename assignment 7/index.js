const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
// Serve static files from the public folder
app.use(express.static(path.join(__dirname, 'public')));

// In-memory "database" for users (for demo purposes)
// Each user document will have: { username, password, name, email }
let users = [];

// POST /users - Register a new user (submit your internship profile)
app.post('/users', (req, res) => {
    const { username, password, name, email } = req.body;
    // TODO: Validate input data as needed
    // Check if user already exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = { username, password, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// GET /users - Return all internship profiles
app.get('/users', (req, res) => {
    res.json(users);
});

// GET /users/:username - Return profile matching {username}
app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});

// PATCH /users/:username - Update profile matching {username}
app.patch('/users/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    // TODO: Validate updated data if necessary
    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    res.json(user);
});

// DELETE /users/:username - Delete profile matching {username}
app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted' });
});

// Start the server
app.listen(3000, () => console.log(
    'Server started: http://localhost:3000'
));
