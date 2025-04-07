const express = require('express');
const nedb = require("nedb-promises");
const bcrypt = require('bcrypt');

const app = express();
const db = nedb.create('users.jsonl');

app.use(express.static('public'));
app.use(express.json());

const saltRounds = 10;

// GET /users: Returns all users without passwords
app.get('/users', (req, res) => {
    db.find({})
        .then(docs => {
            const safeDocs = docs.map(({ password, ...rest }) => rest);
            res.json(safeDocs);
        })
        .catch(error => res.json({ error }));
});

// POST /users: Register a new user with hashed password
app.post('/users', (req, res) => {
    const { username, password, email, name } = req.body;
    if (!username || !password || !email || !name) {
        return res.json({ error: 'Missing fields.' });
    }
    db.findOne({ username })
        .then(existingUser => {
            if (existingUser) {
                return res.json({ error: 'Username already exists.' });
            }
            const hashedPassword = bcrypt.hashSync(password, saltRounds);
            db.insert({ username, password: hashedPassword, email, name })
                .then(doc => {
                    // Exclude password before sending response
                    const { password, ...safeDoc } = doc;
                    res.json(safeDoc);
                })
                .catch(error => res.json({ error }));
        })
        .catch(error => res.json({ error }));
});

// POST /users/auth: Authenticate user login
app.post('/users/auth', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({ error: 'Username and password required.' });
    }
    db.findOne({ username })
        .then(doc => {
            if (!doc) {
                return res.json({ error: 'Invalid username or password.' });
            }
            if (bcrypt.compareSync(password, doc.password)) {
                const { password, ...safeDoc } = doc;
                res.json(safeDoc);
            } else {
                res.json({ error: 'Invalid username or password.' });
            }
        })
        .catch(error => res.json({ error }));
});

// PATCH /users/:username: Update user information (excluding password)
app.patch('/users/:username', (req, res) => {
    db.update({ username: req.params.username }, { $set: req.body })
        .then(updatedCount => {
            if (updatedCount === 0) {
                return res.json({ error: 'Something went wrong.' });
            }
            res.json({ ok: true });
        })
        .catch(error => res.json({ error }));
});

// DELETE /users/:username: Delete user profile
app.delete('/users/:username', (req, res) => {
    db.remove({ username: req.params.username })
        .then(deletedCount => {
            if (deletedCount === 0) {
                return res.json({ error: 'Something went wrong.' });
            }
            res.json({ ok: true });
        })
        .catch(error => res.json({ error }));
});

// Default catch-all route
app.all('*', (req, res) => { res.status(404).send('Invalid URL.') });

app.listen(3000, () => console.log("Server started on http://localhost:3000"));
