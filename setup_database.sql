-- ========================================
-- HRIS v2 - Database Setup Script
-- Run this after starting MySQL
-- ========================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dashboard_hris;
USE dashboard_hris;

-- Create user table for authentication
CREATE TABLE IF NOT EXISTS user (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nama VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    user_level INT DEFAULT 0,
    status INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create test user
-- Username: admin
-- Password: admin123
-- Password is hashed using MD5 with scrambler: PadmaTiRt4
-- Hash calculation: MD5('PadmaTiRt4' + MD5('admin123') + 'PadmaTiRt4')
INSERT INTO user (username, nama, email, password, user_level, status) 
VALUES ('admin', 'Administrator', 'admin@hris.local', 'c35c71570b4c49c4ba164e1cf5d88c47', 1, 1)
ON DUPLICATE KEY UPDATE password='c35c71570b4c49c4ba164e1cf5d88c47';

-- Create another test user
-- Username: leonard.ferdian@padmatirtagroup.com
-- Password: test123
INSERT INTO user (username, nama, email, password, user_level, status) 
VALUES (
    'leonard.ferdian@padmatirtagroup.com', 
    'Leonard Ferdian', 
    'leonard.ferdian@padmatirtagroup.com', 
    '5f4dcc3b5aa765d61d8327deb882cf99',  -- MD5 hash for 'password' with scrambler
    1, 
    1
)
ON DUPLICATE KEY UPDATE password='5f4dcc3b5aa765d61d8327deb882cf99';

-- Verify users were created
SELECT id_user, username, nama, email, user_level, status FROM user;

-- ========================================
-- Menu System Tables (from previous migration)
-- ========================================

-- Web pages table
CREATE TABLE IF NOT EXISTS tbl_webpages (
    id_webpages INT AUTO_INCREMENT PRIMARY KEY,
    webpage_display VARCHAR(100) NOT NULL,
    webpage_icon VARCHAR(50),
    webpage_link VARCHAR(255),
    web_page_case VARCHAR(50),
    webpage_acces TINYINT DEFAULT 1,
    web_page_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Main menu table
CREATE TABLE IF NOT EXISTS tbl_mainmenu (
    idmain_menu INT AUTO_INCREMENT PRIMARY KEY,
    id_webpage INT,
    mainmenu_display VARCHAR(100) NOT NULL,
    mainmenu_link VARCHAR(255),
    mainmenu_acces TINYINT DEFAULT 1,
    mainmenu_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_webpage) REFERENCES tbl_webpages(id_webpages) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Submenu table
CREATE TABLE IF NOT EXISTS tbl_submenu (
    id_submenu INT AUTO_INCREMENT PRIMARY KEY,
    id_mainmenu INT,
    submenu_display VARCHAR(100) NOT NULL,
    submenu_link VARCHAR(255),
    submenu_access TINYINT DEFAULT 1,
    submenu_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mainmenu) REFERENCES tbl_mainmenu(idmain_menu) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User access tables
CREATE TABLE IF NOT EXISTS tbl_hakmenu_webpage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_webpage INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_webpage) REFERENCES tbl_webpages(id_webpages) ON DELETE CASCADE,
    UNIQUE KEY unique_user_webpage (id_user, id_webpage)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tbl_hakmenu_mainmenu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_mainmenu INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_mainmenu) REFERENCES tbl_mainmenu(idmain_menu) ON DELETE CASCADE,
    UNIQUE KEY unique_user_mainmenu (id_user, id_mainmenu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tbl_hakmenu_submenu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_submenu INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_submenu) REFERENCES tbl_submenu(id_submenu) ON DELETE CASCADE,
    UNIQUE KEY unique_user_submenu (id_user, id_submenu)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample menu data
INSERT INTO tbl_webpages (webpage_display, webpage_icon, webpage_link, web_page_case, webpage_acces, web_page_order) VALUES
('Dashboard', 'fa fa-dashboard', '/dashboard', 'dashboard', 1, 1),
('Master Data', 'fa fa-database', '/master', 'master', 1, 2),
('Karyawan', 'fa fa-users', '/karyawan', 'karyawan', 1, 3),
('Absensi', 'fa fa-calendar-check-o', '/absensi', 'absensi', 1, 4),
('Cuti', 'fa fa-calendar', '/cuti', 'cuti', 1, 5),
('Payroll', 'fa fa-money', '/payroll', 'payroll', 1, 6),
('Reports', 'fa fa-file-text', '/report', 'report', 1, 7),
('Administrator', 'fa fa-cog', '/admin', 'admin', 1, 8)
ON DUPLICATE KEY UPDATE webpage_display=VALUES(webpage_display);

-- Grant all menu access to admin user (id_user = 1)
INSERT IGNORE INTO tbl_hakmenu_webpage (id_user, id_webpage)
SELECT 1, id_webpages FROM tbl_webpages;

-- Display success message
SELECT '✅ Database setup complete!' AS Status;
SELECT CONCAT('Total Users: ', COUNT(*)) AS Info FROM user;
SELECT CONCAT('Total Web Pages: ', COUNT(*)) AS Info FROM tbl_webpages;

-- Display test credentials
SELECT '========================================' AS '';
SELECT '✅ TEST CREDENTIALS' AS '';
SELECT '========================================' AS '';
SELECT 'Username: admin' AS '';
SELECT 'Password: admin123' AS '';
SELECT '========================================' AS '';

