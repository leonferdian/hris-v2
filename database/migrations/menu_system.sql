-- =====================================================
-- HRIS Menu System Migration
-- Database: dashboard_hris (MySQL)
-- Purpose: Role-based dynamic menu system
-- =====================================================

USE dashboard_hris;

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

-- Web Pages (Top Level Menu)
CREATE TABLE IF NOT EXISTS `tbl_webpages` (
  `id_webpages` INT AUTO_INCREMENT PRIMARY KEY,
  `webpage_display` VARCHAR(100) NOT NULL,
  `webpage_link` VARCHAR(255),
  `webpage_icon` VARCHAR(100),
  `web_page_case` VARCHAR(50),
  `webpage_acces` TINYINT(1) DEFAULT 1,
  `web_page_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Main Menu (Second Level)
CREATE TABLE IF NOT EXISTS `tbl_mainmenu` (
  `idmain_menu` INT AUTO_INCREMENT PRIMARY KEY,
  `id_webpage` INT NOT NULL,
  `mainmenu_display` VARCHAR(100) NOT NULL,
  `mainmenu_link` VARCHAR(255),
  `mainmenu_acces` TINYINT(1) DEFAULT 1,
  `mainmenu_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_webpage`) REFERENCES `tbl_webpages`(`id_webpages`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sub Menu (Third Level)
CREATE TABLE IF NOT EXISTS `tbl_submenu` (
  `id_submenu` INT AUTO_INCREMENT PRIMARY KEY,
  `id_mainmenu` INT NOT NULL,
  `submenu_display` VARCHAR(100) NOT NULL,
  `submenu_link` VARCHAR(255),
  `submenu_access` TINYINT(1) DEFAULT 1,
  `submenu_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`id_mainmenu`) REFERENCES `tbl_mainmenu`(`idmain_menu`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Menu Permissions - Web Pages
CREATE TABLE IF NOT EXISTS `tbl_hakmenu_webpage` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_webpage` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_webpage` (`id_user`, `id_webpage`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Menu Permissions - Main Menu
CREATE TABLE IF NOT EXISTS `tbl_hakmenu_mainmenu` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_mainmenu` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_mainmenu` (`id_user`, `id_mainmenu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- User Menu Permissions - Sub Menu
CREATE TABLE IF NOT EXISTS `tbl_hakmenu_submenu` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `id_user` INT NOT NULL,
  `id_submenu` INT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_user_submenu` (`id_user`, `id_submenu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- 2. SEED DATA - WEB PAGES
-- =====================================================

INSERT INTO `tbl_webpages` (`webpage_display`, `webpage_link`, `webpage_icon`, `web_page_case`, `webpage_acces`, `web_page_order`) VALUES
('Dashboard', '/dashboard', 'fa fa-home', 'dashboard', 1, 1),
('Master', '#', 'fa fa-database', 'master', 1, 2),
('Tambah Karyawan', '#', 'fa fa-user-plus', 'tambah-karyawan', 1, 3),
('Data Pelamar', '#', 'fa fa-file-text', 'data-pelamar', 1, 4),
('Proses Rekrutmen', '#', 'fa fa-user-check', 'proses-rekrutmen', 1, 5),
('Karyawan', '#', 'fa fa-users', 'karyawan', 1, 6),
('Absensi', '#', 'fa fa-clock-o', 'absensi', 1, 7),
('Konfirmasi Kehadiran', '#', 'fa fa-check-square', 'konfirmasi', 1, 8),
('Payroll', '/payroll', 'fa fa-money', 'payroll', 1, 9),
('Penilaian Karyawan', '/penilaian', 'fa fa-star', 'penilaian', 1, 10),
('Report', '#', 'fa fa-bar-chart', 'report', 1, 11),
('Administrator', '#', 'fa fa-cog', 'administrator', 1, 12);

-- =====================================================
-- 3. SEED DATA - MAIN MENUS
-- =====================================================

-- Master Data Sub-Menus
INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Bagian', '/master/bagian', 1, 1 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Departemen', '/master/departemen', 1, 2 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Divisi', '/master/divisi', 1, 3 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Depo', '/master/depo', 1, 4 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Hari Libur', '/master/hari-libur', 1, 5 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Jabatan', '/master/jabatan', 1, 6 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Jadwal Kerja', '/master/jadwal-kerja', 1, 7 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Level', '/master/level', 1, 8 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Periode', '/master/periode', 1, 9 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Project', '/master/project', 1, 10 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Seksi', '/master/seksi', 1, 11 FROM `tbl_webpages` WHERE web_page_case = 'master';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Master Sub Bagian', '/master/sub-bagian', 1, 12 FROM `tbl_webpages` WHERE web_page_case = 'master';

-- Karyawan Sub-Menus
INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Data Karyawan', '/karyawan/list', 1, 1 FROM `tbl_webpages` WHERE web_page_case = 'karyawan';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Tambah Karyawan', '/karyawan/tambah', 1, 2 FROM `tbl_webpages` WHERE web_page_case = 'karyawan';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Konfirmasi Data', '/karyawan/konfirmasi', 1, 3 FROM `tbl_webpages` WHERE web_page_case = 'karyawan';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Logout Paksa', '/karyawan/logout-paksa', 1, 4 FROM `tbl_webpages` WHERE web_page_case = 'karyawan';

-- Absensi Sub-Menus
INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Absensi Biometric', '/absensi/biometric', 1, 1 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Absensi Karyawan', '/absensi/karyawan', 1, 2 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Absensi List', '/absensi/list', 1, 3 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Absensi Shift', '/absensi/shift', 1, 4 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Absensi Valid', '/absensi/valid', 1, 5 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Tambah Manual', '/absensi/tambah-manual', 1, 6 FROM `tbl_webpages` WHERE web_page_case = 'absensi';

-- Report Sub-Menus
INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Report Absensi', '/report/absensi', 1, 1 FROM `tbl_webpages` WHERE web_page_case = 'report';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Report Bitrix', '/report/bitrix', 1, 2 FROM `tbl_webpages` WHERE web_page_case = 'report';

INSERT INTO `tbl_mainmenu` (`id_webpage`, `mainmenu_display`, `mainmenu_link`, `mainmenu_acces`, `mainmenu_order`) 
SELECT id_webpages, 'Report Cuti', '/report/cuti', 1, 3 FROM `tbl_webpages` WHERE web_page_case = 'report';

-- =====================================================
-- 4. GRANT ALL ACCESS TO ADMIN USER (ID = 1)
-- =====================================================

-- Grant all webpage access to user ID 1
INSERT INTO `tbl_hakmenu_webpage` (`id_user`, `id_webpage`)
SELECT 1, id_webpages FROM `tbl_webpages`;

-- Grant all mainmenu access to user ID 1
INSERT INTO `tbl_hakmenu_mainmenu` (`id_user`, `id_mainmenu`)
SELECT 1, idmain_menu FROM `tbl_mainmenu`;

-- Grant all submenu access to user ID 1 (if any exist)
INSERT INTO `tbl_hakmenu_submenu` (`id_user`, `id_submenu`)
SELECT 1, id_submenu FROM `tbl_submenu`;

-- =====================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX idx_webpage_order ON tbl_webpages(web_page_order);
CREATE INDEX idx_webpage_access ON tbl_webpages(webpage_acces);
CREATE INDEX idx_mainmenu_webpage ON tbl_mainmenu(id_webpage);
CREATE INDEX idx_mainmenu_order ON tbl_mainmenu(mainmenu_order);
CREATE INDEX idx_submenu_mainmenu ON tbl_submenu(id_mainmenu);
CREATE INDEX idx_hakmenu_webpage_user ON tbl_hakmenu_webpage(id_user);
CREATE INDEX idx_hakmenu_mainmenu_user ON tbl_hakmenu_mainmenu(id_user);
CREATE INDEX idx_hakmenu_submenu_user ON tbl_hakmenu_submenu(id_user);

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

SELECT 'Menu system migration completed successfully!' AS Status;
SELECT COUNT(*) AS 'Total Webpages' FROM tbl_webpages;
SELECT COUNT(*) AS 'Total Main Menus' FROM tbl_mainmenu;
SELECT COUNT(*) AS 'Total Sub Menus' FROM tbl_submenu;

