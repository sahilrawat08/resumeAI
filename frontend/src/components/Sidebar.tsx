import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  Brain,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      color: 'from-[#4f9dff] to-[#3b82f6]'
    },
    {
      name: 'Analyze Resume',
      href: '/upload',
      icon: Upload,
      color: 'from-[#a78bfa] to-[#8b5cf6]'
    },
    {
      name: 'AI Insights',
      href: '/insights',
      icon: Brain,
      color: 'from-[#10b981] to-[#059669]'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      color: 'from-[#f59e0b] to-[#d97706]'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      color: 'from-[#6b7280] to-[#4b5563]'
    }
  ];

  const isActive = (href: string) => location.pathname === href;

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 }
  };

  const itemVariants = {
    expanded: { opacity: 1, x: 0 },
    collapsed: { opacity: 0, x: -20 }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-[#1a1a1a]/80 backdrop-blur-xl border border-[#262626] rounded-2xl text-white hover:bg-[#1f1f2b] transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar fixed left-0 top-0 h-full z-50 ${isCollapsed ? 'lg:w-20' : 'lg:w-80'} ${isMobileOpen ? 'w-80' : 'w-0 lg:w-auto'} overflow-hidden`}
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 mb-8"
            variants={itemVariants}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#4f9dff] to-[#a78bfa] rounded-2xl flex items-center justify-center shadow-2xl">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-[#10b981] to-[#059669] rounded-full animate-pulse"></div>
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-2xl font-bold text-gradient-primary">ResumeAI</h1>
                  <p className="text-sm text-gray-400">AI-Powered Analysis</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* User Profile */}
          <motion.div 
            className="mb-8 p-4 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-2xl"
            variants={itemVariants}
            animate={isCollapsed ? 'collapsed' : 'expanded'}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4f9dff] to-[#a78bfa] rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="font-semibold text-white">{user?.firstName}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.href}
                  className={`sidebar-item ${isActive(item.href) ? 'active' : ''}`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <AnimatePresence>
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Collapse Button */}
          <motion.button
            className="hidden lg:flex items-center justify-center w-12 h-12 bg-[#1a1a1a]/40 backdrop-blur-xl border border-[#262626]/50 rounded-xl text-gray-400 hover:text-white hover:bg-[#1f1f2b] transition-all duration-300 mx-auto mb-4"
            onClick={() => setIsCollapsed(!isCollapsed)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? <Menu size={20} /> : <X size={20} />}
          </motion.button>

          {/* Logout Button */}
          <motion.button
            className="sidebar-item w-full"
            onClick={logout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#ef4444] to-[#dc2626] rounded-xl flex items-center justify-center shadow-lg">
              <LogOut className="w-5 h-5 text-white" />
            </div>
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="font-medium"
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
