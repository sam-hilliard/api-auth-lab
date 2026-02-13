CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO users (username, password) 
VALUES ('testuser', 'testpassword')
ON CONFLICT (username) DO NOTHING;
