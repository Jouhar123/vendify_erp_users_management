-- Create database
CREATE DATABASE IF NOT EXISTS erp_user_management;
USE erp_user_management;

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    company_id INT NOT NULL,
    role_id INT NOT NULL,
    created_by INT,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample data
-- Companies
INSERT INTO companies (name, description) VALUES
('TechCorp Inc.', 'Technology solutions company'),
('RetailMax Ltd.', 'Retail chain management'),
('FinanceHub LLC', 'Financial services provider');

-- Roles
INSERT INTO roles (name, description, permissions) VALUES
('CA', 'Company Admin - Full access to manage users within company', '{"manage_users": true, "view_reports": true, "admin_access": true}'),
('SM', 'Store Manager - Manage store operations', '{"manage_store": true, "view_reports": true, "manage_inventory": true}'),
('FM', 'Finance Manager - Handle financial operations', '{"manage_finance": true, "view_reports": true, "approve_expenses": true}'),
('EM', 'Employee - Basic access', '{"view_reports": false, "basic_access": true}');

-- Sample Company Admin users (passwords will be hashed in the application)
-- Password for all sample users: "password123"
INSERT INTO users (email, password, first_name, last_name, company_id, role_id, created_by) VALUES
('admin@techcorp.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Admin', 1, 1, NULL),
('admin@retailmax.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah', 'Manager', 2, 1, NULL),
('admin@financehub.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Mike', 'Director', 3, 1, NULL); 