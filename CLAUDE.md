# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **static HTML prototype** for an industrial wastewater treatment intelligent platform (隧道废水处理智能平台). It manages four types of wastewater treatment systems: domestic sewage, tunnel wastewater, mixing station wastewater, and sand stone wastewater.

**Key characteristics:**
- Pure HTML/CSS/JavaScript (no framework dependencies)
- Static mock data in `js/data.js`
- No backend or build process required
- Runs directly in browser or via simple HTTP server
- Uses CDN resources: ECharts 5.4.3, Leaflet 1.9.4, Font Awesome 6.4.0

## Development Commands

### Running the Project

```bash
# Recommended: Use a local HTTP server
python -m http.server 8000

# Or with Node.js
npx http-server -p 8000

# Or with PHP
php -S localhost:8000
```

Access at: http://localhost:8000

### No Build Process
This project does **not** require any build, compilation, or bundling. Simply open `index.html` directly in a browser or serve via HTTP server.

## Architecture

### Page Structure Pattern

Every page in `pages/` follows this structure:

1. **Shared Components** (duplicated across all pages):
   - Sidebar navigation (`<aside class="sidebar">`)
   - Top header (`<header class="header">`)
   - Mobile sidebar overlay (`<div class="sidebar-overlay">`)

2. **CSS Dependencies** (load in this order):
   ```html
   <link rel="stylesheet" href="../css/common.css">
   <link rel="stylesheet" href="../css/layout.css">
   <link rel="stylesheet" href="../css/modules.css">
   ```

3. **JS Dependencies**:
   ```html
   <script src="../js/common.js"></script>
   <script src="../js/data.js"></script>
   ```

4. **Menu Highlighting**:
   - Add `active` class to the current page's menu link
   - For submenu items, also add `expanded` class to arrow and `open` class to submenu

### CSS Organization

- **common.css**: CSS variables, colors, global styles, utility classes, buttons, forms, tables
- **layout.css**: Sidebar, header, breadcrumb, responsive layouts
- **modules.css**: Page-specific components (dashboard cards, monitoring panels, etc.)

### JavaScript Architecture

**Global App Object** (`js/common.js`):
```javascript
window.app = {
    CONFIG,
    showToast,
    showModal,
    hideModal,
    closeAllModals,
    formatDateTime,
    formatNumber,
    exportToCsv,
    // ... other utilities
};
```

**Mock Data** (`js/data.js`):
- All data stored in `window.mockData` object
- Contains: projects, devices, alarms, users, energyHistory, etc.
- Access via `mockData.devices`, `mockData.alarms`, etc.

### Data Flow Pattern

1. **Page Load**: `DOMContentLoaded` event triggers initialization
2. **Data Access**: Read from `mockData` object
3. **UI Updates**: Generate HTML from data (template literals or innerHTML)
4. **Real-time Updates**: Use `setInterval` to simulate data refresh

Example pattern:
```javascript
document.addEventListener('DOMContentLoaded', function() {
    loadDeviceList();
    setInterval(loadDeviceList, 5000); // Auto-refresh
});

function loadDeviceList() {
    const devices = mockData.devices;
    const container = document.getElementById('deviceList');
    container.innerHTML = devices.map(device => `
        <div class="device-card">${device.name}</div>
    `).join('');
}
```

### Creating New Pages

1. Copy an existing page from `pages/`
2. Update page title and breadcrumb
3. Update menu highlighting (add `active` class)
4. Replace main content area
5. Keep sidebar and header unchanged
6. Reference similar pages for implementation patterns

### Adding Interactive Features

**Charts (ECharts)**:
```javascript
const chart = echarts.init(document.getElementById('chartId'));
chart.setOption({
    xAxis: { type: 'category', data: [] },
    yAxis: { type: 'value' },
    series: [{ type: 'line', data: [] }]
});
window.addEventListener('resize', () => chart.resize());
```

**Modals**:
```javascript
app.showModal('modalId');      // Show modal
app.hideModal('modalId');       // Hide modal
app.closeAllModals();           // Close all modals
```

**Notifications**:
```javascript
app.showToast('Message', 'type');  // type: 'success', 'error', 'warning', 'info'
```

**CSV Export**:
```javascript
const data = [{列名: '值', ...}];
app.exportToCsv(data, 'filename.csv');
```

## Design System

### Color Palette (CSS Variables)
```css
--primary-color: #1890ff;    /* Blue - main actions */
--success-color: #52c41a;    /* Green - normal status */
--warning-color: #faad14;    /* Orange - warnings */
--danger-color: #f5222d;     /* Red - errors/alarms */
--bg-color: #f0f2f5;         /* Light gray - page background */
```

### Common UI Components

- **Cards**: `<div class="card"><div class="card-header">...</div><div class="card-body">...</div></div>`
- **Buttons**: `<button class="btn btn-primary">`, `btn-default`, `btn-success`, `btn-warning`, `btn-danger`
- **Tables**: `<table class="table"><thead>...</thead><tbody>...</tbody></table>`
- **Tags/Labels**: `<span class="tag tag-success">`, `tag-warning`, `tag-danger`, `tag-info`
- **Forms**: `<input class="form-input">`, `<select class="form-select">`, `<textarea class="form-textarea">`

### Responsive Breakpoints
- Desktop: 1366px+ (full layout)
- Tablet: 768px-1366px (adaptive)
- Mobile: <768px (hamburger menu, collapsible sidebar)

## Key Implementation Notes

### Map Integration (Leaflet + OpenStreetMap)
- No API key required
- Uses `L.map()`, `L.tileLayer()`, `L.marker()`, `L.popup()`
- Custom markers via `L.divIcon()`
- See `dashboard-company.html` for implementation example

### Real-time Data Simulation
- Use `setInterval()` for auto-refresh
- Generate random data for demo purposes
- Pattern: `setInterval(updateFunction, refreshInterval)`

### Page Navigation
- All pages are standalone HTML files
- No client-side routing
- Use `window.location.href` for navigation
- Pass URL parameters via `?key=value` and parse with `app.getUrlParam('key')`

### Storage
- `app.storage.get(key, default)` - Read from localStorage
- `app.storage.set(key, value)` - Write to localStorage
- Used for user preferences (e.g., sidebar collapsed state)

## Common Tasks

### Modify Mock Data
Edit `js/data.js`:
- Update `projects` array for project data
- Update `devices` array for device data
- Update `alarms` array for alarm records
- All data is plain JavaScript objects/arrays

### Add New CSS Rules
- Global styles: `css/common.css`
- Layout changes: `css/layout.css`
- Module-specific: `css/modules.css`

### Debug Chart Issues
1. Check browser console for errors
2. Verify ECharts CDN is loaded
3. Ensure container element has explicit height
4. Call `chart.resize()` on window resize

### Modify Sidebar Menu
Update the `<nav class="sidebar-menu">` section in each HTML file. For nested menus:
```html
<div class="menu-item has-submenu">
    <a href="javascript:void(0)" class="menu-link">
        <span class="menu-text">Parent Menu</span>
        <span class="menu-arrow"><i class="fas fa-chevron-down"></i></span>
    </a>
    <div class="submenu">
        <!-- Child menu items -->
    </div>
</div>
```

## External Dependencies (CDNs)

- ECharts: `https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js`
- Leaflet CSS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.css`
- Leaflet JS: `https://unpkg.com/leaflet@1.9.4/dist/leaflet.js`
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`

**Note**: Internet connection required for CDN resources. For offline use, download these libraries locally.
