<?php
require 'db.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nom = trim($_POST['nom'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $message = trim($_POST['message'] ?? '');

    // Vérification des champs vides
    if (empty($nom) || empty($email) || empty($message)) {
        echo "❌ Tous les champs sont obligatoires.";
        exit;
    }

    // Vérification de l'email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "❌ Adresse email invalide.";
        exit;
    }

    try {
        // Appel de la procédure stockée CreationReq
        $stmt = $pdo->prepare("CALL CreationReq(:nom, :email, :message)");
        $stmt->bindParam(':nom', $nom);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':message', $message);
        $stmt->execute();

        echo "✅ Requête envoyée avec succès !";
    } catch (PDOException $e) {
        echo "❌ Erreur : " . $e->getMessage();
    }
}
?>