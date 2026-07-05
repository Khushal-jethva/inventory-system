/**
 * Excel Module
 * Handles Excel import/export using SheetJS
 */

const Excel = {
    /**
     * Export data to Excel
     */
    exportToExcel(data, filename = 'inventory_export') {
        if (!data || data.length === 0) {
            UI.showToast('No data to export', 'warning');
            return;
        }

        // Convert data to worksheet format
        const worksheet = this.jsonToWorksheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const fullFilename = `${filename}_${timestamp}.xlsx`;

        // Download file
        XLSX.writeFile(workbook, fullFilename);
        UI.showToast('Excel file exported successfully', 'success');
        Storage.logActivity('EXPORT', `Exported ${data.length} items to Excel`);
    },

    /**
     * Export filtered data
     */
    exportFilteredData(filters = {}) {
        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        const filtered = Inventory.filterItems(inventory, filters);
        this.exportToExcel(filtered, 'filtered_inventory');
    },

    /**
     * Export all data
     */
    exportAllData() {
        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        this.exportToExcel(inventory, 'all_inventory');
    },

    /**
     * Import data from Excel
     */
    importFromExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(firstSheet);
                    
                    // Process imported data
                    const processedData = jsonData.map(item => this.processImportedItem(item));
                    
                    resolve(processedData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = (error) => reject(error);
            reader.readAsArrayBuffer(file);
        });
    },

    /**
     * Process imported item
     */
    processImportedItem(item) {
        return {
            id: UI.generateId(),
            assetId: item.assetId || Inventory.generateAssetId(),
            assetName: item.assetName || item['Asset Name'] || '',
            category: item.category || item.Category || '',
            deviceType: item.deviceType || item['Device Type'] || '',
            brand: item.brand || item.Brand || '',
            model: item.model || item.Model || '',
            serialNumber: item.serialNumber || item['Serial Number'] || '',
            assetTag: item.assetTag || item['Asset Tag'] || '',
            department: item.department || item.Department || '',
            location: item.location || item.Location || '',
            assignedUser: item.assignedUser || item['Assigned User'] || '',
            employeeId: item.employeeId || item['Employee ID'] || '',
            operatingSystem: item.operatingSystem || item['Operating System'] || '',
            processor: item.processor || item.Processor || '',
            ram: item.ram || item.RAM || '',
            storage: item.storage || item.Storage || '',
            macAddress: item.macAddress || item['MAC Address'] || '',
            ipAddress: item.ipAddress || item['IP Address'] || '',
            gateway: item.gateway || item.Gateway || '',
            dns: item.dns || item.DNS || '',
            purchaseDate: item.purchaseDate || item['Purchase Date'] || '',
            warrantyExpiry: item.warrantyExpiry || item['Warranty Expiry'] || '',
            vendor: item.vendor || item.Vendor || '',
            invoiceNumber: item.invoiceNumber || item['Invoice Number'] || '',
            status: item.status || item.Status || 'Available',
            remarks: item.remarks || item.Remarks || '',
            createdDate: new Date().toISOString(),
            updatedDate: new Date().toISOString()
        };
    },

    /**
     * Save imported data
     */
    saveImportedData(data) {
        const inventory = Storage.loadData(Storage.KEYS.INVENTORY, []);
        const merged = [...inventory, ...data];
        Storage.saveData(Storage.KEYS.INVENTORY, merged);
        Storage.logActivity('IMPORT', `Imported ${data.length} items from Excel`);
        return data.length;
    },

    /**
     * Download sample Excel template
     */
    downloadSampleTemplate() {
        const sampleData = [
            {
                'Asset ID': 'AST-00001',
                'Asset Name': 'Dell Latitude 5420',
                'Category': 'Laptop',
                'Device Type': 'Laptop',
                'Brand': 'Dell',
                'Model': 'Latitude 5420',
                'Serial Number': 'DELL123456',
                'Asset Tag': 'TAG001',
                'Department': 'IT',
                'Location': 'Building A',
                'Assigned User': 'John Doe',
                'Employee ID': 'EMP001',
                'Operating System': 'Windows 11',
                'Processor': 'Intel i7',
                'RAM': '16GB',
                'Storage': '512GB SSD',
                'MAC Address': '00:1A:2B:3C:4D:5E',
                'IP Address': '192.168.1.100',
                'Gateway': '192.168.1.1',
                'DNS': '8.8.8.8',
                'Purchase Date': '2024-01-15',
                'Warranty Expiry': '2026-01-15',
                'Vendor': 'Dell Inc',
                'Invoice Number': 'INV001',
                'Status': 'Available',
                'Remarks': 'Sample entry'
            }
        ];

        const worksheet = this.jsonToWorksheet(sampleData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');
        XLSX.writeFile(workbook, 'inventory_template.xlsx');
        UI.showToast('Sample template downloaded', 'success');
    },

    /**
     * Convert JSON to worksheet
     */
    jsonToWorksheet(data) {
        return XLSX.utils.json_to_sheet(data);
    },

    /**
     * Export to JSON
     */
    exportToJSON(data, filename = 'inventory_export') {
        if (!data || data.length === 0) {
            UI.showToast('No data to export', 'warning');
            return;
        }

        const timestamp = new Date().toISOString().slice(0, 10);
        const fullFilename = `${filename}_${timestamp}.json`;
        const jsonString = JSON.stringify(data, null, 2);

        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fullFilename;
        link.click();
        URL.revokeObjectURL(url);

        UI.showToast('JSON file exported successfully', 'success');
        Storage.logActivity('EXPORT', `Exported ${data.length} items to JSON`);
    },

    /**
     * Import from JSON
     */
    importFromJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    const processedData = jsonData.map(item => this.processImportedItem(item));
                    resolve(processedData);
                } catch (error) {
                    reject(error);
                }
            };
            
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
        });
    },

    /**
     * Initialize file input for import
     */
    initImport() {
        const fileInput = document.getElementById('importFile');
        if (fileInput) {
            fileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                UI.showLoading();

                try {
                    let data;
                    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                        data = await this.importFromExcel(file);
                    } else if (file.name.endsWith('.json')) {
                        data = await this.importFromJSON(file);
                    } else {
                        throw new Error('Unsupported file format');
                    }

                    const count = this.saveImportedData(data);
                    UI.hideLoading();
                    UI.showToast(`Successfully imported ${count} items`, 'success');
                    
                    // Refresh table
                    if (typeof Inventory.renderTable === 'function') {
                        Inventory.renderTable();
                    }
                    
                    // Reset file input
                    fileInput.value = '';
                } catch (error) {
                    UI.hideLoading();
                    UI.showToast('Error importing file: ' + error.message, 'error');
                }
            });
        }
    }
};
