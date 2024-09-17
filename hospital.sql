-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 05, 2024 at 09:10 PM
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
-- Database: `hospital`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `appointment_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `appointment_date` datetime DEFAULT NULL,
  `reason` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`appointment_id`, `patient_id`, `doctor_id`, `appointment_date`, `reason`) VALUES
(1, 1, 1, '2024-08-01 09:00:00', 'General Checkup'),
(2, 2, 2, '2024-08-03 10:00:00', 'Follow-up Visit'),
(3, 3, 1, '2024-08-05 11:00:00', 'Consultation'),
(4, 4, 3, '2024-08-06 12:00:00', 'Therapy'),
(5, 5, 2, '2024-08-07 13:00:00', 'Routine Checkup'),
(6, 6, 4, '2024-08-08 14:00:00', 'Skin Rash'),
(7, 7, 1, '2024-08-09 15:00:00', 'Flu Symptoms'),
(8, 8, 3, '2024-08-10 16:00:00', 'Back Pain'),
(9, 9, 4, '2024-08-11 17:00:00', 'Injury Checkup'),
(10, 10, 2, '2024-08-12 18:00:00', 'Vaccination');

-- --------------------------------------------------------

--
-- Table structure for table `bills`
--

CREATE TABLE `bills` (
  `bill_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `bill_date` date DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `bills`
--

INSERT INTO `bills` (`bill_id`, `patient_id`, `total_amount`, `bill_date`, `status`) VALUES
(1, 1, 500.00, '2024-08-01', 'Paid'),
(2, 2, 300.00, '2024-08-02', 'Unpaid'),
(3, 3, 400.00, '2024-08-03', 'Paid'),
(4, 4, 200.00, '2024-08-04', 'Unpaid'),
(5, 5, 600.00, '2024-08-05', 'Paid'),
(6, 6, 350.00, '2024-08-06', 'Unpaid'),
(7, 7, 450.00, '2024-08-07', 'Paid'),
(8, 8, 250.00, '2024-08-08', 'Unpaid'),
(9, 9, 550.00, '2024-08-09', 'Paid'),
(10, 10, 150.00, '2024-08-10', 'Unpaid');

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `doctor_id` int(11) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `speciality` varchar(25) DEFAULT NULL,
  `phone` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`doctor_id`, `first_name`, `last_name`, `speciality`, `phone`) VALUES
(1, 'Emily', 'Clark', 'Cardiology', 555),
(2, 'Robert', 'Smith', 'Neurology', 555),
(3, 'Sophia', 'Johnson', 'Pediatrics', 555),
(4, 'Michael', 'Williams', 'Orthopedics', 555),
(5, 'Olivia', 'Brown', 'Dermatology', 555),
(6, 'Daniel', 'Jones', 'Radiology', 555),
(7, 'Emma', 'Garcia', 'Oncology', 555),
(8, 'James', 'Martinez', 'General Surgery', 555),
(9, 'Isabella', 'Davis', 'Gastroenterology', 555),
(10, 'William', 'Lopez', 'Endocrinology', 555);

-- --------------------------------------------------------

--
-- Table structure for table `medicaltests`
--

