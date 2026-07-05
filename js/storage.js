/**
 * Storage Module
 * Handles all LocalStorage operations for the Inventory Management System
 */

const Storage = {
    // Storage keys
    KEYS: {
        INVENTORY: 'inventory_data',
        USERS: 'inventory_users',
        SETTINGS: 'inventory_settings',
        ACTIVITY: 'inventory_activity',
        SESSION: 'inventory_session'
    },

    /**
     * Save data to LocalStorage
     * @param {string} key - Storage key
     * @param {any} data - Data to store
     */
    saveData(key, data) {
        try {
            const jsonData = JSON.stringify(data);
            localStorage.setItem(key, jsonData);
            return true;
        } catch (error) {
            console.error('Error saving data:', error);
            return false;
        }
    },

    /**
     * Load data from LocalStorage
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if key doesn't exist
     * @returns {any} Stored data or default value
     */
    loadData(key, defaultValue = null) {
        try {
            const jsonData = localStorage.getItem(key);
            if (jsonData === null) return defaultValue;
            return JSON.parse(jsonData);
        } catch (error) {
            console.error('Error loading data:', error);
            return defaultValue;
        }
    },

    /**
     * Update a specific record in storage
     * @param {string} key - Storage key
     * @param {string} id - Record ID
     * @param {object} updates - Object with fields to update
     */
    updateData(key, id, updates) {
        const data = this.loadData(key, []);
        const index = data.findIndex(item => item.id === id);
        if (index !== -1) {
            data[index] = { ...data[index], ...updates, updatedDate: new Date().toISOString() };
            this.saveData(key, data);
            return true;
        }
        return false;
    },

    /**
     * Delete a record from storage
     * @param {string} key - Storage key
     * @param {string} id - Record ID
     */
    deleteData(key, id) {
        const data = this.loadData(key, []);
        const filteredData = data.filter(item => item.id !== id);
        this.saveData(key, filteredData);
        return true;
    },

    /**
     * Backup all data as JSON
     * @returns {string} JSON string of all data
     */
    backupData() {
        const backup = {
            inventory: this.loadData(this.KEYS.INVENTORY, []),
            users: this.loadData(this.KEYS.USERS, []),
            settings: this.loadData(this.KEYS.SETTINGS, {}),
            activity: this.loadData(this.KEYS.ACTIVITY, []),
            backupDate: new Date().toISOString()
        };
        return JSON.stringify(backup, null, 2);
    },

    /**
     * Restore data from JSON backup
     * @param {string} jsonString - JSON string of backup data
     */
    restoreData(jsonString) {
        try {
            const backup = JSON.parse(jsonString);
            if (backup.inventory) this.saveData(this.KEYS.INVENTORY, backup.inventory);
            if (backup.users) this.saveData(this.KEYS.USERS, backup.users);
            if (backup.settings) this.saveData(this.KEYS.SETTINGS, backup.settings);
            if (backup.activity) this.saveData(this.KEYS.ACTIVITY, backup.activity);
            return true;
        } catch (error) {
            console.error('Error restoring data:', error);
            return false;
        }
    },

    /**
     * Clear all data from LocalStorage
     */
    clearAllData() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    },

    /**
     * Get storage usage information
     * @returns {object} Storage usage stats
     */
    getStorageInfo() {
        let total = 0;
        const info = {};
        Object.values(this.KEYS).forEach(key => {
            const data = localStorage.getItem(key);
            const size = data ? data.length : 0;
            total += size;
            info[key] = size;
        });
        return { total, details: info };
    },

    /**
     * Add activity log entry
     * @param {string} action - Action performed
     * @param {string} details - Action details
     */
    logActivity(action, details) {
        const activity = this.loadData(this.KEYS.ACTIVITY, []);
        activity.unshift({
            id: Date.now().toString(),
            action,
            details,
            timestamp: new Date().toISOString(),
            user: Auth.getCurrentUser() ? Auth.getCurrentUser().username : 'System'
        });
        // Keep only last 100 activities
        if (activity.length > 100) activity.pop();
        this.saveData(this.KEYS.ACTIVITY, activity);
    },

    /**
     * Get recent activities
     * @param {number} limit - Number of activities to return
     */
    getRecentActivities(limit = 10) {
        const activity = this.loadData(this.KEYS.ACTIVITY, []);
        return activity.slice(0, limit);
    }
};
