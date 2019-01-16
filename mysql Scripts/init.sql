DROP DATABASE website;
CREATE DATABASE website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE website;

CREATE TABLE categories (
	`category` varchar(255)
);
insert into categories (category) values ('Φαγητό'),('Σινεμά'),
									('Μουσική'),('Θέατρο'),
                                    ('Μετακίνηση'),('Καφετέριες'),
                                    ('Ποτό'),('Τεχνολογία'),('Άλλο');
CREATE TABLE addresses (
	`id` BIGINT,
    `city` varchar(255),
    `periferia` varchar(255),
    PRIMARY KEY(id)
);

CREATE TABLE users (
	`id` BIGINT not null auto_increment,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
	`image` varchar(255),
    `name` varchar(255) DEFAULT 'anonymous',
    `surname` varchar(255) DEFAULT 'anonymous',
    PRIMARY KEY (`id`)
);

CREATE TABLE shops (
	`id` BIGINT not null auto_increment,
    `name` varchar(255),
    `address` varchar(255) DEFAULT '',
    `phone` int,
    `lng` double,
    `lat` double,
    `withdrawn` boolean DEFAULT false,
    `userID` BIGINT,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`userID`) REFERENCES users(id) ON DELETE CASCADE
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
    PRIMARY KEY (`shopID`, `tagID`),
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
    PRIMARY KEY (`productID`, `tagID`),
    FOREIGN KEY (productID) REFERENCES products(id),
    FOREIGN KEY (tagID) REFERENCES tags(id)
);

CREATE TABLE prices (
	`price` DOUBLE NOT NULL,
    `dateFrom` DATE,
    `dateTo` DATE,
    `productID` BIGINT NOT NULL,
    `shopID` BIGINT NOT NULL,
    `userID` BIGINT DEFAULT 1,
    FOREIGN KEY (productID) REFERENCES products(id),
    FOREIGN KEY (shopID) REFERENCES shops(id),
    FOREIGN KEY (userID) REFERENCES users(id) ON DELETE SET NULL,
    PRIMARY KEY (`price`, `productID`, `shopID`)
);

