CREATE TABLE Requetes (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(60) NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    Date_creation DATE NOT NULL
);

-- 🔵 Procédure d’insertion
CREATE OR REPLACE PROCEDURE CreationReq(nom_in TEXT, email_in TEXT, message_in TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO Requetes (nom, email, message, Date_creation)
    VALUES (nom_in, email_in, message_in, CURRENT_DATE);
END;
$$;

-- 🟢 Procédure de modification
CREATE OR REPLACE PROCEDURE ModifReq(id_in INT, nom_in TEXT, email_in TEXT, message_in TEXT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE Requetes
    SET nom = nom_in,
        email = email_in,
        message = message_in,
        Date_creation = CURRENT_DATE
    WHERE id = id_in;
END;
$$;

-- 🔴 Procédure de suppression
CREATE OR REPLACE PROCEDURE SuppReq(id_in INT)
LANGUAGE plpgsql
AS $$
BEGIN
    DELETE FROM Requetes
    WHERE id = id_in;
END;
$$;

-- 🟣 Fonction de récupération
CREATE OR REPLACE FUNCTION AvoirReq()
RETURNS TABLE (
    id INT,
    nom TEXT,
    email TEXT,
    message TEXT,
    Date_creation DATE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT id, nom, email, message, Date_creation
    FROM Requetes
    ORDER BY Date_creation DESC;
END;
$$;