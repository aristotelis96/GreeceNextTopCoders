DROP DATABASE website;
CREATE DATABASE website;
USE website;
CREATE TABLE users (
    `email` varchar(255),
    `password` varchar(255),
	`image` varchar(255),
	PRIMARY KEY(`email`)
);