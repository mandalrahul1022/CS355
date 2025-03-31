document.addEventListener('DOMContentLoaded', () => {
    // Get references to DOM elements
    const loginScreen = document.getElementById('loginScreen');
    const registerScreen = document.getElementById('registerScreen');
    const homeScreen = document.getElementById('homeScreen');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutLink = document.getElementById('logoutLink');
    const updateBtn = document.getElementById('updateBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const errorDiv = document.getElementById('error');
    const userlistDiv = document.getElementById('userlist');

    let currentUser = null;

    // Helper function to switch screens
    function showScreen(screen) {
        loginScreen.classList.add('hidden');
        registerScreen.classList.add('hidden');
        homeScreen.classList.add('hidden');
        screen.classList.remove('hidden');
        errorDiv.textContent = '';
    }

    // Toggle between login and registration screens
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(registerScreen);
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen(loginScreen);
    });

    logoutLink.addEventListener('click', (e) => {
        e.preventDefault();
        currentUser = null;
        showScreen(loginScreen);
    });

    // Register new user (drop your internship profile)
    registerBtn.addEventListener('click', async () => {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;

        try {
            const res = await fetch('/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, name, email })
            });
            if (!res.ok) {
                const errorData = await res.json();
                errorDiv.textContent = errorData.error || 'Registration failed';
                return;
            }
            const user = await res.json();
            currentUser = user;
            // Update home screen with user info
            document.getElementById('name').textContent = user.name;
            document.getElementById('username').textContent = user.username;
            showScreen(homeScreen);
            loadUserList();
        } catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
        }
    });

    // User login
    loginBtn.addEventListener('click', async () => {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;
        try {
            const res = await fetch('/users/' + username);
            if (!res.ok) {
                errorDiv.textContent = 'User not found';
                return;
            }
            const user = await res.json();
            // For demo purposes, password check is done on the client.
            if (user.password !== password) {
                errorDiv.textContent = 'Incorrect password';
                return;
            }
            currentUser = user;
            document.getElementById('name').textContent = user.name;
            document.getElementById('username').textContent = user.username;
            showScreen(homeScreen);
            loadUserList();
        } catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
        }
    });

    // Update user information
    updateBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        const username = currentUser.username;
        const updateName = document.getElementById('updateName').value;
        const updateEmail = document.getElementById('updateEmail').value;
        try {
            const res = await fetch('/users/' + username, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: updateName, email: updateEmail })
            });
            if (!res.ok) {
                const errorData = await res.json();
                errorDiv.textContent = errorData.error || 'Update failed';
                return;
            }
            const updatedUser = await res.json();
            currentUser = updatedUser;
            document.getElementById('name').textContent = updatedUser.name;
            loadUserList();
        } catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
        }
    });

    // Delete user profile
    deleteBtn.addEventListener('click', async () => {
        if (!currentUser) return;
        const username = currentUser.username;
        try {
            const res = await fetch('/users/' + username, {
                method: 'DELETE'
            });
            if (!res.ok) {
                const errorData = await res.json();
                errorDiv.textContent = errorData.error || 'Delete failed';
                return;
            }
            currentUser = null;
            showScreen(loginScreen);
            loadUserList();
        } catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
        }
    });

    // Load and display list of all internship profiles
    async function loadUserList() {
        try {
            const res = await fetch('/users');
            if (res.ok) {
                const users = await res.json();
                userlistDiv.innerHTML = '';
                users.forEach(user => {
                    const div = document.createElement('div');
                    div.textContent = `${user.username} - ${user.name} - ${user.email}`;
                    userlistDiv.appendChild(div);
                });
            }
        } catch (error) {
            console.error(error);
        }
    }

    // Initially display the login screen
    showScreen(loginScreen);
});
