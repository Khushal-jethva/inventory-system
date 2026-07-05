/**
 * Charts Module
 * Handles Chart.js integration for dashboard visualizations
 */

const Charts = {
    charts: {},

    /**
     * Initialize all dashboard charts
     */
    initDashboardCharts() {
        this.createCategoryChart();
        this.createStatusChart();
        this.createDepartmentChart();
    },

    /**
     * Create assets by category chart
     */
    createCategoryChart() {
        const ctx = document.getElementById('categoryChart');
        if (!ctx) return;

        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        const categoryData = this.getCategoryData(inventory);

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#4cc9f0',
                        '#f8961e',
                        '#f72585',
                        '#10b981',
                        '#4361ee',
                        '#7209b7'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                },
                cutout: '60%'
            }
        });
    },

    /**
     * Create assets by status chart
     */
    createStatusChart() {
        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        const statusData = this.getStatusData(inventory);

        if (this.charts.status) {
            this.charts.status.destroy();
        }

        this.charts.status = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statusData.labels,
                datasets: [{
                    label: 'Assets',
                    data: statusData.values,
                    backgroundColor: [
                        '#10b981',
                        '#f8961e',
                        '#f72585',
                        '#4cc9f0'
                    ],
                    borderRadius: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    },

    /**
     * Create assets by department chart
     */
    createDepartmentChart() {
        const ctx = document.getElementById('departmentChart');
        if (!ctx) return;

        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        const departmentData = this.getDepartmentData(inventory);

        if (this.charts.department) {
            this.charts.department.destroy();
        }

        this.charts.department = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: departmentData.labels,
                datasets: [{
                    data: departmentData.values,
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.7)',
                        'rgba(118, 75, 162, 0.7)',
                        'rgba(76, 201, 240, 0.7)',
                        'rgba(248, 150, 30, 0.7)',
                        'rgba(247, 37, 133, 0.7)',
                        'rgba(16, 185, 129, 0.7)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            padding: 15,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    },

    /**
     * Get category data from inventory
     */
    getCategoryData(inventory) {
        const categories = {};
        inventory.forEach(item => {
            const category = item.category || 'Uncategorized';
            categories[category] = (categories[category] || 0) + 1;
        });

        return {
            labels: Object.keys(categories),
            values: Object.values(categories)
        };
    },

    /**
     * Get status data from inventory
     */
    getStatusData(inventory) {
        const statuses = {
            'Available': 0,
            'Assigned': 0,
            'Maintenance': 0,
            'Retired': 0
        };

        inventory.forEach(item => {
            const status = item.status || 'Available';
            if (statuses.hasOwnProperty(status)) {
                statuses[status]++;
            }
        });

        return {
            labels: Object.keys(statuses),
            values: Object.values(statuses)
        };
    },

    /**
     * Get department data from inventory
     */
    getDepartmentData(inventory) {
        const departments = {};
        inventory.forEach(item => {
            const dept = item.department || 'Unassigned';
            departments[dept] = (departments[dept] || 0) + 1;
        });

        return {
            labels: Object.keys(departments),
            values: Object.values(departments)
        };
    },

    /**
     * Update all charts
     */
    updateAllCharts() {
        this.createCategoryChart();
        this.createStatusChart();
        this.createDepartmentChart();
    },

    /**
     * Destroy all charts
     */
    destroyAllCharts() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
};
