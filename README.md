# Inventory Management System

A modern, professional, fully responsive Inventory Management System built entirely with frontend technologies. This application runs completely in the browser using LocalStorage for data persistence, making it perfect for small to medium-sized organizations looking for a simple yet powerful inventory tracking solution.

![Inventory Management System](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Frontend](https://img.shields.io/badge/frontend-HTML5--CSS3--JavaScript-orange.svg)

## 🌟 Features

### Authentication
- Secure login system with admin credentials
- Remember Me functionality
- Session persistence using LocalStorage
- Password visibility toggle
- Automatic logout on session expiration
- Protected routes (redirects to login if not authenticated)

### Dashboard
- Real-time statistics cards showing:
  - Total Assets
  - Total Computers, Laptops, Printers, Servers
  - Total Network Devices and CCTV
  - Available and Assigned Assets
  - Warranty Expiring Soon
- Interactive charts using Chart.js:
  - Assets by Category (Doughnut Chart)
  - Assets by Status (Bar Chart)
  - Assets by Department (Polar Area Chart)
- Recent activity feed
- Recently added assets list

### Inventory Management
- Full CRUD operations (Create, Read, Update, Delete)
- Duplicate records functionality
- Advanced search across multiple fields
- Multi-column sorting
- Comprehensive filtering options
- Pagination for large datasets
- Responsive tables with sticky headers
- Action buttons for View, Edit, Duplicate, Delete
- Asset detail modal with complete information

### Category-Specific Modules
- Desktop & Laptop
- Printer
- Server
- NAS (Network Attached Storage)
- Firewall
- Switch
- Switch Ports
- Router
- Access Point
- CCTV
- IP List
- NAT Rules
- Domain Users
- Work Information

### Excel Integration
- Import data from Excel files using SheetJS
- Export filtered data to Excel
- Export all data to Excel
- Download sample Excel template
- JSON import/export support

### Reports
- Total Assets Report
- Department Wise Report
- Assigned Assets Report
- Available Assets Report
- Warranty Expiring Report (30 days)
- Expired Warranty Report
- Inactive/Retired Devices Report
- Export reports to Excel
- Print-friendly layout

### Settings
- Change admin password
- Backup LocalStorage as JSON
- Restore from JSON backup
- Reset application (clear all data)
- Dark Mode / Light Mode toggle
- Accent color customization
- Storage information display

### UI/UX Features
- Modern Bootstrap 5 design
- Responsive layout (Desktop, Tablet, Mobile)
- Collapsible sidebar on mobile
- Toast notifications
- Confirmation dialogs
- Loading spinners
- Empty state illustrations
- Smooth animations and transitions
- Professional color scheme
- Hover effects on cards and buttons

## 📁 Folder Structure

```
inventory-system/
├── index.html                 # Entry point (redirects to login)
├── login.html                 # Login page
├── dashboard.html             # Main dashboard
├── inventory.html             # General inventory management
├── desktop.html               # Desktop & Laptop module
├── printer.html               # Printer module
├── server.html                # Server module
├── nas.html                   # NAS module
├── firewall.html              # Firewall module
├── switch.html                # Switch module
├── switchports.html           # Switch Ports module
├── router.html                # Router module
├── accesspoint.html           # Access Point module
├── cctv.html                  # CCTV module
├── iplist.html                # IP List module
├── nat.html                   # NAT Rules module
├── domainusers.html           # Domain Users module
├── workinfo.html              # Work Information module
├── reports.html               # Reports page
├── settings.html              # Settings page
├── assets/
│   └── img/                   # Image assets
├── css/
│   ├── style.css              # Main stylesheet
│   └── responsive.css         # Responsive styles
├── js/
│   ├── storage.js             # LocalStorage operations
│   ├── auth.js                # Authentication system
│   ├── inventory.js           # CRUD operations
│   ├── excel.js               # Excel import/export
│   ├── charts.js              # Chart.js integration
│   └── ui.js                  # UI components
└── README.md                  # This file
```

## 🛠 Technologies Used

- **HTML5** - Markup structure
- **CSS3** - Styling and animations
- **Bootstrap 5** - UI framework
- **Vanilla JavaScript (ES6)** - Application logic
- **LocalStorage** - Data persistence
- **SheetJS (xlsx)** - Excel import/export
- **Chart.js** - Dashboard charts
- **Font Awesome** - Icons

## 📦 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or backend required
- No Node.js or database installation needed

### Steps

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd inventory-system
   ```

2. **Open the application**
   - Simply open `login.html` in your web browser
   - Or use a local server (optional):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```
   - Navigate to `http://localhost:8000`

3. **Login with default credentials**
   - Username: `admin`
   - Password: `admin123`

## 🔐 How Login Works

The authentication system uses LocalStorage to manage user sessions:

1. **Default Credentials**: The system initializes with a default admin user (username: `admin`, password: `admin123`)

2. **Session Storage**: When you log in:
   - Credentials are validated against stored users
   - A session object is created with user info and login timestamp
   - Session is stored in LocalStorage

3. **Remember Me**: 
   - If checked, session persists indefinitely
   - If unchecked, session expires after 24 hours

4. **Route Protection**: 
   - All pages except `login.html` check for valid session
   - Invalid sessions redirect to login page
   - Page refresh maintains login state

5. **Logout**: 
   - Clears session from LocalStorage
   - Redirects to login page

## 💾 How LocalStorage Works

The application uses browser LocalStorage for all data persistence:

### Storage Keys
- `inventory_data` - All inventory items
- `inventory_users` - User accounts
- `inventory_settings` - Application settings
- `inventory_activity` - Activity log
- `inventory_session` - Current user session

### Data Structure
```javascript
// Inventory Item Example
{
  id: "unique-id",
  assetId: "AST-00001",
  assetName: "Dell Latitude 5420",
  category: "Laptop",
  brand: "Dell",
  model: "Latitude 5420",
  serialNumber: "DELL123456",
  department: "IT",
  assignedUser: "John Doe",
  status: "Available",
  ipAddress: "192.168.1.100",
  macAddress: "00:1A:2B:3C:4D:5E",
  purchaseDate: "2024-01-15",
  warrantyExpiry: "2026-01-15",
  createdDate: "2024-01-15T10:00:00.000Z",
  updatedDate: "2024-01-15T10:00:00.000Z"
}
```

### Storage Functions
- `saveData(key, data)` - Save data to LocalStorage
- `loadData(key, defaultValue)` - Load data from LocalStorage
- `updateData(key, id, updates)` - Update specific record
- `deleteData(key, id)` - Delete specific record
- `backupData()` - Export all data as JSON
- `restoreData(jsonString)` - Import data from JSON

### Storage Limits
- LocalStorage typically supports 5-10MB per domain
- Suitable for thousands of inventory records
- Storage info displayed in Settings page

## 📊 How Excel Import Works

### Import Process
1. Click "Import Excel" button
2. Select Excel file (.xlsx or .xls)
3. System reads file using SheetJS
4. Data is mapped to inventory fields
5. Records are added to LocalStorage
6. Success notification displayed

### Supported Fields
The import system automatically maps these fields:
- Asset ID, Asset Name, Category, Device Type
- Brand, Model, Serial Number, Asset Tag
- Department, Location, Assigned User, Employee ID
- Operating System, Processor, RAM, Storage
- MAC Address, IP Address, Gateway, DNS
- Purchase Date, Warranty Expiry, Vendor
- Invoice Number, Status, Remarks

### Sample Template
Download the sample template from the Inventory page to see the expected format.

## 📤 How Excel Export Works

### Export Options
1. **Export Filtered** - Exports currently filtered data
2. **Export All** - Exports entire inventory
3. **Report Export** - Exports specific report data

### Export Process
1. Click desired export button
2. System gathers relevant data
3. Data is converted to Excel format using SheetJS
4. File is automatically downloaded with timestamp
5. Filename format: `report_type_YYYY-MM-DD.xlsx`

### Export Format
- Excel file with proper headers
- All inventory fields included
- Formatted dates and values
- Compatible with Excel, Google Sheets, etc.

## 🎨 Customization Guide

### Changing Default Credentials
Edit `js/auth.js`:
```javascript
ADMIN_CREDENTIALS: {
    username: 'your-username',
    password: 'your-password'
}
```

### Adding Custom Fields
1. Add field to HTML form in `inventory.html`
2. Add field to `inventory.js` processing
3. Update table columns if needed

### Modifying Color Scheme
Edit `css/style.css` variables:
```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3f37c9;
    --success-color: #4cc9f0;
    /* ... more colors */
}
```

### Adding New Categories
1. Add option to category select in forms
2. Update sidebar menu if needed
3. Create category-specific page (optional)

### Customizing Dashboard Charts
Edit `js/charts.js` to modify:
- Chart types
- Color schemes
- Data groupings
- Chart options

## 🚀 Future Improvements

- [ ] Multi-user support with role-based access
- [ ] Barcode/QR code scanning
- [ ] Asset checkout/check-in workflow
- [ ] Email notifications for warranty expiry
- [ ] Advanced reporting with filters
- [ ] Data visualization improvements
- [ ] Bulk import/export improvements
- [ ] Asset lifecycle tracking
- [ ] Maintenance scheduling
- [ ] Vendor management
- [ ] Purchase order integration
- [ ] Cloud storage backup option
- [ ] Mobile app version
- [ ] API for external integrations

## 🌐 Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

**Note**: LocalStorage support required. IE 11 and older browsers are not supported.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Inventory Management System**

Built with ❤️ using modern web technologies.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on the repository
- Check the documentation
- Review the code comments

## 🙏 Acknowledgments

- Bootstrap 5 Team for the excellent UI framework
- Chart.js for beautiful data visualization
- SheetJS for Excel file handling
- Font Awesome for amazing icons

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Production Ready
