import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, Users, LogOut, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-dark border-b-4 border-primary-400 sticky top-0 z-50 shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary-400 rounded-2xl flex items-center justify-center shadow-soft">
                <Shield className="w-6 h-6 text-dark" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">CRM Journalistique</h1>
                <p className="text-xs text-neutral-400">Gestion de contacts</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-white hover:bg-neutral-800 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">Contacts</span>
              </button>

              <div className="h-8 w-px bg-neutral-700"></div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user?.email}</p>
                  <p className="text-xs text-neutral-400">Connecté</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white transition-all hover:scale-105 shadow-soft"
                  title="Déconnexion"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-white hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 bg-neutral-900">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => {
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-3 rounded-xl text-white hover:bg-neutral-800 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-semibold">Contacts</span>
              </button>

              <div className="h-px bg-neutral-800"></div>

              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-white">{user?.email}</p>
                <p className="text-xs text-neutral-400">Connecté</p>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full px-4 py-3 rounded-xl bg-secondary-500 hover:bg-secondary-600 text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-semibold">Déconnexion</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};