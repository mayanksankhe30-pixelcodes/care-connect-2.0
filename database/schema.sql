CREATE DATABASE IF NOT EXISTS care_connect;

USE care_connect;

-- =========================================
-- USERS
-- =========================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL UNIQUE,

    password_hash VARCHAR(255) NOT NULL,

    phone VARCHAR(20),

    role ENUM('seeker', 'caregiver', 'admin') NOT NULL DEFAULT 'seeker',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- CAREGIVERS
-- =========================================

CREATE TABLE caregivers (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    city VARCHAR(100) NOT NULL,

    experience INT DEFAULT 0,

    qualifications TEXT,

    bio TEXT,

    price DECIMAL(10,2) NOT NULL DEFAULT 0,

    photo_url TEXT,

    verified BOOLEAN DEFAULT FALSE,

    rating DECIMAL(3,2) DEFAULT 0,

    reviews_count INT DEFAULT 0,

    availability_status VARCHAR(100) DEFAULT 'Available for bookings',

    start_time TIME,

    end_time TIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- CAREGIVER SERVICES
-- =========================================

CREATE TABLE caregiver_services (
    id INT AUTO_INCREMENT PRIMARY KEY,

    caregiver_id INT NOT NULL,

    service_name VARCHAR(100) NOT NULL,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE
);


-- =========================================
-- CAREGIVER EXPERTISE
-- =========================================

CREATE TABLE caregiver_expertise (
    id INT AUTO_INCREMENT PRIMARY KEY,

    caregiver_id INT NOT NULL,

    expertise_name VARCHAR(100) NOT NULL,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE
);


-- =========================================
-- CAREGIVER LANGUAGES
-- =========================================

CREATE TABLE caregiver_languages (
    id INT AUTO_INCREMENT PRIMARY KEY,

    caregiver_id INT NOT NULL,

    language_name VARCHAR(50) NOT NULL,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE
);


-- =========================================
-- CAREGIVER WORKING DAYS
-- =========================================

CREATE TABLE caregiver_days (
    id INT AUTO_INCREMENT PRIMARY KEY,

    caregiver_id INT NOT NULL,

    day_name VARCHAR(20) NOT NULL,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE
);


-- =========================================
-- CARE REQUIREMENTS
-- =========================================

CREATE TABLE care_requirements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    seeker_id INT NOT NULL,

    care_type VARCHAR(100),

    location VARCHAR(150),

    start_date DATE,

    end_date DATE,

    preferred_start_time TIME,

    preferred_end_time TIME,

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seeker_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- =========================================
-- BOOKINGS
-- =========================================

CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,

    seeker_id INT NOT NULL,

    caregiver_id INT NOT NULL,

    requirement_id INT,

    booking_date DATE NOT NULL,

    start_time TIME NOT NULL,

    end_time TIME NOT NULL,

    amount DECIMAL(10,2) NOT NULL DEFAULT 0,

    status ENUM(
        'pending',
        'confirmed',
        'completed',
        'cancelled'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seeker_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE,

    FOREIGN KEY (requirement_id)
        REFERENCES care_requirements(id)
        ON DELETE SET NULL
);


-- =========================================
-- PAYMENTS
-- =========================================

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_status ENUM(
        'pending',
        'paid',
        'failed',
        'refunded'
    ) DEFAULT 'pending',

    payment_method VARCHAR(50),

    transaction_id VARCHAR(150),

    paid_at TIMESTAMP NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE
);


-- =========================================
-- REVIEWS
-- =========================================

CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,

    booking_id INT NOT NULL,

    seeker_id INT NOT NULL,

    caregiver_id INT NOT NULL,

    rating INT NOT NULL,

    comment TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    FOREIGN KEY (seeker_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE CASCADE,

    CHECK (rating >= 1 AND rating <= 5)
);