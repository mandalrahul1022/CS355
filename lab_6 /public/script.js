const idField = document.getElementById('docIdField');
const dataField = document.getElementById('dataField');
const readAllBtn = document.getElementById('getallBtn');
const readBtn = document.getElementById('readBtn');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const resultsDiv = document.getElementById('results');

// CREATE (POST)
createBtn.addEventListener('click', () => {
    fetch('/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: dataField.value
    })
    .then(r => r.json())
    .then(doc => {
        resultsDiv.innerHTML = '';
        resultsDiv.innerText += JSON.stringify(doc, null, 2);
    })
    .catch(err => console.error('Create Error:', err));
});

// UPDATE (PATCH)
updateBtn.addEventListener('click', () => {
    fetch('/data/' + idField.value, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: dataField.value
    })
    .then(r => r.json())
    .then(doc => {
        resultsDiv.innerHTML = '';
        resultsDiv.innerText += JSON.stringify(doc, null, 2);
    })
    .catch(err => console.error('Update Error:', err));
});

// READ ALL (GET)
readAllBtn.addEventListener('click', () => {
    fetch('/data')
    .then(r => r.json())
    .then(docs => {
        resultsDiv.innerHTML = '';
        docs.forEach(doc => {
            resultsDiv.innerText += JSON.stringify(doc, null, 2) + '\n';
        });
    })
    .catch(err => console.error('Read All Error:', err));
});

// READ ONE (GET)
readBtn.addEventListener('click', () => {
    fetch('/data/' + idField.value)
    .then(r => r.json())
    .then(doc => {
        resultsDiv.innerHTML = '';
        resultsDiv.innerText += JSON.stringify(doc, null, 2);
    })
    .catch(err => console.error('Read Error:', err));
});

// DELETE
deleteBtn.addEventListener('click', () => {
    fetch('/data/' + idField.value, {
        method: 'DELETE'
    })
    .then(r => r.json())
    .then(doc => {
        resultsDiv.innerHTML = '';
        resultsDiv.innerText += JSON.stringify(doc, null, 2);
    })
    .catch(err => console.error('Delete Error:', err));
});
