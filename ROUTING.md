# Farmart Frontend Routing Documentation

## Overview

This document outlines the complete routing structure for the Farmart frontend application.

## Route Categories

### 1. Public Routes (Accessible to everyone)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | [`Home`](src/pages/Home.jsx) | Landing page with hero, features, about |
| `/auth` | [`SignUp`](src/pages/SignUp.jsx) | Login/Registration page |
| `/login` | [`SignUp`](src/pages/SignUp.jsx) | Login page (redirect to /auth) |
| **`/browse`** | **[`BrowseLivestock`](src/pages/BrowseLivestock.jsx)** | **Buyer marketplace - displays livestock cards with images** |
| `/livestock/:id` | [`LivestockDetail`](src/pages/LivestockDetail.jsx) | Single livestock details page |
| `/cart` | [`Cart`](src/pages/Cart.jsx) | Shopping cart |
| `/checkout` | [`Checkout`](src/pages/Checkout.jsx) | Checkout page |
| `/checkout/:orderId` | [`Checkout`](src/pages/Checkout.jsx) | Checkout for specific order |
| `/orders` | [`Orders`](src/pages/Orders.jsx) | Orders list (all users) |
| `/wishlist` | [`Wishlist`](src/pages/Wishlist.jsx) | Wishlist page (all users) |
| `/unauthorized` | [`Unauthorized`](src/pages/Unauthorized.jsx) | Access denied page |
| `/negotiations` | [`NegotiationList`](src/pages/NegotiationList.jsx) | List of negotiations |
| `/negotiations/:id` | [`NegotiationRoom`](src/pages/NegotiationRoom.jsx) | Individual negotiation room |
| `/dispute/:orderId` | [`RaiseDispute`](src/pages/RaiseDispute.jsx) | Raise dispute for order |
| `/dispute/new` | [`RaiseDispute`](src/pages/RaiseDispute.jsx) | New dispute form |

### 2. Buyer Routes (Protected - Buyer role only)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/dashboard` | [`BuyerDashboard`](src/pages/BuyerDashboard.jsx) | Buyer dashboard layout |
| `/dashboard` (index) | [`BuyerOverview`](src/pages/BuyerOverview.jsx) | Buyer overview stats |
| `/dashboard/orders` | [`Orders`](src/pages/Orders.jsx) | Buyer's orders |
| `/dashboard/wishlist` | [`BuyerWishlist`](src/pages/BuyerWishlist.jsx) | Buyer's wishlist |
| `/dashboard/settings` | [`BuyerSettings`](src/pages/BuyerSettings.jsx) | Buyer settings |
| `/dashboard/negotiations` | [`NegotiationList`](src/pages/NegotiationList.jsx) | Buyer's negotiations |
| `/dashboard/negotiations/:id` | [`NegotiationRoom`](src/pages/NegotiationRoom.jsx) | Buyer's negotiation room |

### 3. Farmer Routes (Protected - Farmer role only)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/farmer-dashboard` | [`FarmerDashboard`](src/pages/FarmerDashboard.jsx) | Farmer dashboard layout |
| `/farmer-dashboard` (index) | [`FarmerOverview`](src/pages/FarmerOverview.jsx) | Farmer overview stats |
| `/farmer-dashboard/inventory` | [`FarmerInventory`](src/pages/FarmerInventory.jsx) | Farmer's livestock inventory |
| `/farmer-dashboard/orders` | [`FarmerOrders`](src/pages/FarmerOrders.jsx) | Farmer's orders |
| `/farmer-dashboard/analytics` | [`FarmerAnalytics`](src/pages/FarmerAnalytics.jsx) | Farmer analytics |
| `/farmer-dashboard/disputes` | [`FarmerDisputes`](src/pages/FarmerDisputes.jsx) | Farmer's disputes |
| `/farmer-dashboard/disputes/new` | [`FarmerRaiseDispute`](src/pages/FarmerRaiseDispute.jsx) | Raise new dispute |
| **`/farmer-dashboard/add`** | **[`AddLivestock`](src/pages/AddLivestock.jsx)** | **Add new livestock (upload form)** |

### 4. Admin Routes (Protected - Admin role only)

| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin` | [`AdminLayout`](src/pages/AdminLayout.jsx) | Admin dashboard layout |
| `/admin/dashboard` | [`AdminDashboard`](src/pages/AdminDashboard.jsx) | Admin dashboard |
| `/admin/users` | [`AdminUserManagement`](src/pages/AdminUserManagement.jsx) | User management |
| `/admin/farmers` | [`AdminUserManagement`](src/pages/AdminUserManagement.jsx) | Farmer management |
| `/admin/buyers` | [`AdminUserManagement`](src/pages/AdminUserManagement.jsx) | Buyer management |
| `/admin/orders` | [`AdminOrders`](src/pages/admin/AdminOrders.jsx) | Admin orders |
| `/admin/disputes` | [`AdminDisputes`](src/pages/AdminDisputes.jsx) | Admin disputes |
| `/admin/finance` | [`AdminDashboard`](src/pages/AdminDashboard.jsx) | Admin finance |
| `/admin/settings` | [`AdminDashboard`](src/pages/AdminDashboard.jsx) | Admin settings |

### 5. Special Routes

| Route | Component | Purpose |
|-------|-----------|---------|
| `/farmer/report-buyer/:orderId` | [`FarmerRaiseDispute`](src/pages/FarmerRaiseDispute.jsx) | Report buyer for order |
| `*` | 404 | 404 Not Found page |

## Navigation Links

### Navbar Links (src/components/Navbar.jsx)

| Link Name | Path | Access | Purpose |
|-----------|------|--------|---------|
| Browse Livestock | `/browse` | Public | Buyer marketplace |
| Marketplace | `/marketplace` | Public | Placeholder (not implemented) |
| Sell | `/sell` → `/auth` | Public | Farmer upload (redirects to login if not authenticated) |
| About Us | `/about` | Public | About page (link exists) |

### Dashboard Sidebar Links

#### Buyer Dashboard
- Overview → `/dashboard`
- Orders → `/dashboard/orders`
- Wishlist → `/dashboard/wishlist`
- Negotiations → `/dashboard/negotiations`
- Settings → `/dashboard/settings`

#### Farmer Dashboard
- Overview → `/farmer-dashboard`
- Inventory → `/farmer-dashboard/inventory`
- Add Livestock → `/farmer-dashboard/add`
- Orders → `/farmer-dashboard/orders`
- Analytics → `/farmer-dashboard/analytics`
- Disputes → `/farmer-dashboard/disputes`

## Important Notes

### 1. Route Naming Convention

- **Public marketplace pages** should NOT contain "Dashboard" in the path
- **Protected dashboard pages** should have "dashboard" in the path
- **Farmer-specific routes** are under `/farmer-dashboard`
- **Buyer-specific routes** are under `/dashboard`
- **Admin-specific routes** are under `/admin`

### 2. Component Naming

- Files in `src/pages/` should match the component name exactly
- `BrowseLivestock.jsx` → exports `BrowseLivestock` component
- `AddLivestock.jsx` → exports `AddLivestock` component
- `LivestockDetail.jsx` → exports `LivestockDetail` component

### 3. Common Mistakes to Avoid

❌ **WRONG**: Putting farmer upload form on `/browse`
```jsx
// DO NOT do this
<Route path="/browse" element={<AddLivestock />} />
```

✅ **CORRECT**: Buyer browsing on `/browse`, farmer upload on `/farmer-dashboard/add`
```jsx
<Route path="/browse" element={<BrowseLivestock />} />
<Route path="/farmer-dashboard/add" element={<AddLivestock />} />
```

### 4. Protected Routes

All routes requiring authentication use:
- `ProtectedRoute` - checks if user is logged in and has correct role
- `ProtectedAdminRoute` - checks if user is admin

### 5. Layouts

- **MainLayout** - Public pages with Navbar and Footer
- **DashboardLayout** - Buyer dashboard with sidebar
- **AdminLayout** - Admin dashboard with sidebar

## Troubleshooting

### Issue: "Browse Livestock" shows farmer upload form

**Cause**: `BrowseLivestock.jsx` file contains `AddLivestock` component instead of `BrowseLivestock` component.

**Solution**: Ensure `BrowseLivestock.jsx` exports `BrowseLivestock` component that:
1. Fetches livestock from API
2. Displays cards with images
3. Has search/filter functionality
4. Links to `/livestock/:id`

### Issue: Farmer can access `/browse` and see upload form

**Cause**: Misconfigured route pointing to wrong component.

**Solution**: 
- `/browse` → `BrowseLivestock` (buyer marketplace)
- `/farmer-dashboard/add` → `AddLivestock` (farmer upload)

## API Endpoints Used

| Page | API Endpoint | Method |
|------|--------------|--------|
| BrowseLivestock | `/livestock` | GET |
| LivestockDetail | `/livestock/:id` | GET |
| AddLivestock | `/livestock/create` | POST |
| Cart | `/cart/*` | Various |
| Orders | `/orders` | GET |
