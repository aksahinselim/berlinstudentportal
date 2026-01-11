-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  uni_id INTEGER REFERENCES universities(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  handle VARCHAR(50),
  is_admin BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email OTP Table
CREATE TABLE IF NOT EXISTS email_otps (
  id TEXT PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  attempt_count INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  last_sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  uni_id INTEGER REFERENCES universities(id),
  author_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[], -- Array of strings
  votes INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  attachments JSONB DEFAULT '[]', -- Store array of attachment objects
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Replies Table
CREATE TABLE IF NOT EXISTS replies (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES users(id),
  body TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verifications Table
CREATE TABLE IF NOT EXISTS verifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  uni_id INTEGER REFERENCES universities(id),
  selfie_url TEXT NOT NULL,
  card_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attachments Table (for file uploads - supports FTP and local storage)
CREATE TABLE IF NOT EXISTS attachments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  reply_id INTEGER REFERENCES replies(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  storage_type VARCHAR(20) DEFAULT 'local', -- 'local' or 'ftp'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-University many-to-many relationship (for multiple university memberships)
CREATE TABLE IF NOT EXISTS user_universities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  uni_id INTEGER REFERENCES universities(id),
  is_primary BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, uni_id)
);

CREATE INDEX IF NOT EXISTS idx_user_universities_user_id ON user_universities(user_id);
CREATE INDEX IF NOT EXISTS idx_user_universities_uni_id ON user_universities(uni_id);

-- Initial Data Seeding: Universities
INSERT INTO universities (name, slug) VALUES
  ('Free University of Berlin (FU Berlin)', 'fu-berlin'),
  ('Humboldt University of Berlin (HU Berlin)', 'hu-berlin'),
  ('Charité', 'charite'),
  ('Technische Universität Berlin (TU Berlin)', 'tu-berlin'),
  ('Berlin University of the Arts (UdK)', 'udk-berlin'),
  ('University of Potsdam', 'uni-potsdam'),
  ('ESCP Europe Wirtschaftshochschule Berlin', 'escp-berlin'),
  ('Hertie School', 'hertie-school'),
  ('MSB Medical School Berlin', 'msb-berlin'),
  ('Steinbeis-Hochschule Berlin', 'steinbeis'),
  ('ESMT European School of Management and Technology', 'esmt-berlin'),
  ('International Psychoanalytic University Berlin', 'ipu-berlin'),
  ('Alice Salomon Hochschule Berlin', 'ash-berlin'),
  ('Bard College Berlin', 'bard-berlin'),
  ('Berlin International University of Applied Sciences', 'biu-berlin'),
  ('Berlin School of Economics and Law', 'hwr-berlin'),
  ('Berufsakademie Berlin', 'ba-berlin'),
  ('Berlin University of Applied Sciences and Technology', 'beuth-berlin'),
  ('CODE University of Applied Sciences', 'code-berlin'),
  ('design akademie berlin', 'design-akademie'),
  ('German Academy for Film and Television Berlin', 'dffb'),
  ('Evangelische Fachhochschule', 'efh-berlin'),
  ('Hochschule für Technik und Wirtschaft Berlin', 'htw-berlin'),
  ('Fachhochschule für Verwaltung und Rechtspflege Berlin', 'fhvr-berlin'),
  ('Hochschule für Musik Hanns Eisler', 'hfm-berlin'),
  ('Hochschule für Schauspielkunst Ernst Busch', 'hfs-berlin'),
  ('International Business School', 'ibs-berlin'),
  ('Katholische Fachhochschule', 'khsb-berlin'),
  ('Weißensee Academy of Art Berlin', 'kh-berlin'),
  ('Mediadesign Hochschule', 'mediadesign'),
  ('OTA Hochschule Berlin', 'ota-berlin'),
  ('Teikyo University Berlin', 'teikyo-berlin'),
  ('Touro College Berlin', 'touro-berlin'),
  ('Berlin School of Business and Innovation (BSBI)', 'bsbi'),
  ('Gisma University of Applied Sciences', 'gisma'),
  ('University of Europe for Applied Sciences', 'ue-germany')
ON CONFLICT (slug) DO NOTHING;

-- Initial Admin User (Password: password)
-- Hash generated for 'password' using bcrypt (rounds=10)
-- Login credentials: admin@example.invalid / password
INSERT INTO users (email, password_hash, name, uni_id, status, handle, is_admin)
VALUES ('admin@example.invalid', '$2a$10$CwTycUXWue0Thq9StjUM0uJ8qP.5qZH.IaX8x0xQOqb8hgb9gYx9W', 'Admin User', 1, 'verified', 'Admin', TRUE)
ON CONFLICT (email) DO NOTHING;
