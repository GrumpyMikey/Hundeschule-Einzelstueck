<?php
// send-mail.php

// Aktiviere Error Reporting während der Entwicklung
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// CORS Headers für Sicherheit
header("Access-Control-Allow-Origin: *"); // In Produktion durch konkrete Domain ersetzen
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Nur POST-Requests erlauben
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die(json_encode(["error" => "Methode nicht erlaubt"]));
}

// Eingaben validieren und säubern
$name = isset($_POST['name']) ? filter_var(trim($_POST['name']), FILTER_SANITIZE_STRING) : '';
$email = isset($_POST['email']) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
$message = isset($_POST['message']) ? filter_var(trim($_POST['message']), FILTER_SANITIZE_STRING) : '';

// Überprüfen ob alle Pflichtfelder ausgefüllt sind
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    die(json_encode(["error" => "Bitte alle Pflichtfelder ausfüllen"]));
}

// E-Mail-Adresse validieren
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    die(json_encode(["error" => "Ungültige E-Mail-Adresse"]));
}

// E-Mail-Empfänger
$to = "hundeschule-einzelstueck@mail.de";

// E-Mail-Betreff
$subject = "Neue Kontaktanfrage von der Webseite";

// E-Mail-Header
$headers = [
    "From" => $email,
    "Reply-To" => $email,
    "X-Mailer" => "PHP/" . phpversion(),
    "Content-Type" => "text/html; charset=UTF-8"
];

// E-Mail-Inhalt
$email_content = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #D4145A; color: white; padding: 20px; }
        .content { padding: 20px; }
        .footer { background: #f4f4f4; padding: 20px; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Neue Kontaktanfrage</h2>
        </div>
        <div class='content'>
            <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
            <p><strong>E-Mail:</strong> " . htmlspecialchars($email) . "</p>
            <p><strong>Nachricht:</strong></p>
            <p>" . nl2br(htmlspecialchars($message)) . "</p>
        </div>
        <div class='footer'>
            <p>Diese E-Mail wurde über das Kontaktformular der Webseite gesendet.</p>
        </div>
    </div>
</body>
</html>
";

// Spam-Schutz: Einfache Verzögerung
sleep(1);

// E-Mail senden
try {
    if (mail($to, $subject, $email_content, implode("\r\n", $headers))) {
        http_response_code(200);
        echo json_encode(["message" => "E-Mail wurde erfolgreich versendet"]);
    } else {
        throw new Exception("E-Mail konnte nicht gesendet werden");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Serverfehler beim Senden der E-Mail"]);
}
