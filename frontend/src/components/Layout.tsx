import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon, ShieldCheckIcon, DocumentTextIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '../stores/authStore';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const navigation: NavigationItem[] = [
  { name: 'dashboard.title', href: '/dashboard' },
  // Remove documentation from user navigation
  // Add more navigation items here
];

const Layout = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link to="/dashboard" className="text-xl font-bold text-indigo-600">
                  Kinderkleiderbörse
                </Link>
              </div>
              <nav className="ml-6 flex space-x-8">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Profil
                </Link>
              </nav>
            </div>
            <div className="flex items-center">
              <LanguageSwitcher />
              <button
                onClick={handleLogout}
                className="ml-4 inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 