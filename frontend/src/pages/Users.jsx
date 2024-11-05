import React, { useState } from 'react';
import { Bug, Menu, X } from 'lucide-react';

const Layout = ({
  children,
  project = "Project Name",
  navigation = [],
  title = "Default Title",
  author = "Default Author",
  version = "1.0.0"
}) => {
  const [userId, setUserId] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submission logic here
    console.log('Submitted ID:', userId);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Project Name and Logo */}
            <div className="flex items-center">
              <Bug className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold">{project}</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-4">
                {navigation.map((item, index) => (
                  <li key={index} className="text-gray-300 hover:text-white">
                    {item}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-2">
              <ul className="space-y-2">
                {navigation.map((item, index) => (
                  <li key={index} className="text-gray-300 hover:text-white px-2 py-1">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title Section */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

          {/* User ID Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Enter the user ID here:</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  ID
                </label>
                <input
                  type="text"
                  id="userId"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Read the results here:</h2>
            <div className="prose max-w-none">
              {children}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} {author}
            </div>
            <div className="text-center md:text-right text-gray-400">
              Version {version}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;