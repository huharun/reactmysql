-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 20, 2024 at 10:38 PM
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
-- Database: `project1`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `dob` date NOT NULL,
  `registration_date` datetime DEFAULT NULL,
  `last_sign_in` datetime DEFAULT NULL,
  `added_by` int(11) NOT NULL DEFAULT 0,
  `edited_by` int(11) DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password`, `salary`, `age`, `dob`, `registration_date`, `last_sign_in`, `added_by`, `edited_by`, `is_deleted`) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', 'password123', 50000.00, 30, '1994-05-15', '2024-10-13 00:00:00', '2024-10-13 08:00:00', 1, 1, 1),
(2, 'asd', '', '', '', 0.00, 0, '0000-00-00', '2024-10-14 00:00:00', '2024-10-14 01:58:06', 1, 1, 1),
(3, 'Arun', 'parker', 'hr9292@wayne.edu', 'Arunram@22', 23000.00, 24, '2024-10-13', '2024-10-14 00:00:00', '2024-10-14 02:01:00', 1, 1, 1),
(23, 'Arun', 'as', 'arun@whd.com', 'Wahdgu2136t1', 234213.00, 12, '2024-10-17', '2024-10-14 02:26:03', '2024-10-14 02:26:03', 1, 1, 1),
(25, '', '', 'hr9292@waye.edu', '', 0.00, 0, '0000-00-00', '2024-10-14 02:34:34', '2024-10-14 02:34:34', 1, 1, 1),
(26, '', '', 'hr9292@wayne.COM', '', 0.00, 0, '0000-00-00', '2024-10-14 02:38:10', '2024-10-14 02:38:10', 1, 1, 1),
(27, 'Arun', 'NEXT', 'hr9292@wayne.co', 'Swerty@23', 234234.00, 24, '0000-00-00', '2024-10-14 02:39:15', '2024-10-14 02:39:15', 1, 1, 1),
(28, 'der', 'iuwe', 'arun@whd.co', 'Swerty@3454', 234.00, 234, '2024-10-09', '2024-10-14 02:40:51', '2024-10-14 02:40:51', 1, 1, 1),
(29, 'asd', 'wer', 'hr9292@wayne.in', '@W213yefywe', 2454.00, 234, '2024-10-25', '2024-10-14 03:02:34', '2024-10-14 03:02:34', 1, 1, 1),
(30, 'venn', 'diag', 'baahu@wayne.com', 'A@aryds463', 234872.00, 234, '2024-09-30', '2024-10-14 03:10:26', '2024-10-14 03:10:26', 1, 1, 1),
(31, 'ater', 'rte', 'hr9292@wayne.ede', 'Awert@234', 23424.00, 245, '2024-10-03', '2024-10-14 03:19:29', '2024-10-14 03:19:29', 1, 1, 1),
(32, '', '', 'hr9292@wayne.edwe', '', 0.00, 0, '0000-00-00', '2024-10-14 03:20:38', '2024-10-14 03:20:38', 1, 1, 1),
(33, 'hasf', 'ergad', 'erg@gmail.com', 'Adiygaqd23@', 26000.00, 22, '2024-10-10', '2024-10-14 03:21:03', '2024-10-14 03:21:03', 1, 1, 1),
(34, 'Aryn', 'Ff', 'a@d.co', 'ff@sdr345A', 255.00, 258, '2024-10-15', '2024-10-14 17:46:17', '2024-10-14 17:46:17', 1, 1, 1),
(35, 'Aryn', 'FfAS', 'y@red.com', 'ff@sdr345A', 255.00, 258, '2024-10-15', '2024-10-14 17:46:41', '2024-10-14 17:46:41', 1, 1, 1),
(36, 'Aryn', 'F', 'yrt@re.com', 'ff@sdr345A', 25500.00, 25800, '2024-10-15', '2024-10-14 17:46:54', '2024-10-14 17:46:54', 1, 1, 1),
(37, 'asd', 'asd', 'arunramkra997@gmail.com', '55ac28784cf6', 23784.00, 234, '2024-10-25', '2024-10-14 19:39:34', '2024-10-14 19:39:34', 1, 1, 1),
(38, 'Arun', 't', 'arunramkrishna997@gmail.com', '6b98ca506208', 23.00, 24, '2024-10-10', '2024-10-14 20:18:50', '2024-10-14 20:18:50', 1, 1, 1),
(39, 'folie', 'de', 'foli@gmail.com', 'Joker@2024', 23423.00, 23, '2024-10-09', '2024-10-14 20:37:40', '2024-10-14 20:37:40', 1, 1, 0),
(40, 'lion', 'king', 'lion@gmail.com', '05894b49b03a31dd12fe842a3db4be5cf588789a15d6dab16eb21e555003a690', 2342.00, 23, '2024-10-10', '2024-10-14 20:39:21', '2024-10-20 20:18:16', 1, 1, 0),
(41, 'mark', 'mama', 'man@gmail.co', 'dbde24135c49dde0d9ce8fc33d2eb839a7415746ec24093f2845b4024d53037d', 132400.00, 3400, '2024-10-11', '2024-10-14 21:47:19', '2024-10-14 21:47:19', 1, 1, 0),
(42, 'Arun', 'Ram', 'arunramkrishna997@gmail.co', '0648644a29ab1ce528a76de8e85c2d88179441617f17392f919923e8827d4643', 234.00, 234, '2024-10-18', '2024-10-16 23:02:41', '2024-10-16 23:02:41', 1, 1, 0),
(43, '', '', 'ar@qwe.co', '18ee24150dcb1d96752a4d6dd0f20dfd8ba8c38527e40aa8509b7adecf78f9c6', 0.00, 0, '0000-00-00', '2024-10-18 15:07:56', '2024-10-18 15:07:56', 1, 1, 1),
(44, 'Arun', 'R', 'arunramkris97@gmail.com', '680f76ed96b32ede9b98ca6b474e270fbba105462f6cc80a43873cac382bc7ac', 679.00, 946, '2024-10-10', '2024-10-18 15:09:45', '2024-10-18 15:09:45', 1, 1, 1),
(45, 'baahubali', '', 'arunramkr97@gmail.com', 'cba911cf9f5f9f1ddf14275777dd7ceec8fbedaf67d5d0080be8e1b6f5b20ebf', 234.00, 234, '2024-10-08', '2024-10-18 15:16:57', '2024-10-18 15:16:57', 1, 40, 0),
(46, 'Arun', 'Thangapalam', 'arunramkrishna997@il.com', '55017ffa4e56d5591f61b54d8560fddabd0c926762fad285d20c6bdc3031e327', 24.00, 3450000, '2024-10-10', '2024-10-18 16:57:22', '2024-10-18 16:57:22', 1, 40, 0),
(47, 'Te', 'De', 'tede@gmail.com', '800350c84e4600a140307cb40d907580d0ff28c0bc2c8d198218d532e98001cb', 21884.00, 52, '2024-10-02', '2024-10-18 19:22:10', '2024-10-18 19:22:10', 1, 40, 1),
(48, 'sreddy', 'Bethelly', 'hs3571@wayne.edu', '26614c6623ea9a1a48da17869d8bda3420bccf3adf5b8a5a044f6fc2e341390a', 140000.00, 23, '2019-01-18', '2024-10-18 19:22:54', '2024-10-18 19:22:54', 1, 1, 0),
(49, 'Arun', 'err', 'arunra@gmail.com', '9b293ce2653829ee2f345356226670d89ed18f40481dd06dfacb526aee3760c2', 524.00, 45, '2024-10-02', '2024-10-20 00:15:44', '2024-10-20 00:15:44', 1, 40, 0),
(50, 'Hey', '', 'asd@gmail.com', 'f4bf9f7fcbedaba0392f108c59d8f4a38b3838efb64877380171b54475c2ade8', 200.00, 20, '0000-00-00', '2024-10-20 00:58:48', '2024-10-20 00:58:48', 1, 40, 0),
(51, 'Arun', 'Thangapalam', 'asd@qd.co', 'fdbeaaf217830f66e628af90a7d3c9d877424145b04ee8f79a9bf6f5c0469fa3', 234.00, 234, '2024-10-01', '2024-10-20 02:43:06', '2024-10-20 02:43:06', 1, 40, 1);

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
(1, 1, '2024-10-14 10:20:30', 'success', '192.168.1.1'),
(2, 40, '2024-10-14 23:43:02', 'failure', '::ffff:35.16.20.72'),
(3, 40, '2024-10-14 23:44:32', 'failure', '::ffff:35.16.20.72'),
(4, 40, '2024-10-14 23:44:49', 'failure', '::ffff:35.16.20.72'),
(5, 40, '2024-10-14 23:46:03', 'failure', '::ffff:35.16.20.72'),
(6, 40, '2024-10-14 23:46:11', 'success', '::ffff:35.16.20.72'),
(7, 40, '2024-10-14 23:51:44', 'success', '::ffff:35.16.20.72'),
(8, 40, '2024-10-14 23:52:07', 'success', '::ffff:35.16.20.72'),
(9, 3, '2024-10-17 21:47:47', 'failure', '::ffff:35.16.20.72'),
(10, 40, '2024-10-17 21:48:00', 'success', '::ffff:35.16.20.72'),
(11, 40, '2024-10-18 15:17:35', 'success', '::ffff:141.217.210.187'),
(12, 40, '2024-10-18 15:17:49', 'failure', '::ffff:141.217.210.187'),
(13, 40, '2024-10-18 15:26:48', 'success', '::ffff:35.16.5.164'),
(14, 40, '2024-10-18 16:57:37', 'success', '::ffff:35.16.20.72'),
(15, 48, '2024-10-18 19:23:19', 'success', '::ffff:35.16.67.200'),
(16, 40, '2024-10-19 18:53:39', 'success', '::ffff:35.16.20.72'),
(17, 40, '2024-10-19 18:54:00', 'success', '::ffff:35.16.20.72'),
(18, 40, '2024-10-19 19:19:05', 'success', '::ffff:35.16.20.72'),
(19, 40, '2024-10-19 19:20:59', 'success', '::ffff:35.16.20.72'),
(20, 40, '2024-10-19 19:25:33', 'success', '::ffff:35.16.20.72'),
(21, 40, '2024-10-19 20:07:47', 'success', '::ffff:35.16.20.72'),
(22, 40, '2024-10-19 20:09:04', 'success', '::ffff:35.16.20.72'),
(23, 40, '2024-10-19 20:09:45', 'success', '::ffff:35.16.20.72'),
(24, 40, '2024-10-19 20:16:06', 'success', '::ffff:35.16.20.72'),
(25, 40, '2024-10-19 20:22:17', 'success', '::ffff:35.16.20.72'),
(26, 40, '2024-10-19 20:22:34', 'success', '::ffff:35.16.20.72'),
(27, 40, '2024-10-19 20:27:32', 'success', '::ffff:35.16.20.72'),
(28, 40, '2024-10-19 20:34:17', 'success', '::ffff:35.16.20.72'),
(29, 40, '2024-10-19 20:35:35', 'success', '::ffff:35.16.20.72'),
(30, 40, '2024-10-19 20:52:47', 'success', '::ffff:35.16.20.72'),
(31, 40, '2024-10-19 21:00:48', 'failure', '::ffff:35.16.20.72'),
(32, 40, '2024-10-19 21:19:57', 'success', '::ffff:35.16.20.72'),
(33, 40, '2024-10-19 22:20:59', 'success', '::ffff:35.16.20.72'),
(34, 40, '2024-10-19 22:22:41', 'success', '::ffff:35.16.20.72'),
(35, 40, '2024-10-19 22:23:09', 'success', '::ffff:35.16.20.72'),
(36, 40, '2024-10-19 22:25:22', 'success', '::ffff:35.16.20.72'),
(37, 40, '2024-10-19 22:27:06', 'success', '::ffff:35.16.20.72'),
(38, 40, '2024-10-19 22:27:22', 'success', '::ffff:35.16.20.72'),
(39, 40, '2024-10-19 22:27:35', 'success', '::ffff:35.16.20.72'),
(40, 40, '2024-10-19 22:27:59', 'success', '::ffff:35.16.20.72'),
(41, 40, '2024-10-19 22:28:16', 'success', '::ffff:35.16.20.72'),
(42, 40, '2024-10-19 22:28:27', 'failure', '::ffff:35.16.20.72'),
(43, 40, '2024-10-19 22:29:12', 'success', '::ffff:35.16.20.72'),
(44, 40, '2024-10-19 22:29:37', 'success', '::ffff:35.16.20.72'),
(45, 40, '2024-10-19 22:29:56', 'success', '::ffff:35.16.20.72'),
(46, 40, '2024-10-19 22:30:06', 'success', '::ffff:35.16.20.72'),
(47, 40, '2024-10-19 22:30:52', 'success', '::ffff:35.16.20.72'),
(48, 40, '2024-10-19 22:31:02', 'success', '::ffff:35.16.20.72'),
(49, 40, '2024-10-19 22:32:14', 'success', '::ffff:35.16.20.72'),
(50, 40, '2024-10-19 22:33:12', 'success', '::ffff:35.16.20.72'),
(51, 40, '2024-10-19 22:35:29', 'success', '::ffff:35.16.20.72'),
(52, 40, '2024-10-19 22:36:11', 'success', '::ffff:35.16.20.72'),
(53, 40, '2024-10-19 22:38:48', 'success', '::ffff:35.16.20.72'),
(54, 40, '2024-10-19 22:41:22', 'success', '::ffff:35.16.20.72'),
(55, 40, '2024-10-19 22:43:55', 'success', '::ffff:35.16.20.72'),
(56, 40, '2024-10-19 22:51:13', 'success', '::ffff:35.16.5.164'),
(57, 40, '2024-10-19 22:51:54', 'success', '::ffff:35.16.5.164'),
(58, 40, '2024-10-19 22:57:04', 'success', '::ffff:35.16.20.72'),
(59, 40, '2024-10-19 23:17:25', 'success', '::ffff:35.16.20.72'),
(60, 40, '2024-10-19 23:20:29', 'success', '::ffff:35.16.20.72'),
(61, 40, '2024-10-20 01:57:45', 'success', '::ffff:35.16.20.72'),
(62, 40, '2024-10-20 01:58:32', 'success', '::ffff:35.16.20.72'),
(63, 40, '2024-10-20 02:01:25', 'success', '::ffff:35.16.20.72'),
(64, 40, '2024-10-20 02:04:32', 'success', '::ffff:35.16.20.72'),
(65, 40, '2024-10-20 02:17:07', 'success', '::ffff:35.16.20.72'),
(66, 40, '2024-10-20 02:27:49', 'success', '::ffff:35.16.20.72'),
(67, 40, '2024-10-20 02:32:10', 'success', '::ffff:35.16.20.72'),
(68, 40, '2024-10-20 02:43:27', 'success', '::ffff:35.16.20.72'),
(69, 40, '2024-10-20 02:48:04', 'success', '::ffff:35.16.20.72'),
(70, 40, '2024-10-20 02:57:24', 'success', '::ffff:35.16.20.72'),
(71, 40, '2024-10-20 02:59:47', 'success', '::ffff:35.16.20.72'),
(72, 40, '2024-10-20 03:00:31', 'success', '::ffff:35.16.20.72'),
(73, 40, '2024-10-20 03:03:23', 'success', '::ffff:35.16.20.72'),
(74, 40, '2024-10-20 03:05:17', 'success', '::ffff:35.16.20.72'),
(75, 40, '2024-10-20 03:05:41', 'success', '::ffff:35.16.20.72'),
(76, 40, '2024-10-20 03:07:53', 'success', '::ffff:35.16.20.72'),
(77, 40, '2024-10-20 03:08:27', 'success', '::ffff:35.16.20.72'),
(78, 40, '2024-10-20 03:10:39', 'success', '::ffff:35.16.20.72'),
(79, 40, '2024-10-20 03:15:15', 'success', '::ffff:35.16.20.72'),
(80, 40, '2024-10-20 03:16:16', 'success', '::ffff:35.16.20.72'),
(81, 40, '2024-10-20 03:16:52', 'success', '::ffff:35.16.20.72'),
(82, 40, '2024-10-20 03:20:06', 'success', '::ffff:35.16.5.164'),
(83, 40, '2024-10-20 03:21:56', 'success', '::ffff:35.16.20.72'),
(84, 40, '2024-10-20 03:24:24', 'success', '::ffff:35.16.20.72'),
(85, 40, '2024-10-20 03:27:05', 'success', '::ffff:35.16.20.72'),
(86, 40, '2024-10-20 03:29:53', 'success', '::ffff:35.16.20.72'),
(87, 40, '2024-10-20 03:35:41', 'success', '::ffff:35.16.20.72'),
(88, 40, '2024-10-20 03:37:30', 'success', '::ffff:35.16.20.72'),
(89, 40, '2024-10-20 03:41:38', 'success', '::ffff:35.16.20.72'),
(90, 40, '2024-10-20 03:46:25', 'success', '::ffff:35.16.20.72'),
(91, 40, '2024-10-20 03:47:03', 'success', '::ffff:35.16.20.72'),
(92, 40, '2024-10-20 03:49:16', 'success', '::ffff:35.16.20.72'),
(93, 40, '2024-10-20 03:49:48', 'success', '::ffff:35.16.20.72'),
(94, 40, '2024-10-20 03:52:06', 'success', '::ffff:35.16.20.72'),
(95, 40, '2024-10-20 03:53:00', 'success', '::ffff:35.16.20.72'),
(96, 40, '2024-10-20 04:04:26', 'success', '::ffff:35.16.20.72'),
(97, 40, '2024-10-20 04:05:00', 'success', '::ffff:35.16.20.72'),
(98, 40, '2024-10-20 04:07:37', 'success', '::ffff:35.16.20.72'),
(99, 40, '2024-10-20 04:10:33', 'success', '::ffff:35.16.20.72'),
(100, 40, '2024-10-20 04:12:53', 'success', '::ffff:35.16.20.72'),
(101, 40, '2024-10-20 04:13:15', 'success', '::ffff:35.16.20.72'),
(102, 40, '2024-10-20 04:14:16', 'success', '::ffff:35.16.20.72'),
(103, 40, '2024-10-20 04:15:27', 'success', '::ffff:35.16.20.72'),
(104, 40, '2024-10-20 04:16:20', 'success', '::ffff:35.16.20.72'),
(105, 40, '2024-10-20 04:16:36', 'success', '::ffff:35.16.20.72'),
(106, 40, '2024-10-20 04:18:18', 'success', '::ffff:35.16.20.72'),
(107, 40, '2024-10-20 04:21:14', 'success', '::ffff:35.16.20.72'),
(108, 40, '2024-10-20 04:22:31', 'success', '::ffff:35.16.20.72'),
(109, 40, '2024-10-20 04:25:30', 'success', '::ffff:35.16.20.72'),
(110, 40, '2024-10-20 04:27:40', 'success', '::ffff:35.16.20.72'),
(111, 40, '2024-10-20 04:28:11', 'success', '::ffff:35.16.20.72'),
(112, 40, '2024-10-20 04:35:55', 'success', '::ffff:35.16.20.72'),
(113, 40, '2024-10-20 04:39:06', 'success', '::ffff:35.16.20.72'),
(114, 40, '2024-10-20 04:39:16', 'success', '::ffff:35.16.20.72'),
(115, 40, '2024-10-20 04:39:27', 'success', '::ffff:35.16.20.72'),
(116, 40, '2024-10-20 04:39:50', 'success', '::ffff:35.16.20.72'),
(117, 40, '2024-10-20 04:43:10', 'success', '::ffff:35.16.20.72'),
(118, 40, '2024-10-20 04:47:01', 'success', '::ffff:35.16.20.72'),
(119, 40, '2024-10-20 04:47:50', 'success', '::ffff:35.16.20.72'),
(120, 40, '2024-10-20 04:48:41', 'success', '::ffff:35.16.20.72'),
(121, 40, '2024-10-20 04:50:06', 'success', '::ffff:35.16.20.72'),
(122, 40, '2024-10-20 04:50:33', 'success', '::ffff:35.16.20.72'),
(123, 40, '2024-10-20 04:50:47', 'success', '::ffff:35.16.20.72'),
(124, 40, '2024-10-20 04:52:12', 'success', '::ffff:35.16.20.72'),
(125, 40, '2024-10-20 04:52:22', 'success', '::ffff:35.16.20.72'),
(126, 40, '2024-10-20 04:52:58', 'success', '::ffff:35.16.20.72'),
(127, 40, '2024-10-20 04:53:03', 'success', '::ffff:35.16.20.72'),
(128, 40, '2024-10-20 04:53:49', 'success', '::ffff:35.16.20.72'),
(129, 40, '2024-10-20 04:54:20', 'success', '::ffff:35.16.20.72'),
(130, 40, '2024-10-20 04:54:52', 'success', '::ffff:35.16.20.72'),
(131, 40, '2024-10-20 04:54:58', 'success', '::ffff:35.16.20.72'),
(132, 40, '2024-10-20 04:55:07', 'success', '::ffff:35.16.20.72'),
(133, 40, '2024-10-20 04:55:41', 'success', '::ffff:35.16.20.72'),
(134, 40, '2024-10-20 04:56:07', 'success', '::ffff:35.16.20.72'),
(135, 40, '2024-10-20 04:56:13', 'success', '::ffff:35.16.20.72'),
(136, 40, '2024-10-20 04:56:28', 'success', '::ffff:35.16.20.72'),
(137, 40, '2024-10-20 04:56:35', 'success', '::ffff:35.16.20.72'),
(138, 40, '2024-10-20 04:56:41', 'success', '::ffff:35.16.20.72'),
(139, 40, '2024-10-20 04:57:48', 'success', '::ffff:35.16.20.72'),
(140, 40, '2024-10-20 04:59:23', 'success', '::ffff:35.16.20.72'),
(141, 40, '2024-10-20 04:59:51', 'success', '::ffff:35.16.20.72'),
(142, 40, '2024-10-20 05:00:19', 'success', '::ffff:35.16.20.72'),
(143, 40, '2024-10-20 05:01:12', 'success', '::ffff:35.16.20.72'),
(144, 40, '2024-10-20 05:02:33', 'success', '::ffff:35.16.20.72'),
(145, 40, '2024-10-20 05:05:10', 'success', '::ffff:35.16.20.72'),
(146, 40, '2024-10-20 05:06:12', 'success', '::ffff:35.16.20.72'),
(147, 40, '2024-10-20 05:06:40', 'success', '::ffff:35.16.20.72'),
(148, 40, '2024-10-20 05:06:46', 'success', '::ffff:35.16.20.72'),
(149, 40, '2024-10-20 05:06:54', 'success', '::ffff:35.16.20.72'),
(150, 40, '2024-10-20 05:07:06', 'success', '::ffff:35.16.20.72'),
(151, 40, '2024-10-20 05:07:14', 'success', '::ffff:35.16.20.72'),
(152, 40, '2024-10-20 05:09:02', 'success', '::ffff:35.16.20.72'),
(153, 40, '2024-10-20 05:11:15', 'success', '::ffff:35.16.5.164'),
(154, 40, '2024-10-20 05:11:45', 'success', '::ffff:35.16.5.164'),
(155, 40, '2024-10-20 05:11:45', 'success', '::ffff:35.16.5.164'),
(156, 40, '2024-10-20 05:16:24', 'success', '::ffff:35.16.20.72'),
(157, 40, '2024-10-20 05:19:44', 'success', '::ffff:35.16.20.72'),
(158, 40, '2024-10-20 05:25:55', 'success', '::ffff:35.16.20.72'),
(159, 40, '2024-10-20 05:28:26', 'success', '::ffff:35.16.20.72'),
(160, 40, '2024-10-20 05:29:30', 'success', '::ffff:35.16.20.72'),
(161, 40, '2024-10-20 05:30:43', 'success', '::ffff:35.16.20.72'),
(162, 40, '2024-10-20 05:31:01', 'success', '::ffff:35.16.20.72'),
(163, 40, '2024-10-20 05:31:04', 'success', '::ffff:35.16.20.72'),
(164, 40, '2024-10-20 05:38:26', 'success', '::ffff:35.16.20.72'),
(165, 40, '2024-10-20 05:39:41', 'success', '::ffff:35.16.20.72'),
(166, 40, '2024-10-20 05:46:35', 'success', '::ffff:35.16.20.72'),
(167, 40, '2024-10-20 05:46:56', 'success', '::ffff:35.16.20.72'),
(168, 40, '2024-10-20 05:48:51', 'success', '::ffff:35.16.20.72'),
(169, 40, '2024-10-20 05:50:00', 'success', '::ffff:35.16.20.72'),
(170, 40, '2024-10-20 05:57:11', 'success', '::ffff:35.16.20.72'),
(171, 40, '2024-10-20 05:58:03', 'success', '::ffff:35.16.20.72'),
(172, 40, '2024-10-20 05:58:41', 'success', '::ffff:35.16.20.72'),
(173, 40, '2024-10-20 06:01:54', 'success', '::ffff:35.16.20.72'),
(174, 40, '2024-10-20 06:02:49', 'success', '::ffff:35.16.20.72'),
(175, 40, '2024-10-20 06:03:32', 'success', '::ffff:35.16.20.72'),
(176, 40, '2024-10-20 06:03:52', 'success', '::ffff:35.16.20.72'),
(177, 40, '2024-10-20 06:04:45', 'success', '::ffff:35.16.20.72'),
(178, 40, '2024-10-20 06:06:10', 'success', '::ffff:35.16.20.72'),
(179, 40, '2024-10-20 06:15:14', 'success', '::ffff:35.16.20.72'),
(180, 40, '2024-10-20 06:16:36', 'success', '::ffff:35.16.20.72'),
(181, 40, '2024-10-20 06:17:41', 'success', '::ffff:35.16.20.72'),
(182, 40, '2024-10-20 06:18:30', 'success', '::ffff:35.16.20.72'),
(183, 40, '2024-10-20 06:19:40', 'success', '::ffff:35.16.20.72'),
(184, 40, '2024-10-20 06:22:29', 'success', '::ffff:35.16.20.72'),
(185, 40, '2024-10-20 06:23:30', 'success', '::ffff:35.16.20.72'),
(186, 40, '2024-10-20 06:24:32', 'success', '::ffff:35.16.20.72'),
(187, 40, '2024-10-20 06:25:06', 'success', '::ffff:35.16.20.72'),
(188, 40, '2024-10-20 06:37:35', 'success', '::ffff:35.16.20.72'),
(189, 40, '2024-10-20 06:49:04', 'success', '::ffff:35.16.20.72'),
(190, 40, '2024-10-20 06:55:07', 'success', '::ffff:35.16.20.72'),
(191, 40, '2024-10-20 06:56:15', 'success', '::ffff:35.16.20.72'),
(192, 40, '2024-10-20 06:57:22', 'success', '::ffff:35.16.20.72'),
(193, 40, '2024-10-20 06:58:52', 'success', '::ffff:35.16.20.72'),
(194, 40, '2024-10-20 06:59:03', 'success', '::ffff:35.16.20.72'),
(195, 40, '2024-10-20 07:00:45', 'success', '::ffff:35.16.20.72'),
(196, 40, '2024-10-20 07:03:16', 'success', '::ffff:35.16.20.72'),
(197, 40, '2024-10-20 07:05:05', 'success', '::ffff:35.16.20.72'),
(198, 40, '2024-10-20 07:11:16', 'success', '::ffff:35.16.5.164'),
(199, 40, '2024-10-20 07:11:47', 'success', '::ffff:35.16.20.72'),
(200, 40, '2024-10-20 07:13:31', 'success', '::ffff:35.16.5.164'),
(201, 40, '2024-10-20 07:13:45', 'success', '::ffff:35.16.5.164'),
(202, 40, '2024-10-20 07:14:02', 'success', '::ffff:35.16.20.72'),
(203, 40, '2024-10-20 07:15:45', 'success', '::ffff:35.16.20.72'),
(204, 40, '2024-10-20 07:19:11', 'success', '::ffff:35.16.20.72'),
(205, 40, '2024-10-20 07:21:22', 'success', '::ffff:35.16.20.72'),
(206, 40, '2024-10-20 07:22:14', 'success', '::ffff:35.16.20.72'),
(207, 40, '2024-10-20 07:32:52', 'success', '::ffff:35.16.20.72'),
(208, 40, '2024-10-20 07:40:07', 'success', '::ffff:35.16.20.72'),
(209, 40, '2024-10-20 07:40:40', 'success', '::ffff:35.16.20.72'),
(210, 40, '2024-10-20 07:41:50', 'success', '::ffff:35.16.20.72'),
(211, 40, '2024-10-20 07:42:33', 'success', '::ffff:35.16.20.72'),
(212, 40, '2024-10-20 07:45:32', 'success', '::ffff:35.16.20.72'),
(213, 40, '2024-10-20 07:50:53', 'success', '::ffff:35.16.20.72'),
(214, 40, '2024-10-20 07:52:39', 'success', '::ffff:35.16.20.72'),
(215, 40, '2024-10-20 07:53:41', 'success', '::ffff:35.16.20.72'),
(216, 40, '2024-10-20 07:56:33', 'success', '::ffff:35.16.20.72'),
(217, 40, '2024-10-20 07:57:40', 'success', '::ffff:35.16.5.164'),
(218, 40, '2024-10-20 07:59:28', 'success', '::ffff:35.16.20.72'),
(219, 40, '2024-10-20 08:03:46', 'success', '::ffff:35.16.20.72'),
(220, 40, '2024-10-20 08:06:43', 'success', '::ffff:35.16.20.72'),
(221, 40, '2024-10-20 08:09:51', 'success', '::ffff:35.16.20.72'),
(222, 40, '2024-10-20 08:14:06', 'success', '::ffff:35.16.20.72'),
(223, 40, '2024-10-20 08:18:52', 'success', '::ffff:35.16.20.72'),
(224, 40, '2024-10-20 08:19:02', 'success', '::ffff:35.16.20.72'),
(225, 40, '2024-10-20 08:22:47', 'success', '::ffff:35.16.20.72'),
(226, 40, '2024-10-20 08:24:01', 'success', '::ffff:35.16.20.72'),
(227, 40, '2024-10-20 08:25:46', 'success', '::ffff:35.16.20.72'),
(228, 40, '2024-10-20 08:26:11', 'success', '::ffff:35.16.20.72'),
(229, 40, '2024-10-20 08:28:32', 'success', '::ffff:35.16.20.72'),
(230, 40, '2024-10-20 08:29:29', 'success', '::ffff:35.16.20.72'),
(231, 40, '2024-10-20 08:30:10', 'success', '::ffff:35.16.20.72'),
(232, 40, '2024-10-20 08:30:47', 'success', '::ffff:35.16.20.72'),
(233, 40, '2024-10-20 08:32:31', 'success', '::ffff:35.16.20.72'),
(234, 40, '2024-10-20 08:32:56', 'success', '::ffff:35.16.20.72'),
(235, 40, '2024-10-20 08:33:38', 'success', '::ffff:35.16.20.72'),
(236, 40, '2024-10-20 08:34:07', 'success', '::ffff:35.16.20.72'),
(237, 40, '2024-10-20 08:34:50', 'success', '::ffff:35.16.20.72'),
(238, 40, '2024-10-20 08:36:53', 'success', '::ffff:35.16.20.72'),
(239, 40, '2024-10-20 08:40:00', 'success', '::ffff:35.16.20.72'),
(240, 40, '2024-10-20 08:41:18', 'success', '::ffff:35.16.20.72'),
(241, 40, '2024-10-20 08:43:19', 'success', '::ffff:35.16.20.72'),
(242, 40, '2024-10-20 08:44:59', 'success', '::ffff:35.16.5.164'),
(243, 40, '2024-10-20 19:10:24', 'success', '::ffff:35.16.20.72'),
(244, 40, '2024-10-20 19:26:16', 'success', '::ffff:35.16.20.72'),
(245, 40, '2024-10-20 19:45:03', 'success', '::ffff:35.16.20.72'),
(246, 40, '2024-10-20 19:46:14', 'success', '::ffff:35.16.20.72'),
(247, 40, '2024-10-20 19:50:50', 'success', '::ffff:35.16.20.72'),
(248, 40, '2024-10-20 19:51:57', 'success', '::ffff:35.16.20.72'),
(249, 40, '2024-10-20 19:53:11', 'success', '::ffff:35.16.20.72'),
(250, 40, '2024-10-20 20:02:01', 'success', '::ffff:35.16.20.72'),
(251, 40, '2024-10-20 20:02:23', 'success', '::ffff:35.16.20.72'),
(252, 40, '2024-10-20 20:17:45', 'success', '::ffff:35.16.20.72'),
(253, 40, '2024-10-20 20:18:16', 'success', '::ffff:35.16.20.72');

--
-- Indexes for dumped tables
--

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=254;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_login`
--
ALTER TABLE `user_login`
  ADD CONSTRAINT `user_login_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
