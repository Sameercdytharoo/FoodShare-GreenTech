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
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `food_items`
--

CREATE TABLE `food_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `category` varchar(50),
  `expiry_date` date,
  `location` varchar(255),
  `donor_id` int NOT NULL,
  `status` enum('available', 'claimed') DEFAULT 'available',
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`donor_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

CREATE TABLE `claims` (
  `id` int NOT NULL AUTO_INCREMENT,
  `item_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `claimed_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`item_id`) REFERENCES `food_items`(`id`),
  FOREIGN KEY (`receiver_id`) REFERENCES `users`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping sample data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`) VALUES
(1, 'Sameer_Donor', 'sameer@example.com', 'hashedpassword123'),
(2, 'Mahesh_Student', 'mahesh@example.com', 'hashedpassword456'),
(3, 'Prativa_Bakery', 'prativa@bakery.com', 'hashedpassword789');

--
-- Dumping sample data for table `food_items`
--

INSERT INTO `food_items` (`id`, `name`, `description`, `category`, `expiry_date`, `location`, `donor_id`, `status`) VALUES
(1, 'Assorted Pastries', 'Leftover croissants and muffins from the closing shift. Still fresh!', 'Bakery', '2026-06-15', 'Central London, EC1', 1, 'available'),
(2, 'Sourdough Bread', 'Day-old artisan bread, perfectly good for toasting.', 'Bakery', '2026-06-15', 'Hackney, E8', 3, 'available'),
(3, 'Surplus Canned Beans', 'Extra stock from student pantry clean-out.', 'Canned Goods', '2027-01-01', 'Liverpool St, EC2', 1, 'available');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
