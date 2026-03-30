-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE,
SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema joutes
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `joutes` ;
CREATE SCHEMA IF NOT EXISTS `joutes` DEFAULT CHARACTER SET utf8 ;
USE `joutes` ;

-- -----------------------------------------------------
-- Table Users
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Users` ;

CREATE TABLE `Users` (
                         `idUsers` INT NOT NULL AUTO_INCREMENT,
                         `Username` VARCHAR(25) NOT NULL,
                         `Password` VARCHAR(255) NOT NULL,
                         `Role` ENUM('admin', 'leader') NOT NULL DEFAULT 'leader',
                         PRIMARY KEY (`idUsers`),
                         UNIQUE (`Username`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Teams
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Teams` ;

CREATE TABLE `Teams` (
                         `idTeams` INT NOT NULL AUTO_INCREMENT,
                         `Name` VARCHAR(15) NOT NULL,
                         `Users_id` INT NOT NULL,
                         PRIMARY KEY (`idTeams`),
                         UNIQUE (`Users_id`), -- 1 leader = 1 team
                         CONSTRAINT `fk_Teams_Users`
                             FOREIGN KEY (`Users_id`)
                                 REFERENCES `Users` (`idUsers`)
                                 ON DELETE CASCADE
                                 ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Players
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Players` ;

CREATE TABLE `Players` (
                           `idPlayers` INT NOT NULL AUTO_INCREMENT,
                           `Firstname` VARCHAR(20) NOT NULL,
                           `Lastname` VARCHAR(20) NOT NULL,
                           `Email` VARCHAR(45) NOT NULL,
                           `Classname` VARCHAR(15) NOT NULL,
                           `Teams_id` INT NOT NULL,
                           PRIMARY KEY (`idPlayers`),
                           UNIQUE (`Email`),
                           CONSTRAINT `fk_Players_Teams`
                               FOREIGN KEY (`Teams_id`)
                                   REFERENCES `Teams` (`idTeams`)
                                   ON DELETE CASCADE
                                   ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Sports
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Sports` ;

CREATE TABLE `Sports` (
                          `idSports` INT NOT NULL AUTO_INCREMENT,
                          `Name` VARCHAR(25) NOT NULL,
                          `DateHourBegin` DATETIME NOT NULL,
                          `DateHourEnd` DATETIME NOT NULL,
                          PRIMARY KEY (`idSports`),
                          UNIQUE (`Name`)
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table Sports_has_Teams
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Sports_has_Teams` ;

CREATE TABLE `Sports_has_Teams` (
                                    `idParticipate` INT NOT NULL AUTO_INCREMENT,
                                    `idSports` INT NOT NULL,
                                    `idTeams` INT NOT NULL,
                                    PRIMARY KEY (`idParticipate`),
                                    CONSTRAINT `fk_Sports_has_Teams_Sports`
                                        FOREIGN KEY (`idSports`)
                                            REFERENCES `Sports` (`idSports`)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE,
                                    CONSTRAINT `fk_Sports_has_Teams_Teams`
                                        FOREIGN KEY (`idTeams`)
                                            REFERENCES `Teams` (`idTeams`)
                                            ON DELETE CASCADE
                                            ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;