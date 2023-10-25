-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 25, 2023 at 08:56 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `project`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `product_category` varchar(50) NOT NULL,
  `product_price` decimal(10,2) NOT NULL,
  `product_image` varchar(50) NOT NULL,
  `product_description` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_category`, `product_price`, `product_image`, `product_description`) VALUES
(1, 'ProductName', 'Category 1', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(2, 'ProductName', 'Category 1', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(3, 'ProductName', 'Category 2', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(4, 'ProductName', 'Category 3', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(5, 'ProductName', 'Category 4', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(6, 'ProductName', 'Category 5', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(7, 'ProductName', 'Category 1', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(8, 'ProductName', 'Category 3', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(9, 'ProductName', 'Category 5', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(10, 'ProductName', 'Category 3', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(11, 'ProductName', 'Category 2', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(12, 'ProductName', 'Category 2', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(13, 'ProductName', 'Category 2', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(14, 'ProductName', 'Category 1', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m'),
(15, 'ProductName', 'Category 4', 12.34, 'product_image.png', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus volutpat leo nisi, a pulvinar neque tincidunt eget. Maecenas lobortis lacus.m');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `user_login` varchar(50) NOT NULL,
  `user_password` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `user_login`, `user_password`) VALUES
(1, 'undefined', 'undefined'),
(2, 'Jkowalski', '123'),
(3, 'Jkowalki123', '123'),
(4, 'ssssss', '123'),
(5, 'asd', 'asd');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
