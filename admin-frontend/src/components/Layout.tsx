import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../stores/authStore'
import { DocumentTextIcon, HomeIcon, UsersIcon, ShoppingBagIcon, CurrencyEuroIcon } from '@heroicons/react/24/outline'

const Layout = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-indigo-600">
                Admin Dashboard
              </h1>
              <nav className="flex space-x-4">
                <Link
                  to="/dashboard"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <HomeIcon className="h-5 w-5 mr-2" />
                  Übersicht
                </Link>
                <Link
                  to="/sellers"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <UsersIcon className="h-5 w-5 mr-2" />
                  Verkäufer
                </Link>
                <Link
                  to="/items"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <ShoppingBagIcon className="h-5 w-5 mr-2" />
                  Artikel
                </Link>
                <Link
                  to="/sales"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <CurrencyEuroIcon className="h-5 w-5 mr-2" />
                  Verkäufe
                </Link>
                <Link
                  to="/documentation"
                  className="flex items-center px-3 py-2 text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  Dokumentation
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 