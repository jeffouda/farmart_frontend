import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, ShoppingCart, FileText, 
  BarChart3, Settings, Bell, LogOut, 
  Menu, X, ChevronRight, TrendingUp,
  DollarSign, Package, AlertCircle
} from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: 'spring', stiffness: 100 }
  },
};

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <motion.div
    variants={itemVariants}
    whileHover={{ scale: 1.02, y: -4 }}
    className="bg-white rounded-xl shadow-sm p-6 border border-slate-100"
  >
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <span className="text-green-500 text-sm font-medium flex items-center gap-1">
        <TrendingUp className="w-4 h-4" />
        {change}
      </span>
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  </motion.div>
);

const SidebarLink = ({ icon: Icon, label, active, collapsed, onClick }) => (
  <motion.button
    variants={itemVariants}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-green-50 text-green-600 shadow-sm' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <Icon className="w-5 h-5 flex-shrink-0" />
    {!collapsed && <span className="font-medium">{label}</span>}
    {active && !collapsed && <ChevronRight className="w-4 h-4 ml-auto" />}
  </motion.button>
);

const ProfileHeader = ({ user, collapsed }) => (
  <motion.div 
    variants={itemVariants}
    className="flex items-center gap-3 px-4 py-4 border-t border-slate-100"
  >
    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
      <span className="text-green-600 font-semibold text-sm">
        {user?.name?.split(' ').map(n => n[0]).join('') || 'AD'}
      </span>
    </div>
    {!collapsed && (
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Admin User'}</p>
        <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@farmart.com'}</p>
      </div>
    )}
  </motion.div>
);

const ModernAdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);

  const user = {
    name: 'Admin User',
    email: 'admin@farmart.com',
    role: 'Administrator',
  };

  const stats = [
    { icon: DollarSign, title: 'Total Revenue', value: '$48,352', change: '+12.5%', color: 'bg-green-500' },
    { icon: Users, title: 'Total Users', value: '2,845', change: '+8.2%', color: 'bg-blue-500' },
    { icon: Package, title: 'Active Orders', value: '156', change: '+5.1%', color: 'bg-purple-500' },
    { icon: AlertCircle, title: 'Pending Disputes', value: '12', change: '-3.2%', color: 'bg-orange-500' },
  ];

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', section: 'dashboard' },
    { icon: Users, label: 'User Management', section: 'users' },
    { icon: ShoppingCart, label: 'Orders', section: 'orders' },
    { icon: FileText, label: 'Disputes', section: 'disputes' },
    { icon: BarChart3, label: 'Analytics', section: 'analytics' },
    { icon: Settings, label: 'Settings', section: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:relative z-50 h-screen bg-white border-r border-slate-200 flex flex-col ${
          collapsed ? 'w-20' : 'w-72'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            {!collapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-slate-800"
              >
                Farmart
              </motion.span>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <SidebarLink
              key={item.section}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.section}
              collapsed={collapsed}
              onClick={() => {
                setActiveSection(item.section);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        <ProfileHeader user={user} collapsed={collapsed} />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex items-center justify-center p-4 border-t border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-400" />
        </button>
      </motion.aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-6 h-6 text-slate-600" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
                <p className="text-sm text-slate-500">Welcome back, {user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
                <LogOut className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { user: 'John Doe', action: 'placed an order', item: '5 Cattle', time: '2 minutes ago' },
                  { user: 'Jane Smith', action: 'raised a dispute', item: 'Order #1234', time: '15 minutes ago' },
                  { user: 'Mike Johnson', action: 'registered as farmer', item: 'New User', time: '1 hour ago' },
                  { user: 'Sarah Williams', action: 'completed payment', item: 'KES 45,000', time: '2 hours ago' },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    className="px-6 py-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 font-medium text-sm">
                          {activity.user.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-800">
                          <span className="font-medium">{activity.user}</span>
                          {' '}{activity.action}{' '}
                          <span className="font-medium text-green-600">{activity.item}</span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ModernAdminDashboard;
