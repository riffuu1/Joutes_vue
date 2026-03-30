USE joutes;

-- -------------------------
-- USERS
-- -------------------------
INSERT INTO Users (Username, Password, Role)
VALUES
    ('admin_joutes', 'admin123', 'admin'),
    ('leader1', 'pass123', 'leader'),
    ('leader2', 'pass123', 'leader'),
    ('leader3', 'pass123', 'leader'),
    ('leader4', 'pass123', 'leader');

-- -------------------------
-- TEAMS (liées aux users)
-- -------------------------
INSERT INTO Teams (Name, Users_id)
VALUES
    ('Les Boom Heures', 2),
    ('Hasta la Vista', 3),
    ('Fraudes', 4),
    ('Les Chaud meurt', 5);

-- -------------------------
-- SPORTS
-- -------------------------
INSERT INTO Sports (Name, DateHourBegin, DateHourEnd)
VALUES
    ('Badminton','2025-06-24 13:30','2025-06-24 14:45'),
    ('Unihockey','2025-06-24 08:15','2025-06-24 11:45'),
    ('Streetbasket','2025-06-24 08:15','2025-06-24 11:45'),
    ('Volley','2025-06-24 08:15','2025-06-24 11:45'),
    ('Beachvolley','2025-06-24 08:30','2025-06-24 15:30'),
    ('Marche','2025-06-24 08:15','2025-06-24 15:30'),
    ('Pétanque','2025-06-24 08:15','2025-06-24 15:30'),
    ('Foot','2025-06-24 13:30','2025-06-24 15:30');

-- -------------------------
-- ASSOCIATION SPORT / TEAM
-- -------------------------
INSERT INTO Sports_has_Teams (idSports, idTeams)
VALUES
    (8,2),
    (5,1),
    (6,3),
    (2,4);

-- -------------------------
-- PLAYERS
-- -------------------------
INSERT INTO Players (Firstname, Lastname, Email, Classname, Teams_id)
VALUES
    ('Anthony','Simond','anthony.simond@eduvaud.ch','SI-CA1a',1),
    ('Imad','El Khattabi','imad.elkhattabi@eduvaud.ch','SI-CA1a',3),
    ('Gaetan','Gendroz','gaetan.gendroz@eduvaud.ch','SI-CA1a',2),
    ('Mouldi','Achouri','mouldi.achouri@eduvaud.ch','SI-CA1a',1);