CREATE TABLE `medicaltests` (
  `test_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `test_name` varchar(100) DEFAULT NULL,
  `test_date` date DEFAULT NULL,
  `results` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicaltests`
--

INSERT INTO `medicaltests` (`test_id`, `patient_id`, `doctor_id`, `test_name`, `test_date`, `results`) VALUES
(1, 1, 1, 'Blood Test', '2024-08-01', 'Normal'),
(2, 2, 2, 'MRI', '2024-08-02', 'Abnormal'),
(3, 3, 1, 'X-Ray', '2024-08-03', 'Normal'),
(4, 4, 3, 'CT Scan', '2024-08-04', 'Normal'),
(5, 5, 2, 'Urine Test', '2024-08-05', 'Normal'),
(6, 6, 4, 'ECG', '2024-08-06', 'Abnormal'),
(7, 7, 1, 'Allergy Test', '2024-08-07', 'Positive'),
(8, 8, 3, 'Biopsy', '2024-08-08', 'Benign'),
(9, 9, 4, 'Blood Sugar', '2024-08-09', 'High'),
(10, 10, 2, 'Cholesterol Test', '2024-08-10', 'Borderline');

-- --------------------------------------------------------

--
-- Table structure for table `medications`
--

CREATE TABLE `medications` (
  `medication_id` int(11) NOT NULL,
  `medication_name` varchar(50) DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `side_effects` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medications`
--

INSERT INTO `medications` (`medication_id`, `medication_name`, `dosage`, `side_effects`) VALUES
(1, 'Aspirin', '500mg', 'Nausea'),
(2, 'Ibuprofen', '200mg', 'Dizziness'),
(3, 'Metformin', '850mg', 'Stomach Upset'),
(4, 'Paracetamol', '500mg', 'Liver Damage'),
(5, 'Amoxicillin', '250mg', 'Allergic Reaction'),
(6, 'Lisinopril', '10mg', 'Cough'),
(7, 'Atorvastatin', '20mg', 'Muscle Pain'),
(8, 'Hydrochlorothiazide', '25mg', 'Dehydration'),
(9, 'Omeprazole', '40mg', 'Headache'),
(10, 'Simvastatin', '20mg', 'Fatigue');

-- --------------------------------------------------------

--
-- Table structure for table `nurses`
--

CREATE TABLE `nurses` (
  `nurse_id` int(11) NOT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `department` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nurses`
--

INSERT INTO `nurses` (`nurse_id`, `first_name`, `last_name`, `department`) VALUES
(1, 'Emily', 'Clark', 'Cardiology'),
(2, 'Sarah', 'Jones', 'Neurology'),
(3, 'Robert', 'Miller', 'Pediatrics'),
(4, 'Sophia', 'Taylor', 'Orthopedics'),
(5, 'Daniel', 'Brown', 'Oncology'),
(6, 'Anna', 'Johnson', 'Dermatology'),
(7, 'James', 'Lee', 'Psychiatry'),
(8, 'David', 'Williams', 'Emergency'),
(9, 'Michael', 'Davis', 'ICU'),
(10, 'Laura', 'Wilson', 'Surgery');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `patient_id` int(11) NOT NULL,
  `first_name` varchar(25) DEFAULT NULL,
  `last_name` varchar(25) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `phone` int(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`patient_id`, `first_name`, `last_name`, `age`, `dob`, `gender`, `phone`) VALUES
(1, 'Arun', 'Thangapalam', 24, '1969-08-22', 'male', 313187332),
(2, 'Mark', 'De', 24, '2008-05-12', 'male', 2147483647),
(3, 'Erin', 'Me', 35, '2003-04-22', 'female', 2147483647),
(4, 'Sel', 'DO', 45, '2004-08-22', 'female', 2147483647),
(5, 'Wendy', 'Lu', 22, '1994-08-22', 'female', 2147483647),
(6, 'Dan', 'Ar', 18, '2000-06-22', 'male', 2147483647),
(7, 'Cong', 'Ul', 45, '1993-08-22', 'female', 2147483647),
(8, 'Sunny', 'Lee', 65, '2005-04-22', 'male', 2147483647),
(9, 'Dong', 'Xi', 22, '2002-08-22', 'male', 2147483647),
(10, 'Dong', 'Xi', 22, '2002-08-22', 'male', 2147483647);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `prescription_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `medication_id` int(11) DEFAULT NULL,
  `dosage` varchar(50) DEFAULT NULL,
  `prescription_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`prescription_id`, `patient_id`, `doctor_id`, `medication_id`, `dosage`, `prescription_date`) VALUES
(1, 1, 1, 1, '500mg', '2024-08-01'),
(2, 2, 2, 2, '200mg', '2024-08-02'),
(3, 3, 1, 3, '850mg', '2024-08-03'),
(4, 4, 3, 4, '500mg', '2024-08-04'),
(5, 5, 2, 5, '250mg', '2024-08-05'),
(6, 6, 4, 6, '10mg', '2024-08-06'),
(7, 7, 1, 7, '20mg', '2024-08-07'),
(8, 8, 3, 8, '25mg', '2024-08-08'),
(9, 9, 4, 9, '40mg', '2024-08-09'),
(10, 10, 2, 10, '20mg', '2024-08-10');

-- --------------------------------------------------------

--
-- Table structure for table `surgeries`
--

CREATE TABLE `surgeries` (
  `surgery_id` int(11) NOT NULL,
  `patient_id` int(11) DEFAULT NULL,
  `doctor_id` int(11) DEFAULT NULL,
  `surgery_type` varchar(100) DEFAULT NULL,
  `surgery_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `surgeries`
--

INSERT INTO `surgeries` (`surgery_id`, `patient_id`, `doctor_id`, `surgery_type`, `surgery_date`) VALUES
(1, 1, 1, 'Appendectomy', '2024-08-01'),
(2, 2, 2, 'Bypass Surgery', '2024-08-02'),
(3, 3, 1, 'Cataract Surgery', '2024-08-03'),
(4, 4, 3, 'Hernia Repair', '2024-08-04'),
(5, 5, 2, 'Hip Replacement', '2024-08-05'),
(6, 6, 4, 'Knee Replacement', '2024-08-06'),
(7, 7, 1, 'Laparoscopy', '2024-08-07'),
(8, 8, 3, 'Gallbladder Removal', '2024-08-08'),
(9, 9, 4, 'Tonsillectomy', '2024-08-09'),
(10, 10, 2, 'Vascular Surgery', '2024-08-10');

-- --------------------------------------------------------

--
-- Table structure for table `wards`
--

CREATE TABLE `wards` (
  `ward_id` int(11) NOT NULL,
  `ward_name` varchar(50) DEFAULT NULL,
  `capacity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wards`
--

INSERT INTO `wards` (`ward_id`, `ward_name`, `capacity`) VALUES
(1, 'Ward A', 20),
(2, 'Ward B', 25),
(3, 'Ward C', 30),
(4, 'Ward D', 15),
(5, 'Ward E', 10),
(6, 'Ward F', 40),
(7, 'Ward G', 35),
(8, 'Ward H', 50),
(9, 'Ward I', 45),
(10, 'Ward J', 60);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`appointment_id`);

--
-- Indexes for table `bills`
--
ALTER TABLE `bills`
  ADD PRIMARY KEY (`bill_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`doctor_id`);

--
-- Indexes for table `medicaltests`
--
ALTER TABLE `medicaltests`
  ADD PRIMARY KEY (`test_id`);

--
-- Indexes for table `medications`
--
ALTER TABLE `medications`
  ADD PRIMARY KEY (`medication_id`);

--
-- Indexes for table `nurses`
--
ALTER TABLE `nurses`
  ADD PRIMARY KEY (`nurse_id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`patient_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`prescription_id`);

--
-- Indexes for table `surgeries`
--
ALTER TABLE `surgeries`
  ADD PRIMARY KEY (`surgery_id`);

--
-- Indexes for table `wards`
--
ALTER TABLE `wards`
  ADD PRIMARY KEY (`ward_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `appointment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `bills`
--
ALTER TABLE `bills`
  MODIFY `bill_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `doctor_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `medicaltests`
--
ALTER TABLE `medicaltests`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `medications`
--
ALTER TABLE `medications`
  MODIFY `medication_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `nurses`
--
ALTER TABLE `nurses`
  MODIFY `nurse_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `prescription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `surgeries`
--
ALTER TABLE `surgeries`
  MODIFY `surgery_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `wards`
--
ALTER TABLE `wards`
  MODIFY `ward_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
