CREATE DATABASE blog_codeto

CREATE TABLE [Users] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    email NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    first_name NVARCHAR(100),
    last_name NVARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME
);


CREATE TABLE [Posts] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(255) NOT NULL,
    content NVARCHAR(MAX),
    author NVARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME
);
