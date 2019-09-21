CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(64) NOT NULL,
    admin INTEGER NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS reports (
    title VARCHAR(255) NOT NULL,
    text TEXT NOT NULL,
    UNIQUE(title)
);
