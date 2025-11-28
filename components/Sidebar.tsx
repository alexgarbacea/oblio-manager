'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  name: string;
  href?: string;
  icon: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: 'Webhooks',
    href: '/webhooks',
    icon: '🔗',
  },
  {
    name: 'Nomenclature',
    icon: '📋',
    children: [
      { name: 'Companies', href: '/nomenclature/companies', icon: '🏢' },
      { name: 'VAT Rates', href: '/nomenclature/vat-rates', icon: '💰' },
      { name: 'Clients', href: '/nomenclature/clients', icon: '👥' },
      { name: 'Products', href: '/nomenclature/products', icon: '📦' },
      { name: 'Series', href: '/nomenclature/series', icon: '🔢' },
      { name: 'Languages', href: '/nomenclature/languages', icon: '🌐' },
      { name: 'Management', href: '/nomenclature/management', icon: '🏪' },
    ],
  },
  {
    name: 'Documents',
    icon: '📄',
    children: [
      { name: 'Create Invoice', href: '/documents/creatE-Factura', icon: '➕' },
      { name: 'Create Proforma', href: '/documents/create-proforma', icon: '📝' },
      { name: 'Create Notice', href: '/documents/create-notice', icon: '📮' },
      { name: 'List Invoices', href: '/documents/list-invoices', icon: '📊' },
      { name: 'Manage Documents', href: '/documents/manage', icon: '⚙️' },
    ],
  },
  {
    name: 'E-Factura (SPV)',
    icon: '📧',
    children: [
      { name: 'Send E-Factura', href: '/einvoice/send', icon: '📤' },
      { name: 'Get E-Factura', href: '/einvoice/get', icon: '📥' },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();

  const toggleExpand = (name: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-white lg:hidden"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-100 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-64 overflow-y-auto`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Oblio Manager</h1>
          <p className="text-sm text-gray-400">API & Webhooks Interface</p>
        </div>

        <nav className="px-3">
          {navigation.map((item) => (
            <div key={item.name} className="mb-2">
              {item.href ? (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.name)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <span>{item.name}</span>
                    </div>
                    <span className="text-sm">
                      {expandedItems.has(item.name) ? '▼' : '▶'}
                    </span>
                  </button>
                  {expandedItems.has(item.name) && item.children && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href || '#'}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                            pathname === child.href
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-gray-800'
                          }`}
                        >
                          <span>{child.icon}</span>
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="p-4 mt-8 border-t border-gray-800">
          <Link
            href="/settings"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              pathname === '/settings'
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-800'
            }`}
          >
            <span className="text-xl">⚙️</span>
            <span>Settings</span>
          </Link>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
