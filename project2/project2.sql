-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 09, 2024 at 04:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project2`
--

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `bill_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discount` decimal(10,0) NOT NULL,
  `generated_date` date NOT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('Pending','Paid','Disputed','Resolved') DEFAULT 'Pending',
  `dispute_reason` text DEFAULT NULL,
  `dispute_resolve` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bill`
--

INSERT INTO `bill` (`bill_id`, `order_id`, `amount`, `discount`, `generated_date`, `due_date`, `status`, `dispute_reason`, `dispute_resolve`) VALUES
(1, 12, 1100.00, 100, '2024-12-02', '2024-11-30', 'Disputed', 'noo', 'yess'),
(2, 9, 330000.00, 3333, '2024-11-28', '2024-12-06', 'Paid', 'i want to less the price more', 'cant'),
(3, 10, 399556.00, 444, '2024-11-28', '2024-12-26', 'Paid', NULL, ''),
(4, 13, 11000.00, 2000, '2024-11-29', '2024-12-03', 'Paid', NULL, NULL),
(5, 14, 69999.00, 1, '2024-12-06', '2024-12-06', 'Disputed', 'expensive', NULL),
(6, 16, 11800.00, 200, '2024-11-20', '2024-11-29', 'Pending', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `chat_id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`chat_id`, `order_id`, `sender_id`, `receiver_id`, `message`, `timestamp`) VALUES
(1, 10, 8, 3, 'HII', '2024-11-28 19:33:32'),
(2, 9, 8, 3, 'hey', '2024-11-28 19:33:51'),
(3, 10, 8, 3, 'hhii\n', '2024-11-28 20:00:45'),
(4, 10, 3, 8, 'yoo', '2024-11-28 20:01:55'),
(5, 10, 3, 8, 'can we lees the proce', '2024-11-28 20:02:10'),
(6, 10, 8, 3, 'yess', '2024-11-28 20:50:51'),
(7, 12, 8, 3, 'hello\n', '2024-11-28 21:24:12'),
(8, 12, 3, 8, 'okay', '2024-11-28 21:24:21'),
(9, 11, 3, 8, 'can you low the cost ', '2024-11-29 00:09:57'),
(10, 11, 8, 3, 'yes..how much discount you want', '2024-11-29 00:10:19'),
(11, 11, 3, 8, '1500', '2024-11-29 00:10:38'),
(12, 11, 8, 3, 'okay', '2024-11-29 00:10:45'),
(13, 11, 3, 8, 'okay', '2024-11-29 00:13:01'),
(14, 11, 8, 3, 'okay', '2024-11-29 00:13:20'),
(15, 10, 3, 8, 'ty', '2024-11-29 04:40:08'),
(16, 13, 1, 8, 'hii', '2024-11-29 18:05:21'),
(17, 13, 8, 1, 'hey', '2024-11-29 18:05:36'),
(18, 13, 1, 8, 'can you give discount', '2024-11-29 18:05:47'),
(19, 13, 8, 1, 'yes you we can', '2024-11-29 18:06:14'),
(20, 13, 1, 8, 'thank you', '2024-11-29 18:06:22'),
(21, 13, 8, 1, 'discount will be available after the bill generated', '2024-11-29 18:07:01'),
(22, 13, 1, 8, 'oh okay', '2024-11-29 18:07:07'),
(23, 14, 12, 8, 'hey kid\n', '2024-12-06 19:48:41'),
(24, 14, 8, 12, 'jii joker', '2024-12-06 19:48:56'),
(25, 14, 12, 8, 'give me a discount', '2024-12-06 19:49:25'),
(26, 14, 8, 12, 'no way', '2024-12-06 19:49:35'),
(27, 14, 12, 8, 'please sir\n', '2024-12-06 19:49:51'),
(28, 14, 8, 12, 'okay ill give you $1 discount', '2024-12-06 19:50:13'),
(29, 14, 12, 8, 'screw you\n', '2024-12-06 19:50:24');

-- --------------------------------------------------------

--
-- Table structure for table `images`
--

CREATE TABLE `images` (
  `image_id` int(11) NOT NULL,
  `request_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `images`
--

INSERT INTO `images` (`image_id`, `request_id`, `image_url`) VALUES
(1, 1, 'uploads\\1731910283110-pothole-1.jpg'),
(2, 2, 'uploads\\1731910336211-pothole-1.jpg'),
(3, 2, 'uploads\\1731910336211-cracked-concrete-driveways-nz-8-1024x683.webp'),
(4, 3, 'uploads\\1731910896673-cracked-concrete-driveways-nz-8-1024x683.webp'),
(5, 4, 'uploads\\1732548789355-pothole-1.jpg'),
(6, 5, 'uploads\\1732549332369-pothole-1.jpg'),
(7, 5, 'uploads\\1732549332371-cracked-concrete-driveways-nz-8-1024x683.webp'),
(8, 5, 'uploads\\1732549332376-wizarding-world-portrait.png'),
(9, 6, 'uploads\\1732550309444-wizarding-world-portrait.png'),
(10, 7, 'uploads\\1732553626401-download.jpeg'),
(11, 8, 'uploads\\1732627433947-pothole-1.jpg'),
(12, 8, 'uploads\\1732627433948-cracked-concrete-driveways-nz-8-1024x683.webp'),
(13, 9, 'uploads\\1732902616643-download.jpg'),
(14, 9, 'uploads\\1732902616650-images (1).jpg'),
(15, 9, 'uploads\\1732902616651-images.jpg'),
(16, 10, 'uploads\\1733513688907-43188945_l-1024x683.webp'),
(17, 11, 'uploads\\1733523156122-download.jpg'),
(18, 12, 'uploads\\1733523157325-paving-repair-Toronto.jpg'),
(19, 13, 'uploads\\1733525977714-cracked-driveway.jpg'),
(20, 14, 'uploads\\1733526382566-sinkholes.jpg'),
(21, 15, 'uploads\\1733526732821-cracks.jpg'),
(22, 16, 'uploads\\1733527369756-driveway sealing.jpeg'),
(23, 17, 'uploads\\1733527566619-driveway sealing.jpeg'),
(24, 18, 'uploads\\1733527703179-holes and cracks.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `orderofwork`
--

CREATE TABLE `orderofwork` (
  `order_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `accepted_date` datetime NOT NULL,
  `status` enum('In Progress','Completed','Cancelled') DEFAULT 'In Progress',
  `is_deleted` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orderofwork`
--

INSERT INTO `orderofwork` (`order_id`, `request_id`, `accepted_date`, `status`, `is_deleted`) VALUES
(8, 8, '2024-11-29 17:54:25', 'In Progress', 0),
(9, 7, '2024-11-26 16:51:43', 'Completed', 0),
(10, 6, '2024-11-26 21:16:53', 'Completed', 0),
(11, 5, '2024-11-29 00:07:57', 'In Progress', 0),
(12, 2, '2024-11-28 21:22:23', 'In Progress', 0),
(13, 9, '2024-11-29 18:00:27', 'In Progress', 1),
(14, 10, '2024-12-06 19:35:06', 'Completed', 0),
(15, 11, '2024-12-06 22:13:31', 'In Progress', 0),
(16, 12, '2024-12-06 22:13:32', 'In Progress', 0),
(17, 18, '2024-12-08 04:24:55', 'In Progress', 0),
(18, 17, '2024-12-08 04:24:56', 'In Progress', 0),
(19, 16, '2024-12-08 04:24:56', 'In Progress', 0),
(20, 15, '2024-12-08 04:24:57', 'In Progress', 0),
(21, 20, '2024-12-08 19:04:15', 'In Progress', 0),
(22, 19, '2024-12-08 19:04:24', 'In Progress', 0);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `bill_id` int(11) NOT NULL,
  `payment_date` date NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `card_number` varchar(255) NOT NULL,
  `card_expiry` varchar(5) NOT NULL,
  `card_cvc` varchar(4) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `bill_id`, `payment_date`, `amount`, `user_id`, `card_number`, `card_expiry`, `card_cvc`, `payment_status`, `payment_method`, `transaction_id`) VALUES
(1, 1, '2024-11-29', 1100.00, 3, '2342234123423542', '22/23', '234', 'successful', 'card', 'TX-173286353290-bno7tq9k'),
(2, 2, '2024-11-29', 330000.00, 3, '2342234123423542', '0000-', '234', 'successful', 'card', 'TX-1732863927690-bno7tq9k'),
(3, 3, '2024-11-29', 399556.00, 3, '2342234123423542', '0000-', '234', 'successful', 'card', 'TX-1732864746552-wwo99vtn'),
(4, 3, '2024-11-29', 399556.00, 3, '2342234123423542', '0000-', '232', 'successful', 'card', 'TX-1732864947856-4bjkz0w5'),
(5, 4, '2024-12-03', 11000.00, 1, '3294819273648721', '0000-', '222', 'successful', 'card', 'TX-1732903756297-si06t1sc'),
(6, 2, '2024-12-06', 330000.00, 3, '2342234123423542', '23/34', '234', 'successful', 'card', 'TX-1733512829029-be8ibv3n'),
(7, 5, '2024-12-06', 69999.00, 12, '123456789012345', '0939', '123', 'successful', 'card', 'TX-1733514691430-x5g5p5v2');

-- --------------------------------------------------------

--
-- Table structure for table `quoteresponse`
--

CREATE TABLE `quoteresponse` (
  `response_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `counter_price` decimal(10,2) DEFAULT NULL,
  `time_window_start` date DEFAULT NULL,
  `time_window_end` date DEFAULT NULL,
  `response_note` text DEFAULT NULL,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quoteresponse`
--

INSERT INTO `quoteresponse` (`response_id`, `request_id`, `counter_price`, `time_window_start`, `time_window_end`, `response_note`, `status`) VALUES
(1, 2, 1200.00, '2024-11-12', '2024-11-27', 'DER', 'Accepted'),
(2, 7, 333333.00, '2024-11-28', '2024-12-10', 'new', 'Accepted'),
(4, 6, 400000.00, '2024-11-20', '2024-11-30', 'final\n\nupdated after request', 'Accepted'),
(5, 5, 300000.00, '2024-11-29', '2024-11-30', 'new', 'Rejected'),
(6, 9, 13000.00, '2024-12-06', '2024-12-11', 'new price', 'Accepted'),
(7, 10, 70000.00, '2024-12-26', '2025-01-11', 'price', 'Accepted'),
(8, 11, 126531.00, '2024-12-27', '2025-01-11', 'asd', 'Accepted'),
(9, 12, 12000.00, '2024-12-12', '2024-12-28', 'new', 'Accepted');

-- --------------------------------------------------------

--
-- Table structure for table `requestforquote`
--

CREATE TABLE `requestforquote` (
  `request_id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL,
  `owned_by` int(11) NOT NULL,
  `property_address` text NOT NULL,
  `square_feet` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `urgency` enum('Low','Medium','High') NOT NULL,
  `status` enum('Pending','Rejected','Accepted') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requestforquote`
--

INSERT INTO `requestforquote` (`request_id`, `client_id`, `service_id`, `owned_by`, `property_address`, `square_feet`, `note`, `urgency`, `status`, `created_at`, `updated_at`, `is_deleted`) VALUES
(1, 3, 1, 0, 'sa', 300, 'note', 'Low', '', '2024-11-18 06:11:23', '2024-12-08 02:09:16', 1),
(2, 3, 1, 8, 'sa', 1200, 'note', 'Low', '', '2024-11-18 06:12:16', '2024-12-06 22:04:07', 0),
(3, 3, 1, 0, 'ADS', 344, 'note', 'Low', '', '2024-11-18 06:21:36', '2024-12-08 02:09:22', 1),
(4, 3, 1, 0, 'awefvawd', 1000, 'awefvawd', 'High', 'Pending', '2024-11-25 15:33:09', '2024-12-08 02:09:26', 0),
(5, 3, 1, 8, 'wqeqd', 1000, 'wqeqd', 'Medium', 'Pending', '2024-11-25 15:42:12', '2024-12-08 02:09:30', 0),
(6, 3, 1, 8, 'af', 1000, 'af', 'Low', 'Pending', '2024-11-25 15:58:29', '2024-12-08 03:07:14', 0),
(7, 3, 1, 8, 'sf', 0, 'sf', 'Low', 'Pending', '2024-11-25 16:53:46', '2024-11-26 16:51:43', 0),
(8, 1, 1, 9, 'hole', 0, 'hole', 'High', 'Pending', '2024-11-26 13:23:53', '2024-11-29 17:54:25', 0),
(9, 1, 7, 0, 'regrav', 0, 'regrav', 'High', 'Pending', '2024-11-29 17:50:16', '2024-12-06 22:13:01', 0),
(10, 12, 1, 8, 'cracks on drive way', 1000, 'cracks on drive way', 'Medium', 'Pending', '2024-12-06 19:34:49', '2024-12-08 03:07:02', 0),
(11, 3, 6, 8, 'detroit', 2342, 'cracks', 'Medium', 'Pending', '2024-12-06 22:12:36', '2024-12-08 19:47:16', 0),
(12, 11, 1, 8, 'royal oak', 2342, 'holes and cracks', 'High', 'Pending', '2024-12-06 22:12:38', '2024-12-08 19:47:33', 0),
(13, 13, 8, 0, 'cracks in driveway', 2342, 'cracks in driveway', 'Medium', 'Pending', '2024-12-06 22:59:38', '2024-12-08 03:06:05', 0),
(14, 14, 1, 0, 'holes ', 3452, 'holes ', 'Medium', 'Pending', '2024-12-06 23:06:22', '2024-12-06 23:06:22', 0),
(15, 15, 1, 8, 'cracks and pits in driveway', 33, 'cracks and pits in driveway', 'Low', 'Pending', '2024-12-06 23:12:13', '2024-12-08 04:24:57', 0),
(16, 16, 1, 8, 'driveway sealing', 454, 'driveway sealing', 'High', 'Pending', '2024-12-06 23:22:50', '2024-12-08 04:24:56', 0),
(17, 11, 1, 8, 'sealing', 238, 'sealing', 'Medium', 'Pending', '2024-12-06 23:26:07', '2024-12-08 04:24:56', 0),
(18, 11, 1, 8, 'small holes and cracks', 33, 'small holes and cracks', 'Low', 'Pending', '2024-12-06 23:28:24', '2024-12-08 04:24:55', 0),
(19, 16, 1, 8, 'cracking and sealing', 89, 'cracking and sealing', 'Medium', 'Pending', '2024-12-08 18:45:47', '2024-12-08 19:04:24', 0),
(20, 16, 1, 8, 'sealing', 342, 'sealing', 'High', 'Pending', '2024-12-08 18:46:14', '2024-12-08 19:04:15', 0);

-- --------------------------------------------------------

--
-- Table structure for table `service_types`
--

CREATE TABLE `service_types` (
  `service_id` int(11) NOT NULL,
  `service_name` varchar(50) NOT NULL,
  `proposed_price` decimal(10,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_types`
--

INSERT INTO `service_types` (`service_id`, `service_name`, `proposed_price`) VALUES
(1, 'Driveway Sealing', 7000),
(2, 'Crack Repair', 5000),
(3, 'Pothole Filling', 7000),
(4, 'Resurfacing', 10000),
(5, 'Pressure Washing', 8000),
(6, 'Driveway Cleaning', 4000),
(7, 'Regraveling', 15000),
(8, 'Seal Coating', 10000),
(9, 'Other', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `credit_card` varchar(100) NOT NULL,
  `registration_date` datetime NOT NULL,
  `last_sign_in` datetime NOT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `locked` tinyint(1) DEFAULT 0,
  `user_type` int(11) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `phone`, `email`, `password`, `address`, `credit_card`, `registration_date`, `last_sign_in`, `failed_attempts`, `locked`, `user_type`, `is_deleted`) VALUES
(1, 'Arun', 'T', '3136397215', 'arunramkrishna997@gmail.com', '$2b$10$HCU/BZhiwwVh4p1yW8MP7ufc0ie89gG2oDUGnGED4fIt5jAKGFYjy', 'University Tower, 4500, Cass Avenue, Midtown, Detroit, Wayne County, Michigan, 48201, United States', '3294819273648721', '2024-11-11 17:21:01', '2024-11-29 19:33:58', 0, 0, 3, 0),
(2, 'as', 'as', '372461824', 'asas@gmail.co', '$2b$10$vr41rjxNMOWBAWRDuhw8c.HcrTjoNSdYekLQxXMZDUU85CgtjkJR.', 'Ads, Fourth Estate, San Antonio, Parañaque, Southern Manila District, Metro Manila, 1700, Philippines', '', '2024-11-11 17:22:27', '2024-11-11 17:22:27', 0, 0, 0, 0),
(3, 'lion', 'king', '3136397215', 'lion@gmail.com', '$2b$10$Ymh7pd61XujSkYMMuObxguh5k2FA5qhsOmQVw4Mye9at9kHQW2kkS', 'University Tower, 4500, Cass Avenue, Midtown, Detroit, Wayne County, Michigan, 48201, United States', '2342234123423542', '2024-11-11 17:48:19', '2024-12-08 19:34:46', 0, 0, 3, 0),
(4, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkrishna997@gmail.co', '$2b$10$g58EdAIl3C4w9D0Jog6.JOmJR6jwlDLidk4o6LvQdqv7dPprH9.sO', 'Ligne 15 Ouest, Avenue Laurent Cély, Les Grésillons, Gennevilliers, Arrondissement of Nanterre, Hauts-de-Seine, Ile-de-France, Metropolitan France, 92230, France', '', '2024-11-11 17:50:46', '2024-11-11 17:50:46', 0, 0, 0, 0),
(5, 'Arun', 'Thangapalam', '+918072087295', 'arunramkrishna997@il.com', '$2b$10$/npe8TYpeCpKzq3lkGN5buJV9YnV/SGIjM5WVmjOQueIw1ymFWEUa', '15 3/10 Road, Mesa County, Colorado, United States', '', '2024-11-11 19:17:26', '2024-11-11 19:17:26', 0, 0, 0, 0),
(6, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkris997@gmail.com', '$2b$10$pk2W7hVT58tgCVmrTQDuHeAKbhpXiKNtvKbo4K.46/C5hd0owi5S6', '15-3-60', '', '2024-11-18 01:21:07', '2024-11-18 01:21:07', 0, 0, 3, 0),
(7, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkri997@gmail.com', '$2b$10$lPtla4OBTrmcF..wVHvpxORT.qUY9Y4SmpXEmat4k1LcH2KUy99nC', '15-3-60', '', '2024-11-18 01:21:20', '2024-11-18 01:21:20', 0, 0, 3, 0),
(8, 'David', 'Smith', '3452435234', 'joker@gmail.com', '$2b$10$xb2OBsFuzJbQnVH2NPUNJOvUFFpSXUq8MQorflpE4wn6jU2EdP.ee', '4500 fass ave madras', '', '2024-11-26 13:17:49', '2024-12-08 20:33:39', 0, 0, 2, 0),
(9, 'ani', 'ru', '34532424', 'ani@gmail.com', '$2b$10$4ri/2yR9CXlUfmVmDg517.jdANZwavaUVTUmmjuk3Q339qstRKtCO', '456 dsfg ert', '', '2024-11-26 15:10:36', '2024-11-29 17:53:34', 0, 0, 2, 0),
(10, 'Emma', 'werson', '13134557867', 'emma@234gmail.com', '$2b$10$Nb7tXua0LQmIj3pdRBSSh.mefUgus3BVtBS4N1Ja5IHDjRo5.99Aq', '5673 cass', '', '2024-12-06 19:23:21', '2024-12-06 19:25:13', 3, 0, 2, 0),
(11, 'ame', 'kirson', '13134557999', 'ema@234gmail.com', '$2b$10$hCK46zxn2OQJ5f.l0neFTuXUA9/6qmHMEuPlqr6q5z9ETM5TmUVLi', '5673 cass ', '456789012345', '2024-12-06 19:26:50', '2024-12-08 19:37:42', 0, 0, 3, 0),
(12, 'ame', 'kirson', '13134557999', 'ame@1234gmail.com', '$2b$10$UVkbyHiaSvpYdEwAs5I6ruEqXlagpYkfxE2Ka/c9CnbeJ.RjF7/8a', '5673 cass', '123456789012345', '2024-12-06 19:28:47', '2024-12-06 19:29:16', 0, 0, 3, 0),
(13, 'tom', 'webster', '+1 989 765 4567', 'webster@345gmail.com', '$2b$10$ljWp9zHntWB0aAN3tzQR.uBZoiH6KR6FxAJcEPpS3S55rEezC5tSq', '6789 lenova lane', '890078652345', '2024-12-06 22:42:11', '2024-12-06 22:42:55', 0, 0, 3, 0),
(14, 'sam', 'jose', '+1 9198796788', 'sam@gmail.com', '$2b$10$z6SXzMYtkx1FOslTWH8VNeS2pn0yxM7ctLnpwBBJuoNEGmqiyrYW.', '2345 hans lane', '', '2024-12-06 23:03:23', '2024-12-06 23:03:55', 0, 0, 3, 0),
(15, 'luke', 'jackson', '+1517 678 5643', 'luke@517gmail.com', '$2b$10$sVNkDZD0BuAjrYHPlWKJte3YlYt7yuuLEANIQAysK7quEAfGLo9LO', '5172 kanes city', '456789012345', '2024-12-06 23:08:32', '2024-12-06 23:09:09', 0, 0, 3, 0),
(16, 'bheem', 'chota', '+1 2345678900', 'bheem@gmail.com', '$2b$10$XuNTZ8wseydqxZ7cELv.C.wH.geJ2IQHmfc3L4gVZDDfeeaz/LcGu', '4545 flyine ave', '5678876656689880', '2024-12-06 23:14:02', '2024-12-08 18:44:22', 0, 0, 3, 0);

-- --------------------------------------------------------

--
-- Table structure for table `user_login`
--

CREATE TABLE `user_login` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login_time` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('success','failure') NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_login`
--

INSERT INTO `user_login` (`id`, `user_id`, `login_time`, `status`, `ip_address`) VALUES
(1, 3, '2024-11-11 18:09:32', 'success', '::1'),
(2, 3, '2024-11-11 18:09:53', 'success', '::1'),
(3, 3, '2024-11-11 18:11:22', 'success', '::1'),
(4, 3, '2024-11-11 18:27:17', 'success', '::1'),
(5, 3, '2024-11-11 19:22:45', 'success', '::1'),
(6, 3, '2024-11-11 23:21:07', 'success', '::ffff:35.16.59.60'),
(7, 3, '2024-11-17 07:16:12', 'success', '::1'),
(8, 3, '2024-11-17 07:32:57', 'success', '::1'),
(9, 3, '2024-11-17 07:42:25', 'success', '::1'),
(10, 3, '2024-11-18 00:14:43', 'success', '::1'),
(11, 3, '2024-11-18 01:26:18', 'success', '::1'),
(12, 3, '2024-11-18 01:27:21', 'success', '::1'),
(13, 3, '2024-11-18 01:40:05', 'success', '::1'),
(14, 3, '2024-11-18 01:42:23', 'success', '::1'),
(15, 3, '2024-11-18 01:48:34', 'success', '::1'),
(16, 3, '2024-11-18 01:49:32', 'success', '::1'),
(17, 3, '2024-11-18 01:49:59', 'success', '::1'),
(18, 3, '2024-11-18 01:54:00', 'success', '::1'),
(19, 3, '2024-11-18 01:59:54', 'success', '::1'),
(20, 3, '2024-11-18 02:23:58', 'failure', '::1'),
(21, 3, '2024-11-18 02:23:59', 'failure', '::1'),
(22, 3, '2024-11-18 02:24:09', 'success', '::1'),
(23, 3, '2024-11-18 02:25:39', 'failure', '::1'),
(24, 3, '2024-11-18 02:26:10', 'failure', '::1'),
(25, 3, '2024-11-18 02:26:24', 'success', '::1'),
(26, 3, '2024-11-18 02:30:43', 'failure', '::1'),
(27, 3, '2024-11-18 02:30:49', 'failure', '::1'),
(28, 3, '2024-11-18 02:30:52', 'success', '::1'),
(29, 3, '2024-11-18 03:35:15', 'success', '::1'),
(30, 3, '2024-11-18 03:44:21', 'success', '::1'),
(31, 3, '2024-11-18 04:20:37', 'success', '::1'),
(32, 3, '2024-11-18 05:28:18', 'success', '::1'),
(33, 3, '2024-11-18 06:30:48', 'success', '::1'),
(34, 3, '2024-11-18 07:26:08', 'success', '::1'),
(35, 3, '2024-11-18 07:31:47', 'success', '::1'),
(36, 3, '2024-11-18 08:52:32', 'success', '::1'),
(37, 3, '2024-11-18 08:54:22', 'success', '::1'),
(38, 3, '2024-11-18 08:55:39', 'success', '::1'),
(39, 3, '2024-11-18 08:56:03', 'success', '::1'),
(40, 3, '2024-11-18 08:57:10', 'success', '::1'),
(41, 3, '2024-11-18 08:57:38', 'success', '::1'),
(42, 3, '2024-11-18 08:58:34', 'success', '::1'),
(43, 3, '2024-11-18 08:58:52', 'success', '::1'),
(44, 3, '2024-11-18 09:01:21', 'success', '::1'),
(45, 3, '2024-11-18 09:03:40', 'success', '::1'),
(46, 3, '2024-11-18 09:03:54', 'success', '::1'),
(47, 3, '2024-11-18 09:07:04', 'success', '::ffff:35.16.59.60'),
(48, 3, '2024-11-18 09:08:19', 'success', '::ffff:35.16.5.164'),
(49, 3, '2024-11-18 09:08:33', 'success', '::ffff:35.16.5.164'),
(50, 3, '2024-11-18 09:09:44', 'success', '::ffff:35.16.5.164'),
(51, 3, '2024-11-25 15:22:45', 'failure', '::ffff:141.217.210.187'),
(52, 3, '2024-11-25 15:22:53', 'success', '::ffff:141.217.210.187'),
(53, 3, '2024-11-25 16:29:52', 'success', '::ffff:141.217.210.187'),
(54, 3, '2024-11-25 16:32:12', 'success', '::ffff:141.217.210.187'),
(55, 3, '2024-11-25 17:32:36', 'failure', '::ffff:141.217.210.187'),
(56, 3, '2024-11-25 17:32:43', 'success', '::ffff:141.217.210.187'),
(57, 3, '2024-11-26 12:53:10', 'success', '::ffff:141.217.210.187'),
(58, 8, '2024-11-26 13:17:58', 'failure', '::ffff:141.217.210.187'),
(59, 8, '2024-11-26 13:18:05', 'success', '::ffff:141.217.210.187'),
(60, 1, '2024-11-26 13:19:15', 'success', '::ffff:141.217.210.187'),
(61, 1, '2024-11-26 13:20:38', 'success', '::ffff:141.217.210.187'),
(62, 1, '2024-11-26 13:21:19', 'success', '::ffff:141.217.210.187'),
(63, 8, '2024-11-26 13:24:33', 'success', '::ffff:141.217.210.187'),
(64, 8, '2024-11-26 14:26:10', 'failure', '::ffff:141.217.210.187'),
(65, 8, '2024-11-26 14:26:14', 'success', '::ffff:141.217.210.187'),
(66, 9, '2024-11-26 15:10:46', 'success', '::ffff:141.217.210.187'),
(67, 3, '2024-11-26 15:18:50', 'success', '::ffff:141.217.210.187'),
(68, 8, '2024-11-26 15:19:10', 'success', '::ffff:141.217.210.187'),
(69, 8, '2024-11-26 16:20:19', 'success', '::ffff:141.217.210.187'),
(70, 9, '2024-11-26 16:28:56', 'success', '::ffff:141.217.210.187'),
(71, 1, '2024-11-26 16:51:02', 'success', '::ffff:141.217.210.187'),
(72, 3, '2024-11-26 16:51:21', 'success', '::ffff:141.217.210.187'),
(73, 8, '2024-11-26 16:51:37', 'success', '::ffff:141.217.210.187'),
(74, 8, '2024-11-26 18:19:55', 'success', '::ffff:141.217.210.187'),
(75, 8, '2024-11-26 20:41:50', 'success', '::ffff:35.16.1.228'),
(76, 8, '2024-11-26 21:42:14', 'success', '::ffff:35.16.1.228'),
(77, 3, '2024-11-26 22:10:26', 'success', '::ffff:35.16.1.228'),
(78, 8, '2024-11-26 22:15:08', 'success', '::ffff:35.16.1.228'),
(79, 8, '2024-11-28 17:32:31', 'success', '::ffff:35.16.1.228'),
(80, 8, '2024-11-28 18:33:08', 'success', '::ffff:35.16.1.228'),
(81, 8, '2024-11-28 19:33:22', 'success', '::ffff:35.16.1.228'),
(82, 3, '2024-11-28 19:51:27', 'success', '::ffff:35.16.1.228'),
(83, 8, '2024-11-28 20:16:50', 'success', '::ffff:35.16.1.228'),
(84, 3, '2024-11-28 21:08:43', 'success', '::ffff:35.16.1.228'),
(85, 8, '2024-11-28 21:22:14', 'success', '::ffff:35.16.1.228'),
(86, 8, '2024-11-28 21:22:53', 'success', '::ffff:35.16.1.228'),
(87, 3, '2024-11-28 21:23:28', 'success', '::ffff:35.16.1.228'),
(88, 8, '2024-11-28 22:35:50', 'success', '::ffff:35.16.1.228'),
(89, 3, '2024-11-28 22:36:14', 'success', '::ffff:35.16.1.228'),
(90, 8, '2024-11-28 23:36:06', 'success', '::ffff:35.16.1.228'),
(91, 3, '2024-11-29 00:08:08', 'success', '::ffff:35.16.1.228'),
(92, 3, '2024-11-29 02:37:40', 'success', '::ffff:35.16.1.228'),
(93, 8, '2024-11-29 02:39:41', 'success', '::ffff:35.16.1.228'),
(94, 3, '2024-11-29 03:38:15', 'success', '::ffff:35.16.1.228'),
(95, 3, '2024-11-29 04:39:25', 'success', '::ffff:35.16.1.228'),
(96, 8, '2024-11-29 05:01:33', 'success', '::ffff:35.16.1.228'),
(97, 3, '2024-11-29 05:44:49', 'success', '::ffff:35.16.1.228'),
(98, 8, '2024-11-29 06:12:11', 'success', '::ffff:35.16.1.228'),
(99, 3, '2024-11-29 06:59:16', 'success', '::ffff:35.16.1.228'),
(100, 8, '2024-11-29 07:23:04', 'success', '::ffff:35.16.1.228'),
(101, 3, '2024-11-29 09:03:28', 'success', '::ffff:35.16.1.228'),
(102, 8, '2024-11-29 09:05:08', 'success', '::ffff:35.16.1.228'),
(103, 3, '2024-11-29 10:05:08', 'success', '::ffff:35.16.1.228'),
(104, 8, '2024-11-29 10:10:02', 'success', '::ffff:35.16.1.228'),
(105, 3, '2024-11-29 11:07:07', 'success', '::ffff:35.16.1.228'),
(106, 8, '2024-11-29 11:20:58', 'success', '::ffff:35.16.1.228'),
(107, 8, '2024-11-29 17:36:54', 'success', '::ffff:35.16.1.228'),
(108, 3, '2024-11-29 17:38:55', 'success', '::ffff:35.16.1.228'),
(109, 1, '2024-11-29 17:43:14', 'success', '::ffff:35.16.1.228'),
(110, 9, '2024-11-29 17:53:34', 'success', '::ffff:35.16.1.228'),
(111, 8, '2024-11-29 17:54:40', 'success', '::ffff:35.16.1.228'),
(112, 3, '2024-11-29 18:43:32', 'success', '::ffff:35.16.1.228'),
(113, 1, '2024-11-29 19:33:58', 'success', '::ffff:35.16.1.228'),
(114, 8, '2024-11-29 19:51:39', 'success', '::ffff:35.16.1.228'),
(115, 8, '2024-12-01 23:15:14', 'success', '::ffff:35.16.1.228'),
(116, 8, '2024-12-01 23:17:01', 'success', '::ffff:35.16.72.137'),
(117, 8, '2024-12-01 23:18:00', 'success', '::ffff:35.16.1.228'),
(118, 3, '2024-12-02 20:24:50', 'success', '::ffff:35.16.81.183'),
(119, 8, '2024-12-02 20:25:47', 'success', '::ffff:35.16.81.183'),
(120, 3, '2024-12-02 20:26:28', 'success', '::ffff:35.16.81.183'),
(121, 8, '2024-12-06 19:16:22', 'success', '::ffff:35.16.81.183'),
(122, 3, '2024-12-06 19:16:32', 'success', '::ffff:35.16.81.183'),
(123, 10, '2024-12-06 19:24:53', 'failure', '::ffff:35.16.70.116'),
(124, 10, '2024-12-06 19:25:01', 'failure', '::ffff:35.16.70.116'),
(125, 10, '2024-12-06 19:25:13', 'failure', '::ffff:35.16.70.116'),
(126, 12, '2024-12-06 19:29:02', 'failure', '::ffff:35.16.70.116'),
(127, 12, '2024-12-06 19:29:16', 'success', '::ffff:35.16.70.116'),
(128, 8, '2024-12-06 20:16:32', 'success', '::ffff:35.16.81.183'),
(129, 8, '2024-12-06 21:29:45', 'success', '::ffff:35.16.81.183'),
(130, 3, '2024-12-06 21:51:51', 'success', '::ffff:35.16.81.183'),
(131, 11, '2024-12-06 22:02:18', 'success', '::ffff:35.16.70.116'),
(132, 8, '2024-12-06 22:38:34', 'success', '::ffff:35.16.81.183'),
(133, 13, '2024-12-06 22:42:55', 'success', '::ffff:35.16.70.116'),
(134, 14, '2024-12-06 23:03:55', 'success', '::ffff:35.16.70.116'),
(135, 15, '2024-12-06 23:09:09', 'success', '::ffff:35.16.70.116'),
(136, 16, '2024-12-06 23:14:29', 'success', '::ffff:35.16.70.116'),
(137, 11, '2024-12-06 23:24:17', 'success', '::ffff:35.16.70.116'),
(138, 11, '2024-12-06 23:26:29', 'success', '::ffff:35.16.70.116'),
(139, 8, '2024-12-06 23:43:41', 'success', '::ffff:35.16.81.183'),
(140, 3, '2024-12-07 22:53:36', 'success', '::ffff:35.16.81.183'),
(141, 8, '2024-12-07 22:53:51', 'success', '::ffff:35.16.81.183'),
(142, 8, '2024-12-07 23:09:38', 'success', '::ffff:35.16.81.183'),
(143, 3, '2024-12-08 00:08:50', 'success', '::ffff:35.16.81.183'),
(144, 8, '2024-12-08 00:14:18', 'success', '::ffff:35.16.81.183'),
(145, 8, '2024-12-08 01:51:35', 'success', '::ffff:35.16.81.183'),
(146, 3, '2024-12-08 02:45:17', 'success', '::ffff:35.16.81.183'),
(147, 8, '2024-12-08 02:52:26', 'success', '::ffff:35.16.81.183'),
(148, 8, '2024-12-08 03:54:54', 'success', '::ffff:35.16.81.183'),
(149, 8, '2024-12-08 18:11:07', 'success', '::ffff:35.16.81.183'),
(150, 11, '2024-12-08 18:11:28', 'success', '::ffff:35.16.93.219'),
(151, 16, '2024-12-08 18:44:22', 'success', '::ffff:35.16.93.219'),
(152, 11, '2024-12-08 18:47:11', 'success', '::ffff:35.16.93.219'),
(153, 8, '2024-12-08 18:50:41', 'success', '::ffff:35.16.81.183'),
(154, 8, '2024-12-08 19:32:43', 'success', '::ffff:35.16.81.183'),
(155, 3, '2024-12-08 19:32:57', 'success', '::ffff:35.16.81.183'),
(156, 3, '2024-12-08 19:34:46', 'success', '::ffff:35.16.81.183'),
(157, 11, '2024-12-08 19:37:42', 'success', '::ffff:35.16.93.219'),
(158, 8, '2024-12-08 19:38:16', 'failure', '::ffff:35.16.93.219'),
(159, 8, '2024-12-08 19:38:25', 'success', '::ffff:35.16.93.219'),
(160, 8, '2024-12-08 20:33:39', 'success', '::ffff:35.16.81.183');

-- --------------------------------------------------------

--
-- Table structure for table `user_type`
--

CREATE TABLE `user_type` (
  `user_type_id` int(11) NOT NULL,
  `user_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_type`
--

INSERT INTO `user_type` (`user_type_id`, `user_type`) VALUES
(1, 'Admin'),
(2, 'Contractor'),
(3, 'Client');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`bill_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`chat_id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `images`
--
ALTER TABLE `images`
  ADD PRIMARY KEY (`image_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `orderofwork`
--
ALTER TABLE `orderofwork`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `bill_id` (`bill_id`);

--
-- Indexes for table `quoteresponse`
--
ALTER TABLE `quoteresponse`
  ADD PRIMARY KEY (`response_id`),
  ADD KEY `request_id` (`request_id`);

--
-- Indexes for table `requestforquote`
--
ALTER TABLE `requestforquote`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `service_types`
--
ALTER TABLE `service_types`
  ADD PRIMARY KEY (`service_id`),
  ADD UNIQUE KEY `service_name` (`service_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_login`
--
ALTER TABLE `user_login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `user_type`
--
ALTER TABLE `user_type`
  ADD PRIMARY KEY (`user_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `orderofwork`
--
ALTER TABLE `orderofwork`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `quoteresponse`
--
ALTER TABLE `quoteresponse`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `requestforquote`
--
ALTER TABLE `requestforquote`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `service_types`
--
ALTER TABLE `service_types`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `user_type`
--
ALTER TABLE `user_type`
  MODIFY `user_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bill`
--
ALTER TABLE `bill`
  ADD CONSTRAINT `bill_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orderofwork` (`order_id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orderofwork` (`order_id`);

--
-- Constraints for table `images`
--
ALTER TABLE `images`
  ADD CONSTRAINT `images_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requestforquote` (`request_id`);

--
-- Constraints for table `orderofwork`
--
ALTER TABLE `orderofwork`
  ADD CONSTRAINT `orderofwork_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requestforquote` (`request_id`) ON DELETE CASCADE;

--
-- Constraints for table `payment`
--
ALTER TABLE `payment`
  ADD CONSTRAINT `payment_ibfk_1` FOREIGN KEY (`bill_id`) REFERENCES `bill` (`bill_id`) ON DELETE CASCADE;

--
-- Constraints for table `quoteresponse`
--
ALTER TABLE `quoteresponse`
  ADD CONSTRAINT `quoteresponse_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `requestforquote` (`request_id`) ON DELETE CASCADE;

--
-- Constraints for table `requestforquote`
--
ALTER TABLE `requestforquote`
  ADD CONSTRAINT `requestforquote_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
