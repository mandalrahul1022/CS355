const express = require('express'); // load express module
const nedb = require("nedb-promises"); // load nedb module

const app = express(); // init app
const db = nedb.create('myfile.jsonl'); // init db
app.use(express.static('public')); // enable static routing hiop[]\
app.use(express.json());


// Create route
app.post('/data', (req, res) => {
    const doc = req.body;
    db.insertOne(doc)
    .then(doc => res.send({ _id: doc._id }))
    .catch(err => res.send({ error: 'Could not insert document.' + err }));
});

// Read route
app.get('/data/:id', (req, res) => {
    db.findOne({_id: req.params.id})
    .then(doc => res.send(doc))
    .catch(err => res.send({ error: 'Could not find document.' + err }));
});

// Get All 
app.get('/data', (req, res) => {
    db.find({})
    .then(docs => res.send(docs))
    .catch(error => res.send({ error}));
});

// Update
app.patch('/data:id', (req, res) => {
    db.updateOne(
        {_id: req.params.id},
        {$set: req.body}
    ).then(result => res.send(result))
    .catch(error => res.send({ error}));
});
// delete
app.delete('/data/:id', (req,res)=>{

});


// default route

app.all('*', (req, res) => { res.status(404).send('Invalid URL.') });
// start server

app.listen(3000, () => console.log(
    'Server started: http://localhost:3000'
));