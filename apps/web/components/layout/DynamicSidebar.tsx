'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, LogOut } from 'lucide-react';

interface SubMenu {
  id_submenu: number;
  submenu_display: string;
  submenu_link: string;
}

interface MainMenu {
  idmain_menu: number;
  mainmenu_display: string;
  mainmenu_link: string;
  submenus: SubMenu[];
}

interface WebPage {
  id_webpages: number;
  webpage_display: string;
  webpage_link: string;
  webpage_icon: string;
  mainmenus: MainMenu[];
}

export default function DynamicSidebar() {
  const pathname = usePathname();
  const [menuData, setMenuData] = useState<WebPage[]>([]);
  const [openMenus, setOpenMenus] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserMenu();
  }, []);

  const fetchUserMenu = async () => {
    try {
      const response = await fetch('/api/menu/user-menu');
      if (response.ok) {
        const data = await response.json();
        setMenuData(data);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      // Fallback to static menu if API fails
      // You can use the old static menu here as fallback
    } finally {
      setLoading(false);
    }
  };

  const toggleMenu = (id: number) => {
    setOpenMenus((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const convertLink = (link: string) => {
    // Convert PHP query string format to Next.js routes
    // ?page=master&sub=bagian → /master/bagian
    if (link.startsWith('?page=')) {
      const params = new URLSearchParams(link.substring(1));
      const page = params.get('page');
      const sub = params.get('sub');
      if (sub) {
        return `/${page}/${sub}`;
      }
      return `/${page}`;
    }
    return link;
  };

  if (loading) {
    return (
      <aside className="w-64 bg-slate-800 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4 border-b border-slate-700">
          <h1 className="text-xl font-bold">HRIS System</h1>
          <p className="text-xs text-slate-400">Loading menu...</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-slate-700">
        <h1 className="text-xl font-bold">HRIS System</h1>
        <p className="text-xs text-slate-400">Human Resource Information System</p>
      </div>

      <nav className="p-2">
        {menuData.map((webpage) => {
          const hasChildren = webpage.mainmenus && webpage.mainmenus.length > 0;
          const isOpen = openMenus.has(webpage.id_webpages);
          const webpageLink = convertLink(webpage.webpage_link);

          return (
            <div key={webpage.id_webpages} className="mb-1">
              {hasChildren ? (
                <>
                  <button
                    onClick={() => toggleMenu(webpage.id_webpages)}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      'hover:bg-slate-700',
                      isOpen && 'bg-slate-700'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <i className={`${webpage.webpage_icon} w-5 h-5`} />
                      <span>{webpage.webpage_display}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>
                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {webpage.mainmenus.map((mainmenu) => {
                        const hasSubmenus = mainmenu.submenus && mainmenu.submenus.length > 0;
                        const mainmenuLink = convertLink(mainmenu.mainmenu_link);

                        return (
                          <div key={mainmenu.idmain_menu}>
                            {hasSubmenus ? (
                              <>
                                <button
                                  onClick={() => toggleMenu(mainmenu.idmain_menu + 1000)}
                                  className="w-full text-left block px-3 py-2 rounded-md text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-between"
                                >
                                  <span>{mainmenu.mainmenu_display}</span>
                                  <ChevronDown
                                    className={cn(
                                      'w-3 h-3 transition-transform',
                                      openMenus.has(mainmenu.idmain_menu + 1000) && 'rotate-180'
                                    )}
                                  />
                                </button>
                                {openMenus.has(mainmenu.idmain_menu + 1000) && (
                                  <div className="ml-4 space-y-1">
                                    {mainmenu.submenus.map((submenu) => (
                                      <Link
                                        key={submenu.id_submenu}
                                        href={convertLink(submenu.submenu_link)}
                                        className={cn(
                                          'block px-3 py-2 rounded-md text-xs transition-colors',
                                          pathname === convertLink(submenu.submenu_link)
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                                        )}
                                      >
                                        <i className="fa fa-caret-right mr-2" />
                                        {submenu.submenu_display}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={mainmenuLink}
                                className={cn(
                                  'block px-3 py-2 rounded-md text-sm transition-colors',
                                  pathname === mainmenuLink
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                )}
                              >
                                {mainmenu.mainmenu_display}
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={webpageLink}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === webpageLink
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )}
                >
                  <i className={`${webpage.webpage_icon} w-5 h-5`} />
                  <span>{webpage.webpage_display}</span>
                </Link>
              )}
            </div>
          );
        })}

        <button
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mt-4 border-t border-slate-700 pt-4"
          onClick={() => {
            window.location.href = '/api/auth/logout';
          }}
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}

