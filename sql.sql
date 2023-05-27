CREATE DATABASE IF NOT EXISTS `valde` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `valde`;

CREATE TABLE `stuff` (
  `Month` int(11) NOT NULL,
  `Area` text NOT NULL,
  `Skill` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `stuff` (`Month`, `Area`, `Skill`) VALUES
(1, 'Running', 10),
(1, 'Programming', 20),
(2, 'Running', 1),
(1, 'Cooking', 10);
COMMIT;