CREATE DATABASE IF NOT EXISTS auth_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE auth_system;

CREATE TABLE users (
                       id INT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE credentials (
                             user_id INT PRIMARY KEY,
                             password_hash VARCHAR(255) NOT NULL,
                             hash_algorithm VARCHAR(50) NOT NULL DEFAULT 'bcrypt',
                             last_changed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             CONSTRAINT fk_credentials_user
                                 FOREIGN KEY (user_id)
                                     REFERENCES users(id)
                                     ON DELETE CASCADE
);