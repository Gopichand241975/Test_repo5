-- Workbench schema for Aurora PostgreSQL
-- Run this once against your Aurora PostgreSQL cluster to set up the database.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- e.g. woodworking, knitting, 3d-printing, other
  status TEXT NOT NULL DEFAULT 'in_progress', -- in_progress | completed | abandoned
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 1,
  unit TEXT, -- e.g. "yards", "sheets", "g"
  unit_cost NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Helpful indexes for the relational queries the app runs most:
-- "all projects for a user" and "all materials for a project"
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_materials_project_id ON materials(project_id);

-- Convenience view: project totals computed from materials (sum(quantity * unit_cost))
CREATE VIEW project_costs AS
SELECT
  p.id AS project_id,
  p.user_id,
  p.title,
  p.category,
  p.status,
  COALESCE(SUM(m.quantity * m.unit_cost), 0) AS total_cost,
  COUNT(m.id) AS material_count
FROM projects p
LEFT JOIN materials m ON m.project_id = p.id
GROUP BY p.id;
