DROP DATABASE website;
CREATE DATABASE website;
USE website;
CREATE TABLE users (
    `email` varchar(255),
    `password` varchar(255),
	`image` varchar(255),
	PRIMARY KEY(`email`)
);

CREATE TABLE shops (
	`id` BIGINT not null auto_increment,
    `name` varchar(255),
    `address` varchar(255),
    `phone` int,
    `lng` double,
    `lat` double,
    `tags` varchar(255), -- thelei allagi. Logika table Tags me endiameso table gia relations. many to many
    `withdrawn` boolean DEFAULT false,
    PRIMARY KEY(`id`)
);
