# Third Pole Restaurant - POS System

A modern, feature-rich Point of Sale (POS) system built with React and Vite for restaurant management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.2.0-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646cff.svg)

## 🚀 Features

### Core POS Functionality
- **Order Management**: Add items to cart, adjust quantities, and process orders
- **Real-time Calculations**: Automatic subtotal, tax, and total calculations
- **Bill Receipt**: Professional receipt generation with print and PDF download options
- **Order History**: Track all completed orders with detailed information

### Menu Management
- **Dynamic Menu**: Add, edit, and delete menu items
- **Categories**: Organize items by categories (Appetizers, Main Course, Desserts, etc.)
- **Stock Management**: Mark items as in/out of stock
- **Image Support**: Add images to menu items

### Table Management
- **Visual Table Layout**: Grid view of restaurant tables
- **Status Tracking**: Real-time table status (Free/Occupied)
- **Order Assignment**: Link orders to specific tables
- **Table Operations**: Add, delete, and manage tables

### Analytics Dashboard
- **Sales Summary**: Today's revenue, order count, and average order value
- **Revenue Chart**: 7-day revenue trend visualization
- **Top Items**: Pie chart showing best-selling menu items
- **Real-time Updates**: Dashboard updates with each completed order

### Security & Settings
- **PIN Authentication**: Secure login with customizable PIN
- **Restaurant Settings**: Configure name, address, and tax rates
- **Data Backup**: Export/Import all data as JSON
- **PIN Management**: Change PIN from settings

### Modern UI/UX
- **Dark Theme**: Premium glassmorphism design
- **Responsive**: Works on desktop, tablet, and mobile
- **Icons**: Modern Lucide React icons throughout
- **Smooth Animations**: Polished transitions and hover effects

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/sapchuhang/thirdpole-billingsystem.git
   cd thirdpole-billingsystem
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## 🎯 Usage

### Default Login
- **PIN**: `1234`
- You can change this in Settings after logging in

### Navigation
- **POS**: Main point of sale interface
- **Menu**: Manage menu items and categories
- **Orders**: View order history
- **Dashboard**: Analytics and insights
- **Tables**: Manage restaurant tables
- **Settings**: Configure system settings

### Creating an Order
1. Select items from the menu grid
2. Items appear in the cart on the right
3. Adjust quantities as needed
4. Click "Checkout" to view the bill
5. Print, download PDF, or complete the order

## 🛠️ Tech Stack

- **Frontend**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas
- **Styling**: CSS with CSS Variables
- **Storage**: localStorage

## 📁 Project Structure

```
thirdpole-billingsystem/
├── src/
│   ├── components/
│   │   ├── BillModal.jsx      # Receipt modal with print/PDF
│   │   ├── Cart.jsx            # Shopping cart component
│   │   ├── Dashboard.jsx       # Analytics dashboard
│   │   ├── Layout.jsx          # Main layout with sidebar
│   │   ├── Login.jsx           # PIN authentication
│   │   ├── MenuEditor.jsx      # Menu management
│   │   ├── MenuGrid.jsx        # Menu item display
│   │   ├── Orders.jsx          # Order history
│   │   ├── Settings.jsx        # System settings
│   │   └── TableManager.jsx    # Table management
│   ├── data/
│   │   ├── menu.js             # Menu data management
│   │   └── tables.js           # Table data management
│   ├── App.jsx                 # Main app component
│   ├── index.css               # Global styles
│   └── main.jsx                # App entry point
├── public/
├── package.json
└── vite.config.js
```

## 🎨 Customization

### Changing Colors
Edit CSS variables in `src/index.css`:
```css
:root {
  --color-primary: #6366f1;
  --color-success: #10b981;
  --color-danger: #ef4444;
  /* ... more variables */
}
```

### Default Settings
Modify in `src/components/Settings.jsx`:
```javascript
const [settings, setSettings] = useState({
  restaurantName: 'Your Restaurant Name',
  address: 'Your Address',
  taxRate: 13,
  serviceCharge: 10,
});
```

## 📱 Mobile Support

The application is fully responsive and works on:
- Desktop (1920px+)
- Tablet (768px - 1920px)
- Mobile (< 768px)

## 🔒 Data Storage

All data is stored locally in the browser's `localStorage`:
- Menu items and categories
- Order history
- Table information
- Restaurant settings
- Authentication PIN

**Note**: Clearing browser data will erase all stored information. Use the Export feature to backup your data.

## 🖨️ Printing

The system supports:
- **Browser Print**: Standard print dialog (Ctrl/Cmd + P)
- **PDF Download**: Save receipts as PDF files
- **Thermal Printer**: Optimized for 80mm thermal printers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Sapchuhang**
- GitHub: [@sapchuhang](https://github.com/sapchuhang)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

**Made with ❤️ for Third Pole Restaurant**
