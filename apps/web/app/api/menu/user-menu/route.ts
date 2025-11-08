import { NextRequest, NextResponse } from 'next/server';
import { queryMySQL } from '@/lib/db/connection';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get user ID from session/JWT token
    // For now, using a default user ID
    const userId = request.headers.get('x-user-id') || '1';

    // Fetch user's accessible webpages
    const webpagesQuery = `
      SELECT wp.*
      FROM tbl_webpages wp
      WHERE wp.id_webpages IN (
        SELECT id_webpage 
        FROM tbl_hakmenu_webpage 
        WHERE id_user = ?
      )
      AND wp.webpage_acces = 1
      ORDER BY wp.web_page_order ASC
    `;

    const [webpages] = await queryMySQL('mysql_hris', webpagesQuery, [userId]);

    // For each webpage, fetch main menus and submenus
    const menuData = await Promise.all(
      (webpages as any[]).map(async (webpage) => {
        // Fetch main menus for this webpage
        const mainmenusQuery = `
          SELECT mm.*
          FROM tbl_mainmenu mm
          WHERE mm.id_webpage = ?
          AND mm.idmain_menu IN (
            SELECT id_mainmenu 
            FROM tbl_hakmenu_mainmenu 
            WHERE id_user = ?
          )
          AND mm.mainmenu_acces = 1
          ORDER BY mm.mainmenu_order ASC
        `;

        const [mainmenus] = await queryMySQL('mysql_hris', mainmenusQuery, [
          webpage.id_webpages,
          userId,
        ]);

        // For each main menu, fetch submenus
        const mainmenusWithSubs = await Promise.all(
          (mainmenus as any[]).map(async (mainmenu) => {
            const submenusQuery = `
              SELECT sm.*
              FROM tbl_submenu sm
              WHERE sm.id_mainmenu = ?
              AND sm.id_submenu IN (
                SELECT id_submenu 
                FROM tbl_hakmenu_submenu 
                WHERE id_user = ?
              )
              AND sm.submenu_access = 1
              ORDER BY sm.submenu_order ASC
            `;

            const [submenus] = await queryMySQL('mysql_hris', submenusQuery, [
              mainmenu.idmain_menu,
              userId,
            ]);

            return {
              ...mainmenu,
              submenus: submenus || [],
            };
          })
        );

        return {
          ...webpage,
          mainmenus: mainmenusWithSubs,
        };
      })
    );

    return NextResponse.json(menuData);
  } catch (error) {
    console.error('Error fetching user menu:', error);
    
    // Return empty array if menu tables don't exist yet (fallback)
    // This allows the system to work with static menus until database is set up
    return NextResponse.json([]);
  }
}

// Admin endpoint to grant all menus to a user (for setup/testing)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Get all webpages
    const [webpages] = await queryMySQL('mysql_hris', 'SELECT id_webpages FROM tbl_webpages', []);
    
    // Grant access to all webpages
    for (const webpage of webpages as any[]) {
      await queryMySQL(
        'mysql_hris',
        'INSERT IGNORE INTO tbl_hakmenu_webpage (id_user, id_webpage) VALUES (?, ?)',
        [userId, webpage.id_webpages]
      );
    }

    // Get all mainmenus
    const [mainmenus] = await queryMySQL('mysql_hris', 'SELECT idmain_menu FROM tbl_mainmenu', []);
    
    // Grant access to all mainmenus
    for (const mainmenu of mainmenus as any[]) {
      await queryMySQL(
        'mysql_hris',
        'INSERT IGNORE INTO tbl_hakmenu_mainmenu (id_user, id_mainmenu) VALUES (?, ?)',
        [userId, mainmenu.idmain_menu]
      );
    }

    // Get all submenus
    const [submenus] = await queryMySQL('mysql_hris', 'SELECT id_submenu FROM tbl_submenu', []);
    
    // Grant access to all submenus
    for (const submenu of submenus as any[]) {
      await queryMySQL(
        'mysql_hris',
        'INSERT IGNORE INTO tbl_hakmenu_submenu (id_user, id_submenu) VALUES (?, ?)',
        [userId, submenu.id_submenu]
      );
    }

    return NextResponse.json({ success: true, message: 'All menu access granted' });
  } catch (error) {
    console.error('Error granting menu access:', error);
    return NextResponse.json({ error: 'Failed to grant access' }, { status: 500 });
  }
}

