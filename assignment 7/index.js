const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let users = [];

app.post('/users', (req, res) => {
    const { username, password, name, email } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    const newUser = { username, password, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});


app.get('/users', (req, res) => {
    res.json(users);
});


app.get('/users/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
});


app.patch('/users/:username', (req, res) => {
    const username = req.params.username;
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const { name, email } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    res.json(user);
});


app.delete('/users/:username', (req, res) => {
    const username = req.params.username;
    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(userIndex, 1);
    res.json({ message: 'User deleted' });
});


app.listen(3000, () => console.log(
    'Server started: http://localhost:3000'
));
