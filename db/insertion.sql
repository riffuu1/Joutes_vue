USE joutes;



INSERT INTO sports(NAME,DateHourBegin,DateHourEnd) 
VALUES
('Badminton','2025-06-24 13:30','2025-06-24 14:45'),
('Unihockey','2025-06-24 8:15','2025-06-24 11:45'),
('Streetbasket','2025-06-24 8:15','2025-06-24 11:45'),
('Volley','2025-06-24 8:15','2025-06-24 11:45'),
('Beachvolley','2025-06-24 8:30','2025-06-24 15:30'),
('Marche','2025-06-24 8:15','2025-06-24 15:30'),
('Pétanque','2025-06-24 8:15','2025-06-24 15:30'),
('Foot','2025-06-24 13:30','2025-06-24 15:30');


INSERT INTO teams(NAME)
VALUES
('Les Boom Heures'),
('Hasta la Vista'),
('Fraudes'),
('Les Chaud meurt');

INSERT INTO sports_has_teams(idSports,idTeams)
VALUES 
(8,2),
(5,1),
(6,3),
(2,4);

INSERT INTO players(Firstname,Lastname,Email,Classname,Teams_id)
VALUES
('Anthony','Simond','anthony.simond@eduvaud.ch','SI-CA1a',1),
('Imad','El Khattabi','imad.elkhattabi@eduvaud.ch','SI-CA1a',3),
('Gaetan','Gendroz','gaetan.gendroz@eduvaud.ch','SI-CA1a',2),
('Mouldi','Achouri','mouldi.achouri@eduvaud.ch','SI-CA1a',1);


INSERT INTO `joutes`.`Users` (`Username`, `Password`, `Role`, `Players_id`) 
VALUES ('admin_joutes', 'admin123', 'admin', NULL);


INSERT INTO `joutes`.`Users` (`Username`, `Password`, `Role`, `Players_id`) 
VALUES ('joueur_test', '$2b$10$vjgMYa7wSIcT3FXYk6t1puGCc8wVyvJ3wuKJBCDOAbsIv0h4.JYJG', 'leader', 1);
