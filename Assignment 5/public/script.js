document.addEventListener('DOMContentLoaded', () => {

    const pageId = location.pathname.replace('/', '').replace('.html', '') || 'index';


    fetch(`/hits/${pageId}`)
        .then(response => response.text())
        .then(count => {
            document.getElementById('hits').innerText = `Current hits for this page: ${count}`;
        })
        .catch(err => {
            console.error('Error fetching hit count:', err);
        });
});
