-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2024 at 03:44 AM
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
(1, 'John', 'Doe', 'john.doe@example.com', 'password123', 50000.00, 30, '1994-05-15', '2024-10-13 00:00:00', '2024-10-13 08:00:00', 1, 1, 0),
(2, 'Mary', 'Jane', 'evan234@gmail.com', '', 34000.00, 33, '0000-00-00', '2024-10-14 00:00:00', '2024-10-14 01:58:06', 1, 40, 0),
(3, 'Arun', 'parker', 'hr9292@wayne.edu', 'Arunram@22', 23000.00, 24, '2024-10-13', '2024-10-14 00:00:00', '2024-10-14 02:01:00', 1, 1, 0),
(23, 'Arun', 'as', 'arun@whd.com', 'Wahdgu2136t1', 234213.00, 12, '2024-10-17', '2024-10-14 02:26:03', '2024-10-14 02:26:03', 1, 43, 0),
(25, 'miss', 'brown', 'hr9292@waye.edu', '', 0.00, 0, '0000-00-00', '2024-10-14 02:34:34', '2024-10-14 02:34:34', 1, 43, 0),
(26, 'jasmine', '', 'hr9292@wayne.com', '', 77.00, 0, '0000-00-00', '2024-10-14 02:38:10', '2024-10-14 02:38:10', 1, 43, 0),
(27, 'Arun', 'NEXT', 'hr9292@wayne.co', 'Swerty@23', 234234.00, 24, '0000-00-00', '2024-10-14 02:39:15', '2024-10-14 02:39:15', 1, 40, 0),
(28, 'der', 'iuwe', 'arun@whd.co', 'Swerty@3454', 234.00, 234, '2024-10-09', '2024-10-14 02:40:51', '2024-10-14 02:40:51', 1, 1, 0),
(29, 'sravani', '', 'hr9292@wayne.in', '@W213yefywe', 2454.00, 234, '2024-10-25', '2024-10-14 03:02:34', '2024-10-14 03:02:34', 1, 43, 0),
(30, 'venn', 'diag', 'baahu@wayne.com', 'A@aryds463', 234872.00, 234, '2024-09-30', '2024-10-14 03:10:26', '2024-10-14 03:10:26', 1, 1, 0),
(31, 'ater', 'rte', 'hr9292@wayne.ede', 'Awert@234', 23424.00, 245, '2024-10-03', '2024-10-14 03:19:29', '2024-10-14 03:19:29', 1, 1, 0),
(32, 'browny', '', 'joe123@gmail.com', '', 0.00, 13, '0000-00-00', '2024-10-14 03:20:38', '2024-10-14 03:20:38', 1, 43, 0),
(33, 'hf', 'erg', 'erg@gmail.com', 'Adiygaqd23@', 23423.00, 2342, '2024-10-10', '2024-10-14 03:21:03', '2024-10-14 03:21:03', 1, 1, 0),
(34, 'Aryn', 'Ff', 'a@d.co', 'ff@sdr345A', 255.00, 258, '2024-10-15', '2024-10-14 17:46:17', '2024-10-14 17:46:17', 1, 1, 0),
(35, 'Aryn', 'Ff', 'y@red.com', 'ff@sdr345A', 255.00, 258, '2024-10-15', '2024-10-14 17:46:41', '2024-10-14 17:46:41', 1, 1, 0),
(36, 'Aryn', 'Ff', 'yrt@red.com', 'ff@sdr345A', 255.00, 258, '2024-10-15', '2024-10-14 17:46:54', '2024-10-14 17:46:54', 1, 1, 0),
(37, 'asd', 'asd', 'arunramkra997@gmail.com', '55ac28784cf6', 23784.00, 234, '2024-10-25', '2024-10-14 19:39:34', '2024-10-14 19:39:34', 1, 1, 0),
(38, 'Arun', 'Ramkrishna', 'arunramkrishna997@gmail.com', '6b98ca506208', 234.00, 234, '2024-10-10', '2024-10-14 20:18:50', '2024-10-14 20:18:50', 1, 1, 0),
(39, 'folie', 'de', 'foli@gmail.com', 'Joker@2024', 23423.00, 23, '2024-10-09', '2024-10-14 20:37:40', '2024-10-14 20:37:40', 1, 1, 0),
(40, 'lion', 'king', 'lion@gmail.com', '05894b49b03a31dd12fe842a3db4be5cf588789a15d6dab16eb21e555003a690', 2342.00, 23, '2024-10-10', '2024-10-14 20:39:21', '2024-10-24 01:42:50', 1, 1, 0),
(41, 'mark', 'man', 'man@gmail.com', 'dbde24135c49dde0d9ce8fc33d2eb839a7415746ec24093f2845b4024d53037d', 1324.00, 34, '2024-10-11', '2024-10-14 21:47:19', '2024-10-14 21:47:19', 1, 1, 0),
(42, 'Arun', 'Ramkrishna', 'arunramkrishna997@gmail.co', '0648644a29ab1ce528a76de8e85c2d88179441617f17392f919923e8827d4643', 234.00, 234, '2024-10-18', '2024-10-16 23:02:41', '2024-10-16 23:02:41', 1, 1, 0),
(43, 'jack', 'son', 'jackson.abc@gmail.com', '1a2802e5d323653e5249b784881845db037ec8bd742b28afe7c02f60695a2ce8', 12345.00, 21, '2004-06-23', '2024-10-24 01:01:33', '2024-10-24 01:08:50', 1, 1, 0),
(44, 'lily', 'comrade', 'lily@gmail.com', 'd8cc2a0b2f4bdd103c948e6fdf8fbd6cdbac402555d09be120dab67a90d3b05e', 20232.00, 22, '2024-10-08', '2024-10-24 01:29:45', '2024-10-24 01:29:45', 1, 40, 0),
(45, 'gwen', 'SStacy', 'gwen@gmail.com', 'd29cdc65af64377ac3a65862329f650b66cdbe5a0342ff6a5de85be7c89e714c', 2000000.00, 23, '2024-10-08', '2024-10-24 01:35:19', '2024-10-24 01:35:19', 1, NULL, 0),
(46, 'ASF', 'af', 'asdas@HAD.co', '250ef876394b84e4b744073837a5e60d2ba8516da7747d4219ee2815dff02b9c', 2324.00, 23, '2024-10-02', '2024-10-23 21:42:30', '2024-10-24 01:41:39', 1, NULL, 0);

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
(11, 40, '2024-10-24 00:58:13', 'success', '::ffff:35.16.86.127'),
(12, 43, '2024-10-24 01:03:42', 'success', '::ffff:35.16.101.20'),
(13, 40, '2024-10-24 01:05:54', 'success', '::ffff:35.16.86.127'),
(14, 40, '2024-10-24 01:06:19', 'success', '::ffff:35.16.86.127'),
(15, 43, '2024-10-24 01:08:50', 'success', '::ffff:35.16.101.20'),
(16, 40, '2024-10-24 01:17:21', 'success', '::ffff:35.16.86.127'),
(17, 40, '2024-10-24 01:20:20', 'success', '::ffff:35.16.86.127'),
(18, 40, '2024-10-24 01:26:34', 'success', '::ffff:35.16.86.127'),
(19, 40, '2024-10-24 01:30:01', 'success', '::ffff:35.16.86.127'),
(20, 40, '2024-10-24 01:35:35', 'success', '::ffff:35.16.86.127'),
(21, 40, '2024-10-24 01:41:43', 'success', '::ffff:35.16.86.127'),
(22, 40, '2024-10-24 01:42:50', 'success', '::ffff:35.16.86.127');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `user_login`
--
ALTER TABLE `user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
