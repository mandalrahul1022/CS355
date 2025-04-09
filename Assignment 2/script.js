document.addEventListener("DOMContentLoaded", function () {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    

    if (localStorage.getItem('dark-mode') === 'enabled') {
        document.documentElement.setAttribute('theme', 'dark');
        toggleBtn.innerText = 'LIGHT';
    }

    toggleBtn.addEventListener('click', () => {
        const isDarkMode = document.documentElement.getAttribute('theme') === 'dark';

        if (isDarkMode) {
            document.documentElement.removeAttribute('theme');
            localStorage.setItem('dark-mode', 'disabled');
            toggleBtn.innerText = 'DARK';
        } else {
            document.documentElement.setAttribute('theme', 'dark');
            localStorage.setItem('dark-mode', 'enabled');
            toggleBtn.innerText = 'LIGHT';
        }
    });
});
