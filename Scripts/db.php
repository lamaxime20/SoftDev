<?php
$host = 'dpg-d228skre5dus739coue0-a.oregon-postgres.render.com';
$dbname = 'formulairedevsoft';
$user = 'formulairedevsoft_user';
$password = 'pIvarf5IubHWjEbE7VG0anZrC59qFpmK';

try {
    $pdo = new PDO("pgsql:host=$host;dbname=$dbname", $user, $password);
    // Active les erreurs PDO
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?>