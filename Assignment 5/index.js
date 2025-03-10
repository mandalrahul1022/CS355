const express = require('express');
const nedb = require('nedb-promises');

const app = express();
const PORT = 3000;

// Load nedb-promises to store hits
const db = nedb.create({ filename: 'myfile.jsonl', autoload: true });

app.use(express.static('public')); // Serve static files from "public" folder

// Route to count hits for each page
app.get('/hits/:pageId', async (req, res) => {
    const { pageId } = req.params;

    try {
        let record = await db.findOne({ pageId });

        if (record) {
            record.count += 1;
            await db.update({ pageId }, record);
        } else {
            record = { pageId, count: 1 };
            await db.insert(record);
        }

        res.send(record.count.toString());
    } catch (err) {
        console.error(err);
        res.status(500).send('Error handling request');
    }
});

// Default route for invalid URLs
app.all('*', (req, res) => res.status(404).send('Invalid URL.'));

app.listen(PORT, () => console.log(`Server started: http://localhost:${PORT}`));
