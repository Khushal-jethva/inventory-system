/**
 * Inventory Module
 * Handles CRUD operations for inventory items
 */

const Inventory = {
    currentPage: 1,
    itemsPerPage: 10,
    currentFilter: {},
    currentSort: { field: 'createdDate', direction: 'desc' },

    /**
     * Initialize inventory module
     */
    init() {
        this.loadInventory();
        this.initEventListeners();
    },

    /**
     * Load inventory data
     */
    loadInventory() {
        return Storage.loadData(Storage.KEYS.INVENTORY, []);
    },

    /**
     * Save inventory data
     */
    saveInventory(data) {
        Storage.saveData(Storage.KEYS.INVENTORY, data);
    },

    /**
     * Add new inventory item
     */
    addItem(item) {
        const inventory = this.loadInventory();
        const newItem = {
            id: UI.generateId(),
            assetId: this.generateAssetId(),
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString(),
            ...item
        };
        inventory.push(newItem);
        this.saveInventory(inventory);
        Storage.logActivity('ADD', `Added asset: ${newItem.assetName}`);
        return newItem;
    },

    /**
     * Update inventory item
     */
    updateItem(id, updates) {
        const inventory = this.loadInventory();
        const index = inventory.findIndex(item => item.id === id);
        if (index !== -1) {
            inventory[index] = {
                ...inventory[index],
                ...updates,
                updatedDate: new Date().toISOString()
            };
            this.saveInventory(inventory);
            Storage.logActivity('UPDATE', `Updated asset: ${inventory[index].assetName}`);
            return inventory[index];
        }
        return null;
    },

    /**
     * Delete inventory item
     */
    deleteItem(id) {
        const inventory = this.loadInventory();
        const item = inventory.find(item => item.id === id);
        if (item) {
            const filtered = inventory.filter(item => item.id !== id);
            this.saveInventory(filtered);
            Storage.logActivity('DELETE', `Deleted asset: ${item.assetName}`);
            return true;
        }
        return false;
    },

    /**
     * Get item by ID
     */
    getItemById(id) {
        const inventory = this.loadInventory();
        return inventory.find(item => item.id === id);
    },

    /**
     * Generate asset ID
     */
    generateAssetId() {
        const inventory = this.loadInventory();
        const prefix = 'AST';
        const num = inventory.length + 1;
        return `${prefix}-${String(num).padStart(5, '0')}`;
    },

    /**
     * Filter inventory items
     */
    filterItems(items, filters) {
        return items.filter(item => {
            // Department filter
            if (filters.department && filters.department !== '' && item.department !== filters.department) {
                return false;
            }
            // Status filter
            if (filters.status && filters.status !== '' && item.status !== filters.status) {
                return false;
            }
            // Category filter
            if (filters.category && filters.category !== '' && item.category !== filters.category) {
                return false;
            }
            // Brand filter
            if (filters.brand && filters.brand !== '' && item.brand !== filters.brand) {
                return false;
            }
            // Location filter
            if (filters.location && filters.location !== '' && item.location !== filters.location) {
                return false;
            }
            // Search filter
            if (filters.search && filters.search !== '') {
                const searchLower = filters.search.toLowerCase();
                const searchableFields = [
                    item.assetId,
                    item.assetName,
                    item.department,
                    item.assignedUser,
                    item.ipAddress,
                    item.macAddress,
                    item.serialNumber,
                    item.brand,
                    item.model,
                    item.status
                ].join(' ').toLowerCase();
                
                if (!searchableFields.includes(searchLower)) {
                    return false;
                }
            }
            return true;
        });
    },

    /**
     * Sort inventory items
     */
    sortItems(items, sort) {
        return [...items].sort((a, b) => {
            let aVal = a[sort.field];
            let bVal = b[sort.field];
            
            // Handle null/undefined values
            if (aVal === undefined || aVal === null) aVal = '';
            if (bVal === undefined || bVal === null) bVal = '';
            
            // String comparison
            if (typeof aVal === 'string' && typeof bVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }
            
            if (sort.direction === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
    },

    /**
     * Paginate items
     */
    paginateItems(items, page, itemsPerPage) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return {
            items: items.slice(start, end),
            totalPages: Math.ceil(items.length / itemsPerPage),
            totalItems: items.length
        };
    },

    /**
     * Get filtered, sorted, and paginated items
     */
    getProcessedItems(filters = {}, sort = null, page = 1) {
        const inventory = this.loadInventory();
        const filtered = this.filterItems(inventory, filters);
        const sorted = this.sortItems(filtered, sort || this.currentSort);
        const paginated = this.paginateItems(sorted, page, this.itemsPerPage);
        
        return paginated;
    },

    /**
     * Duplicate item
     */
    duplicateItem(id) {
        const item = this.getItemById(id);
        if (item) {
            const duplicate = {
                ...item,
                id: UI.generateId(),
                assetId: this.generateAssetId(),
                assetName: `${item.assetName} (Copy)`,
                createdDate: new Date().toISOString(),
                updatedDate: new Date().toISOString()
            };
            const inventory = this.loadInventory();
            inventory.push(duplicate);
            this.saveInventory(inventory);
            Storage.logActivity('DUPLICATE', `Duplicated asset: ${item.assetName}`);
            return duplicate;
        }
        return null;
    },

    /**
     * Get statistics
     */
    getStatistics() {
        const inventory = this.loadInventory();
        
        return {
            totalAssets: inventory.length,
            totalComputers: inventory.filter(i => i.category === 'Computer').length,
            totalLaptops: inventory.filter(i => i.category === 'Laptop').length,
            totalPrinters: inventory.filter(i => i.category === 'Printer').length,
            totalServers: inventory.filter(i => i.category === 'Server').length,
            totalNetworkDevices: inventory.filter(i => 
                ['Switch', 'Router', 'Firewall', 'Access Point'].includes(i.category)
            ).length,
            totalCCTV: inventory.filter(i => i.category === 'CCTV').length,
            availableAssets: inventory.filter(i => i.status === 'Available').length,
            assignedAssets: inventory.filter(i => i.status === 'Assigned').length,
            warrantyExpiringSoon: this.getWarrantyExpiringSoon(inventory).length
        };
    },

    /**
     * Get items with warranty expiring soon (within 30 days)
     */
    getWarrantyExpiringSoon(inventory) {
        const now = new Date();
        const thirtyDaysLater = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        
        return inventory.filter(item => {
            if (!item.warrantyExpiry) return false;
            const warrantyDate = new Date(item.warrantyExpiry);
            return warrantyDate <= thirtyDaysLater && warrantyDate > now;
        });
    },

    /**
     * Get items with expired warranty
     */
    getExpiredWarranty(inventory) {
        const now = new Date();
        return inventory.filter(item => {
            if (!item.warrantyExpiry) return false;
            const warrantyDate = new Date(item.warrantyExpiry);
            return warrantyDate < now;
        });
    },

    /**
     * Get department-wise report
     */
    getDepartmentReport() {
        const inventory = this.loadInventory();
        const departments = {};
        
        inventory.forEach(item => {
            const dept = item.department || 'Unassigned';
            if (!departments[dept]) {
                departments[dept] = {
                    total: 0,
                    available: 0,
                    assigned: 0,
                    maintenance: 0
                };
            }
            departments[dept].total++;
            departments[item.status || 'Available']++;
        });
        
        return departments;
    },

    /**
     * Initialize event listeners
     */
    initEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', UI.debounce((e) => {
                this.currentFilter.search = e.target.value;
                this.currentPage = 1;
                this.renderTable();
            }, 300));
        }

        // Filter dropdowns
        document.querySelectorAll('.filter-select').forEach(select => {
            select.addEventListener('change', (e) => {
                const filterType = e.target.dataset.filter;
                this.currentFilter[filterType] = e.target.value;
                this.currentPage = 1;
                this.renderTable();
            });
        });

        // Sort headers
        document.querySelectorAll('.sortable').forEach(header => {
            header.addEventListener('click', () => {
                const field = header.dataset.sort;
                if (this.currentSort.field === field) {
                    this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    this.currentSort.field = field;
                    this.currentSort.direction = 'asc';
                }
                this.renderTable();
            });
        });
    },

    /**
     * Render table
     */
    renderTable() {
        const tableBody = document.querySelector('#inventoryTable tbody');
        if (!tableBody) return;

        const { items, totalPages, totalItems } = this.getProcessedItems(
            this.currentFilter,
            this.currentSort,
            this.currentPage
        );

        if (items.length === 0) {
            UI.showEmptyState(tableBody.parentElement.parentElement, 'No inventory items found');
            return;
        }

        tableBody.innerHTML = items.map((item, index) => `
            <tr>
                <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>
                <td>${item.assetId}</td>
                <td>${item.assetName}</td>
                <td>${item.category || '-'}</td>
                <td>${item.brand || '-'}</td>
                <td>${item.model || '-'}</td>
                <td>${item.department || '-'}</td>
                <td>${item.assignedUser || '-'}</td>
                <td><span class="badge badge-${this.getStatusBadgeClass(item.status)}">${item.status || 'Available'}</span></td>
                <td>
                    <button class="action-btn view" onclick="Inventory.viewItem('${item.id}')" title="View">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="Inventory.editItem('${item.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn duplicate" onclick="Inventory.duplicateItem('${item.id}')" title="Duplicate">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="action-btn delete" onclick="Inventory.deleteItem('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        this.renderPagination(totalPages, totalItems);
    },

    /**
     * Render pagination
     */
    renderPagination(totalPages, totalItems) {
        const pagination = document.querySelector('.pagination');
        if (!pagination) return;

        let html = `
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="Inventory.goToPage(${this.currentPage - 1})">Previous</a>
            </li>
        `;

        for (let i = 1; i <= totalPages; i++) {
            html += `
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="Inventory.goToPage(${i})">${i}</a>
                </li>
            `;
        }

        html += `
            <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="Inventory.goToPage(${this.currentPage + 1})">Next</a>
            </li>
        `;

        pagination.innerHTML = html;
    },

    /**
     * Go to specific page
     */
    goToPage(page) {
        if (page < 1) return;
        this.currentPage = page;
        this.renderTable();
    },

    /**
     * Get status badge class
     */
    getStatusBadgeClass(status) {
        const classes = {
            'Available': 'success',
            'Assigned': 'primary',
            'Maintenance': 'warning',
            'Retired': 'danger'
        };
        return classes[status] || 'info';
    },

    /**
     * View item details
     */
    viewItem(id) {
        const item = this.getItemById(id);
        if (item) {
            // Populate and show modal
            this.populateDetailModal(item);
            UI.openModal('detailModal');
        }
    },

    /**
     * Edit item
     */
    editItem(id) {
        const item = this.getItemById(id);
        if (item) {
            // Populate and show edit modal
            this.populateForm(item);
            UI.openModal('editModal');
        }
    },

    /**
     * Populate detail modal
     */
    populateDetailModal(item) {
        const modalBody = document.querySelector('#detailModal .modal-body');
        if (!modalBody) return;

        const fields = [
            { label: 'Asset ID', value: item.assetId },
            { label: 'Asset Name', value: item.assetName },
            { label: 'Category', value: item.category },
            { label: 'Device Type', value: item.deviceType },
            { label: 'Brand', value: item.brand },
            { label: 'Model', value: item.model },
            { label: 'Serial Number', value: item.serialNumber },
            { label: 'Asset Tag', value: item.assetTag },
            { label: 'Department', value: item.department },
            { label: 'Location', value: item.location },
            { label: 'Assigned User', value: item.assignedUser },
            { label: 'Employee ID', value: item.employeeId },
            { label: 'Operating System', value: item.operatingSystem },
            { label: 'Processor', value: item.processor },
            { label: 'RAM', value: item.ram },
            { label: 'Storage', value: item.storage },
            { label: 'MAC Address', value: item.macAddress },
            { label: 'IP Address', value: item.ipAddress },
            { label: 'Gateway', value: item.gateway },
            { label: 'DNS', value: item.dns },
            { label: 'Purchase Date', value: UI.formatDate(item.purchaseDate) },
            { label: 'Warranty Expiry', value: UI.formatDate(item.warrantyExpiry) },
            { label: 'Vendor', value: item.vendor },
            { label: 'Invoice Number', value: item.invoiceNumber },
            { label: 'Status', value: item.status },
            { label: 'Remarks', value: item.remarks },
            { label: 'Created Date', value: UI.formatDate(item.createdDate) },
            { label: 'Updated Date', value: UI.formatDate(item.updatedDate) }
        ];

        modalBody.innerHTML = `
            <div class="row">
                ${fields.map(field => `
                    <div class="col-md-6 mb-3">
                        <label class="form-label text-muted">${field.label}</label>
                        <div class="form-control-plaintext">${field.value || '-'}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    /**
     * Populate form with item data
     */
    populateForm(item) {
        Object.keys(item).forEach(key => {
            const input = document.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = item[key] || '';
            }
        });
    }
};
