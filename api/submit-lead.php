<?php
// === CORS & Headers ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  http_response_code(200);
  exit();
}

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

// === Allow only POST ===
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(["error" => "Méthode non autorisée"]);
  exit;
}

// === Security: allow only from your domain ===
$allowed_domains = [
  'panneauxsolairfrance.com',
  'www.panneauxsolairfrance.com',
];
$referer = $_SERVER['HTTP_REFERER'] ?? '';
$valid_referer = false;

if (!empty($referer)) {
  $parsed = parse_url($referer);
  $referer_host = $parsed['host'] ?? '';
  foreach ($allowed_domains as $domain) {
    if (strcasecmp($referer_host, $domain) === 0) {
      $valid_referer = true;
      break;
    }
  }
}

if (!$valid_referer) {
  http_response_code(403);
  echo json_encode(["error" => "Accès refusé"]);
  exit;
}

// === Database connection ===
$servername = "panneae610.mysql.db";
$username = "panneae610";
$password = "X9vB3qLrT6m2";
$dbname = "panneae610";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Erreur connexion DB"]);
  exit;
}

// === Get JSON or Form Data ===
$raw = file_get_contents('php://input');
$input = json_decode($raw, true);
if (json_last_error() !== JSON_ERROR_NONE || !$input) {
  $input = $_POST;
}

// === Sanitize ===
function clean($data) {
  return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

$name = clean($input['name'] ?? '');
$email = clean($input['email'] ?? '');
$phone = clean($input['phone'] ?? '');
$address = clean($input['address'] ?? '');
$postal_code = clean($input['postal_code'] ?? '');
$project_type = clean($input['project_type'] ?? '');
$heating_type = clean($input['heating_type'] ?? '');
$current_energy_bill = clean($input['current_energy_bill'] ?? '');
$preferred_contact_time = clean($input['preferred_contact_time'] ?? '');
$newsletter = isset($input['newsletter']) && $input['newsletter'] ? 1 : 0;
$form_type = clean($input['form_type'] ?? '');

// === Validate required fields ===
if (!$name || !$email || !$phone) {
  http_response_code(400);
  echo json_encode(["error" => "Champs obligatoires manquants"]);
  exit;
}

// === Insert lead into DB ===
$stmt = $conn->prepare("INSERT INTO leads 
(name, email, phone, address, postal_code, project_type, heating_type, current_energy_bill, preferred_contact_time, newsletter, form_type, created_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");

$stmt->bind_param(
  "sssssssssss",
  $name,
  $email,
  $phone,
  $address,
  $postal_code,
  $project_type,
  $heating_type,
  $current_energy_bill,
  $preferred_contact_time,
  $newsletter,
  $form_type
);

if ($stmt->execute()) {
  // === Send confirmation email (non-blocking for the redirect) ===
  $subject = "Merci pour votre demande - Panneaux Solair France";
 $message = "
<!DOCTYPE html>
<html lang='fr'>
  <head>
    <meta charset='UTF-8' />
    <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    <title>Merci pour votre demande</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        background-color: #f8f9fa;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }
      .header {
        background: linear-gradient(135deg, #2ecc71, #27ae60);
        color: white;
        text-align: center;
        padding: 30px 20px;
      }
      .header img {
        max-width: 100px;
        margin-bottom: 15px;
      }
      .content {
        padding: 30px 20px;
        line-height: 1.6;
      }
      .content h1 {
        color: #2ecc71;
        font-size: 24px;
        margin-bottom: 10px;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #2ecc71;
        color: white;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
      }
      .footer {
        background-color: #f1f3f4;
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #666;
      }
      @media (max-width: 600px) {
        .content {
          padding: 20px 15px;
        }
      }
    </style>
  </head>
  <body>
    <div class='email-container'>
      <div class='header'>
        <img src='https://panneauxsolairfrance.com/images/francepanneaux-solaires-france-logo.png' alt='Logo Autoconsommation Solaire France' />
        <h2>Autoconsommation Solaire France</h2>
      </div>

      <div class='content'>
        <h1>Merci pour votre demande, {$name} 🌞</h1>
        <p>
          Nous avons bien reçu votre demande de devis pour l’installation de panneaux solaires.
        </p>
        <p>
          Un conseiller va vous contacter très prochainement pour finaliser votre étude et vous
          proposer une solution sur mesure pour réduire votre facture d’électricité.
        </p>
        <p style='margin-top: 20px;'>
          En attendant, découvrez comment nos clients économisent jusqu’à <strong>70 %</strong> sur leur facture :
        </p>

        <a href='https://panneauxsolairfrance.com/#avantages-panneaux-solaires' class='button'>
          Découvrir les avantages
        </a>
      </div>

      <div class='footer'>
        © 2025 Autoconsommation Solaire France<br />
        <a href='https://panneauxsolairfrance.com' style='color:#27ae60; text-decoration:none;'>panneauxsolairfrance.com</a>
      </div>
    </div>
  </body>
</html>";


  $headers = "MIME-Version: 1.0\r\n";
  $headers .= "Content-type:text/html;charset=UTF-8\r\n";
  $headers .= "From: Panneaux Solair France <no-reply@panneauxsolairfrance.com>\r\n";

  // Send the email (OVH supports mail() by default)
  @mail($email, $subject, $message, $headers);

  $token = hash('sha256', $email . time() . rand());


 
  echo json_encode(["success" => true, "token" => $token]);

} else {
  http_response_code(500);
  echo json_encode(["error" => "Erreur lors de l'insertion du lead"]);
}

$stmt->close();
$conn->close();
?>
