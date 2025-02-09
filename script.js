const $ = document.querySelector.bind(document);
const toggleBtn = $('#dark-mode-toggle');

// Ensure button exists
if (!toggleBtn) {
    console.error("Dark mode toggle button not found!");
}

// Toggle theme when button is clicked
toggleBtn.addEventListener('click', () => {
    const isDarkMode = document.documentElement.getAttribute('theme') === 'dark';

    if (isDarkMode) {
        document.documentElement.removeAttribute('theme');
        toggleBtn.innerText = 'DARK';
    } else {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
    }
});
