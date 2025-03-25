const express = require('express');
const nedb = require('nedb-promises');

const app = express();
const db = nedb.create('myfile.jsonl'); 

app.use(express.static('public')); 
app.use(express.json());           

// CREATE (POST /data)
app.post('/data', (req, res) => {
    const doc = req.body;
    db.insertOne(doc)
      .then(insertedDoc => {
          res.send(insertedDoc);
      })
      .catch(err => {
          res.send({ error: 'Could not insert document: ' + err });
      });
});

// READ one (GET /data/:id)
app.get('/data/:id', (req, res) => {
    db.findOne({ _id: req.params.id })
      .then(doc => {
          if (!doc) {
              res.send({ error: 'Document not found.' });
          } else {
              res.send(doc);
          }
      })
      .catch(err => {
          res.send({ error: 'Could not find document: ' + err });
      });
});

// READ all (GET /data)
app.get('/data', (req, res) => {
    db.find({})
      .then(docs => {
          res.send(docs);
      })
      .catch(err => {
          res.send({ error: err });
      });
});

// UPDATE (PATCH /data/:id)
app.patch('/data/:id', (req, res) => {

    db.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    .then(numUpdated => {
        if (!numUpdated) {

            return res.send({ error: 'No document found to update.' });
        }

        return db.findOne({ _id: req.params.id })
                 .then(updatedDoc => {
                     if (!updatedDoc) {
                         res.send({ error: 'Document updated but not found after update.' });
                     } else {
                         res.send(updatedDoc);
                     }
                 });
    })
    .catch(err => {
        res.send({ error: 'Could not update document: ' + err });
    });
});


app.delete('/data/:id', (req, res) => {
    db.remove({ _id: req.params.id })
      .then(numRemoved => {
          if (!numRemoved) {
              res.send({ error: 'No document found to remove.' });
          } else {
              res.send({ removed: numRemoved });
          }
      })
      .catch(err => {
          res.send({ error: 'Could not delete document: ' + err });
      });
});


app.all('*', (req, res) => {
    res.status(404).send('Invalid URL.');
});


app.listen(3000, () => console.log('Server started at http://localhost:3000'));
