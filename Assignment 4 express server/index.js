
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));

const breeds = {
    beagle: ['beagle1.jpg', 'beagle2.jpg'],
    golden: ['golden1.jpg', 'golden2.jpg'],
    labrador: ['labrador1.jpg', 'labrador2.jpg']
};

const randInt = n => Math.floor(n * Math.random());
const getRandomItemFromArray = arr => arr[randInt(arr.length)];

app.get('/breeds', (req, res) => {
    res.json(Object.keys(breeds));
});

app.get('/image/:breed', (req, res) => {
    const breed = req.params.breed;
    if (breeds[breed]) {
        const image = getRandomItemFromArray(breeds[breed]);
        res.json({ url: `/img/${image}` });
    } else {
        res.status(404).json({ error: 'Breed not found' });
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
