-- ============================================
-- LUXE DRIVE HUB - DATABASE SCHEMA
-- ============================================

-- Users Table (Clients)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(50) DEFAULT 'admin', -- admin, support, manager
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  vin VARCHAR(17) UNIQUE NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  make VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  color VARCHAR(50),
  mileage INTEGER DEFAULT 0,
  transmission VARCHAR(20),
  fuel_type VARCHAR(20),
  status VARCHAR(50) DEFAULT 'active', -- active, pending, suspended, archived
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  image_url VARCHAR(500),
  notification_type VARCHAR(50) DEFAULT 'general', -- general, alert, maintenance, document, update
  status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sent, failed
  scheduled_at TIMESTAMP,
  sent_at TIMESTAMP,
  target_type VARCHAR(50) DEFAULT 'all', -- all, vehicle, user, group
  target_id UUID, -- vehicle_id or user_id if specific
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Notification History (Track who received what)
CREATE TABLE IF NOT EXISTS notification_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL,
  user_id UUID NOT NULL,
  vehicle_id UUID,
  status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, read, failed
  delivered_at TIMESTAMP,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL
);

-- Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL,
  document_type VARCHAR(50), -- insurance, registration, inspection, maintenance, other
  file_url VARCHAR(500) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size INTEGER, -- in bytes
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected
  uploaded_by UUID NOT NULL,
  rejected_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES admin_users(id)
);

-- Vehicle Updates Table (Maintenance, repairs, etc)
CREATE TABLE IF NOT EXISTS vehicle_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL,
  admin_id UUID NOT NULL,
  update_type VARCHAR(50), -- maintenance, repair, recall, inspection
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, completed
  priority VARCHAR(50) DEFAULT 'normal', -- low, normal, high, critical
  scheduled_date TIMESTAMP,
  completed_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- Sessions Table (for Socket.IO)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  admin_id UUID,
  socket_id VARCHAR(255) UNIQUE NOT NULL,
  user_type VARCHAR(20) NOT NULL, -- client, admin
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  connected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  disconnected_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (admin_id) REFERENCES admin_users(id) ON DELETE CASCADE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX idx_notifications_admin_id ON notifications(admin_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notification_history_user_id ON notification_history(user_id);
CREATE INDEX idx_notification_history_notification_id ON notification_history(notification_id);
CREATE INDEX idx_notification_history_status ON notification_history(status);
CREATE INDEX idx_documents_vehicle_id ON documents(vehicle_id);
CREATE INDEX idx_vehicle_updates_vehicle_id ON vehicle_updates(vehicle_id);
CREATE INDEX idx_sessions_socket_id ON sessions(socket_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_admin_id ON sessions(admin_id);

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- INSERT INTO admin_users (email, password_hash, full_name, role) VALUES
-- ('admin@luxedrive.com', 'hashed_password_123', 'Admin User', 'admin');

-- INSERT INTO users (email, password_hash, first_name, last_name, phone) VALUES
-- ('client@luxedrive.com', 'hashed_password_456', 'John', 'Doe', '+33612345678');

-- INSERT INTO vehicles (user_id, vin, license_plate, make, model, year, color, mileage, fuel_type) VALUES
-- ((SELECT id FROM users LIMIT 1), 'JT2BF18K2M0047234', 'AB-123-CD', 'Toyota', 'Supra', 2020, 'Black', 45000, 'Petrol');
