-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2024 at 01:04 PM
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
(1, 12, 1100.00, 100, '2024-11-28', '2024-11-30', 'Disputed', 'noo', 'yess'),
(2, 9, 330000.00, 3333, '2024-11-28', '2024-12-06', 'Resolved', 'i want to less the price more', 'cant'),
(3, 10, 399556.00, 444, '2024-11-28', '2024-12-26', 'Paid', NULL, '');

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
(15, 10, 3, 8, 'ty', '2024-11-29 04:40:08');

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
(12, 8, 'uploads\\1732627433948-cracked-concrete-driveways-nz-8-1024x683.webp');

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
(8, 8, '2024-11-26 16:50:46', 'In Progress', 0),
(9, 7, '2024-11-26 16:51:43', 'Completed', 0),
(10, 6, '2024-11-26 21:16:53', 'In Progress', 0),
(11, 5, '2024-11-29 00:07:57', 'In Progress', 0),
(12, 2, '2024-11-28 21:22:23', 'In Progress', 0);

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
  `card_expiry` date NOT NULL,
  `card_cvc` varchar(4) NOT NULL,
  `payment_status` varchar(50) NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  `transaction_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `bill_id`, `payment_date`, `amount`, `user_id`, `card_number`, `card_expiry`, `card_cvc`, `payment_status`, `payment_method`, `transaction_id`) VALUES
(1, 1, '2024-11-29', 1100.00, 3, '2342234123423542', '0000-00-00', '234', 'successful', 'card', 'TX-173286353290-bno7tq9k'),
(2, 2, '2024-11-29', 330000.00, 3, '2342234123423542', '0000-00-00', '234', 'successful', 'card', 'TX-1732863927690-bno7tq9k'),
(3, 3, '2024-11-29', 399556.00, 3, '2342234123423542', '0000-00-00', '234', 'successful', 'card', 'TX-1732864746552-wwo99vtn'),
(4, 3, '2024-11-29', 399556.00, 3, '2342234123423542', '0000-00-00', '232', 'successful', 'card', 'TX-1732864947856-4bjkz0w5');

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
(5, 5, 300000.00, '2024-11-29', '2024-11-30', 'new', 'Accepted');

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
(1, 3, 1, 0, 'sa', 0, 'note', 'Low', '', '2024-11-18 06:11:23', '2024-11-25 15:25:38', 1),
(2, 3, 1, 8, 'sa', 0, 'note', 'Low', '', '2024-11-18 06:12:16', '2024-11-28 21:22:23', 0),
(3, 3, 1, 0, 'ADS', 0, 'note', 'Low', '', '2024-11-18 06:21:36', '2024-11-25 17:25:24', 1),
(4, 3, 1, 0, 'awefvawd', 0, 'awefvawd', 'High', 'Pending', '2024-11-25 15:33:09', '2024-11-26 16:44:18', 0),
(5, 3, 1, 8, 'wqeqd', 0, 'wqeqd', 'Medium', 'Pending', '2024-11-25 15:42:12', '2024-11-29 00:07:57', 0),
(6, 3, 1, 8, 'af', 0, 'af', 'Low', 'Pending', '2024-11-25 15:58:29', '2024-11-26 21:16:53', 0),
(7, 3, 1, 8, 'sf', 0, 'sf', 'Low', 'Pending', '2024-11-25 16:53:46', '2024-11-26 16:51:43', 0),
(8, 1, 1, 9, 'hole', 0, 'hole', 'High', 'Pending', '2024-11-26 13:23:53', '2024-11-26 16:50:46', 0);

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
(1, 'Arun', 'T', '3136397215', 'arunramkrishna997@gmail.com', '$2b$10$HCU/BZhiwwVh4p1yW8MP7ufc0ie89gG2oDUGnGED4fIt5jAKGFYjy', 'University Tower, 4500, Cass Avenue, Midtown, Detroit, Wayne County, Michigan, 48201, United States', '', '2024-11-11 17:21:01', '2024-11-26 16:51:02', 0, 0, 3, 0),
(2, 'as', 'as', 'as', 'asas@gmail.co', '$2b$10$vr41rjxNMOWBAWRDuhw8c.HcrTjoNSdYekLQxXMZDUU85CgtjkJR.', 'Ads, Fourth Estate, San Antonio, Parañaque, Southern Manila District, Metro Manila, 1700, Philippines', '', '2024-11-11 17:22:27', '2024-11-11 17:22:27', 0, 0, 0, 0),
(3, 'lion', 'king', '3136397215', 'lion@gmail.com', '$2b$10$Ymh7pd61XujSkYMMuObxguh5k2FA5qhsOmQVw4Mye9at9kHQW2kkS', 'University Tower, 4500, Cass Avenue, Midtown, Detroit, Wayne County, Michigan, 48201, United States', '2342234123423542', '2024-11-11 17:48:19', '2024-11-29 11:07:07', 0, 0, 3, 0),
(4, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkrishna997@gmail.co', '$2b$10$g58EdAIl3C4w9D0Jog6.JOmJR6jwlDLidk4o6LvQdqv7dPprH9.sO', 'Ligne 15 Ouest, Avenue Laurent Cély, Les Grésillons, Gennevilliers, Arrondissement of Nanterre, Hauts-de-Seine, Ile-de-France, Metropolitan France, 92230, France', '', '2024-11-11 17:50:46', '2024-11-11 17:50:46', 0, 0, 0, 0),
(5, 'Arun', 'Thangapalam', '+918072087295', 'arunramkrishna997@il.com', '$2b$10$/npe8TYpeCpKzq3lkGN5buJV9YnV/SGIjM5WVmjOQueIw1ymFWEUa', '15 3/10 Road, Mesa County, Colorado, United States', '', '2024-11-11 19:17:26', '2024-11-11 19:17:26', 0, 0, 0, 0),
(6, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkris997@gmail.com', '$2b$10$pk2W7hVT58tgCVmrTQDuHeAKbhpXiKNtvKbo4K.46/C5hd0owi5S6', '15-3-60', '', '2024-11-18 01:21:07', '2024-11-18 01:21:07', 0, 0, 3, 0),
(7, 'Arun', 'Ramkrishna', '+918072087295', 'arunramkri997@gmail.com', '$2b$10$lPtla4OBTrmcF..wVHvpxORT.qUY9Y4SmpXEmat4k1LcH2KUy99nC', '15-3-60', '', '2024-11-18 01:21:20', '2024-11-18 01:21:20', 0, 0, 3, 0),
(8, 'Joker', 'folie', '3452435234', 'joker@gmail.com', '$2b$10$xb2OBsFuzJbQnVH2NPUNJOvUFFpSXUq8MQorflpE4wn6jU2EdP.ee', '4500 fass ave madras', '', '2024-11-26 13:17:49', '2024-11-29 11:20:58', 0, 0, 2, 0),
(9, 'ani', 'ru', '34532424', 'ani@gmail.com', '$2b$10$4ri/2yR9CXlUfmVmDg517.jdANZwavaUVTUmmjuk3Q339qstRKtCO', '456 dsfg ert', '', '2024-11-26 15:10:36', '2024-11-26 16:28:56', 0, 0, 2, 0);

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
(106, 8, '2024-11-29 11:20:58', 'success', '::ffff:35.16.1.228');

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
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `chat_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `images`
--
ALTER TABLE `images`
  MODIFY `image_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `orderofwork`
--
ALTER TABLE `orderofwork`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quoteresponse`
--
ALTER TABLE `quoteresponse`
  MODIFY `response_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `requestforquote`
--
ALTER TABLE `requestforquote`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `service_types`
--
ALTER TABLE `service_types`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=107;

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
