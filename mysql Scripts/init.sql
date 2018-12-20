DROP DATABASE website;
CREATE DATABASE website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE website;

CREATE TABLE shops (
	`id` BIGINT not null auto_increment,
    `name` varchar(255),
    `address` varchar(255),
    `phone` int,
    `lng` double,
    `lat` double,
    `withdrawn` boolean DEFAULT false,
    PRIMARY KEY(`id`)
);

CREATE TABLE users (
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
	`image` varchar(255),
    `user_or_shop` varchar(255) NOT NULL,
    `name` varchar(255) DEFAULT 'anonymous',
    `surname` varchar(255) DEFAULT 'anonymous',
    `shopID` BIGINT,
	FOREIGN KEY (`shopID`)  REFERENCES shops(id)
);

-- tags: katigories twn shops i twn products
CREATE TABLE tags (
	`id` BIGINT not null auto_increment,
	`name` varchar(255),
    PRIMARY KEY (`id`)
);

CREATE TABLE categorized_shop (
	`shopID` BIGINT NOT NULL,
    `tagID` BIGINT NOT NULL,
    FOREIGN KEY (shopID) REFERENCES shops(id),
    FOREIGN KEY (tagID) REFERENCES tags(id)
);

CREATE TABLE products (
	`id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` varchar(255),
    `description` varchar(255),
    `category` varchar(255),
	`withdrawn` boolean DEFAULT false,
    `extra_data` varchar(255),
    PRIMARY KEY (id)
);

CREATE TABLE categorized_product (
	`productID` BIGINT NOT NULL,
    `tagID` BIGINT NOT NULL,
    FOREIGN KEY (productID) REFERENCES products(id),
    FOREIGN KEY (tagID) REFERENCES tags(id)
);

CREATE TABLE prices (
	`price` DOUBLE NOT NULL,
    `dateFrom` DATE,
    `dateTo` DATE,
    `productID` BIGINT NOT NULL,
    `shopID` BIGINT NOT NULL,
    FOREIGN KEY (productID) REFERENCES products(id),
    FOREIGN KEY (shopID) REFERENCES shops(id)
);

CREATE TABLE addresses (
	`id` BIGINT,
    `city` varchar(255),
    `periferia` varchar(255),
    `diamerisma` varchar(255),
    PRIMARY KEY(id)
);