ALTER TABLE projects ADD COLUMN image_url VARCHAR(500) AFTER github_url;
ALTER TABLE events ADD COLUMN image_url VARCHAR(500) AFTER category;
