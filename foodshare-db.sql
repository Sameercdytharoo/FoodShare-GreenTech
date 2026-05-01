-- FoodShare Green Tech Database Dump
-- Project: FoodShare - Community Food Waste Reduction Platform
-- Year: 2026

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `foodshare_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL UNIQUE,
  `email` varchar(100) NOT NULL UNIQUE,
  `password_hash` varchar(255) NOT NULL,
  `points` int DEFAULT 0,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `donor_id` int NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT '/img/default-food.png',
  `expiry_date` datetime NOT NULL,
  `category_id` int NOT NULL,
  `status` enum('available', 'claimed') DEFAULT 'available',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`donor_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

CREATE TABLE `claims` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `recipient_id` int NOT NULL,
  `claim_date` timestamp DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending', 'collected') DEFAULT 'pending',
  PRIMARY KEY (`id`),
  FOREIGN KEY (`item_id`) REFERENCES `food_items`(`id`),
  FOREIGN KEY (`recipient_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping sample data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'Sameer_Donor', 'sameer@example.com', 'hashedpassword123'),
(2, 'Mahesh_Student', 'mahesh@example.com', 'hashedpassword456'),
(3, 'Prativa_Bakery', 'prativa@bakery.com', 'hashedpassword789');

--
-- Dumping sample data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'Bakery'),
(2, 'Produce'),
(3, 'Canned Goods'),
(4, 'Dairy'),
(5, 'Other');

--
-- Dumping sample data for table `food_items`
--

INSERT INTO `food_items` (`id`, `donor_id`, `title`, `description`, `image_url`, `expiry_date`, `category_id`, `status`) VALUES
(1, 1, 'Assorted Pastries', 'Leftover croissants and muffins from the closing shift. Still fresh!', '/img/default-food.png', '2026-06-15 17:00:00', 1, 'available'),
(2, 3, 'Sourdough Bread', 'Day-old artisan bread, perfectly good for toasting.', '/img/default-food.png', '2026-06-15 18:30:00', 1, 'available'),
(3, 1, 'Chocolate Chip Cookies', 'A dozen freshly baked cookies, extra from an event.', '/img/default-food.png', '2026-06-16 12:00:00', 1, 'available'),
(4, 3, 'Baguettes', 'Two French baguettes, baked this morning.', '/img/default-food.png', '2026-06-14 20:00:00', 1, 'available'),
(5, 2, 'Organic Apples', 'A bag of fresh red apples from my garden.', '/img/default-food.png', '2026-06-25 10:00:00', 2, 'available'),
(6, 1, 'Carrots and Celery', 'Unopened bags of carrots and celery.', '/img/default-food.png', '2026-06-20 15:00:00', 2, 'available'),
(7, 3, 'Bananas', 'A bunch of slightly brown bananas, perfect for banana bread.', '/img/default-food.png', '2026-06-13 18:00:00', 2, 'available'),
(8, 2, 'Fresh Spinach', 'Large bag of organic spinach, untouched.', '/img/default-food.png', '2026-06-16 09:00:00', 2, 'available'),
(9, 1, 'Surplus Canned Beans', 'Extra stock from student pantry clean-out.', '/img/default-food.png', '2027-01-01 00:00:00', 3, 'available'),
(10, 2, 'Tomato Soup', 'Four cans of creamy tomato soup.', '/img/default-food.png', '2028-05-10 00:00:00', 3, 'available'),
(11, 3, 'Canned Corn', 'Sweet corn kernels, 3 cans available.', '/img/default-food.png', '2027-11-20 00:00:00', 3, 'available'),
(12, 1, 'Tuna Chunks', 'Canned tuna in spring water, pack of 2.', '/img/default-food.png', '2028-02-15 00:00:00', 3, 'available'),
(13, 2, 'Whole Milk', '1 gallon of unopened whole milk.', '/img/default-food.png', '2026-06-22 12:00:00', 4, 'available'),
(14, 3, 'Cheddar Cheese', 'Block of mild cheddar cheese.', '/img/default-food.png', '2026-07-05 10:00:00', 4, 'available'),
(15, 1, 'Greek Yogurt', '6-pack of plain Greek yogurt.', '/img/default-food.png', '2026-06-28 08:00:00', 4, 'available'),
(16, 2, 'Butter', 'Unsalted butter, 2 sticks left over from baking.', '/img/default-food.png', '2026-08-10 14:00:00', 4, 'available'),
(17, 3, 'Pasta Noodles', 'Unopened box of spaghetti noodles.', '/img/default-food.png', '2027-12-30 00:00:00', 5, 'available'),
(18, 1, 'Trail Mix', 'Large bag of nuts and dried fruit.', '/img/default-food.png', '2026-10-15 17:00:00', 5, 'available'),
(19, 2, 'Olive Oil', 'Extra virgin olive oil, 500ml unopened bottle.', '/img/default-food.png', '2028-01-22 00:00:00', 5, 'available'),
(20, 3, 'Rice', '5kg bag of Basmati rice.', '/img/default-food.png', '2028-06-01 00:00:00', 5, 'available');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
