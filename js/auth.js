/**
 * Authentication Module
 * Handles user authentication and session management
 */

const Auth = {
    // Default admin credentials
    ADMIN_CREDENTIALS: {
        username: 'admin',
        password: 'admin123'
    },

    SESSION_KEY: 'inventory_session',

    /**
     * Initialize authentication
     */
    init() {
        this.initializeUsers();
        this.checkSession();
    },

    /**
     * Initialize default admin user
     */
    initializeUsers() {
        const users = Storage.loadData(Storage.KEYS.USERS, []);
        if (users.length === 0) {
            users.push({
                id: '1',
                username: this.ADMIN_CREDENTIALS.username,
                password: this.ADMIN_CREDENTIALS.password,
                role: 'admin',
                createdAt: new Date().toISOString()
            });
            Storage.saveData(Storage.KEYS.USERS, users);
        }
    },

    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember me option
     * @returns {object} Login result
     */
    login(username, password, rememberMe = false) {
        const users = Storage.loadData(Storage.KEYS.USERS, []);
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            const session = {
                userId: user.id,
                username: user.username,
                role: user.role,
                loginTime: new Date().toISOString(),
                rememberMe
            };
            Storage.saveData(this.SESSION_KEY, session);
            Storage.logActivity('LOGIN', `User ${username} logged in`);
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    /**
     * Logout user
     */
    logout() {
        const session = this.getCurrentSession();
        if (session) {
            Storage.logActivity('LOGOUT', `User ${session.username} logged out`);
        }
        localStorage.removeItem(this.SESSION_KEY);
        window.location.href = 'login.html';
    },

    /**
     * Check if user is logged in
     * @returns {boolean} Authentication status
     */
    isLoggedIn() {
        const session = this.getCurrentSession();
        if (!session) return false;

        // Check if session expired (24 hours for non-remembered sessions)
        if (!session.rememberMe) {
            const loginTime = new Date(session.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            if (hoursDiff > 24) {
                this.logout();
                return false;
            }
        }
        return true;
    },

    /**
     * Get current session
     * @returns {object|null} Session data
     */
    getCurrentSession() {
        return Storage.loadData(this.SESSION_KEY, null);
    },

    /**
     * Get current user
     * @returns {object|null} User data
     */
    getCurrentUser() {
        const session = this.getCurrentSession();
        if (!session) return null;

        const users = Storage.loadData(Storage.KEYS.USERS, []);
        return users.find(u => u.id === session.userId) || null;
    },

    /**
     * Check session and redirect if not authenticated
     */
    checkSession() {
        if (!this.isLoggedIn()) {
            const currentPath = window.location.pathname;
            if (!currentPath.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }
    },

    /**
     * Change admin password
     * @param {string} currentPassword - Current password
     * @param {string} newPassword - New password
     * @returns {object} Result object
     */
    changePassword(currentPassword, newPassword) {
        const user = this.getCurrentUser();
        if (!user) return { success: false, message: 'Not authenticated' };

        const users = Storage.loadData(Storage.KEYS.USERS, []);
        const userIndex = users.findIndex(u => u.id === user.id);

        if (userIndex === -1) return { success: false, message: 'User not found' };

        if (users[userIndex].password !== currentPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }

        users[userIndex].password = newPassword;
        users[userIndex].updatedAt = new Date().toISOString();
        Storage.saveData(Storage.KEYS.USERS, users);
        Storage.logActivity('PASSWORD_CHANGE', `User ${user.username} changed password`);

        return { success: true, message: 'Password changed successfully' };
    },

    /**
     * Protect route - redirect to login if not authenticated
     */
    protectRoute() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
};

// Initialize auth on load
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
