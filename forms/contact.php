<?php
  $receiving_email_address = 'harikrishnab101@gmail.com';

  if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed';
    exit;
  }

  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $subject = trim($_POST['subject'] ?? '');
  $message = trim($_POST['message'] ?? '');

  if ($name === '' || $email === '' || $subject === '' || $message === '') {
    http_response_code(400);
    echo 'Please fill in all required fields.';
    exit;
  }

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo 'Please enter a valid email address.';
    exit;
  }

  foreach ([$name, $email, $subject] as $value) {
    if (preg_match('/[\r\n]/', $value)) {
      http_response_code(400);
      echo 'Invalid form input.';
      exit;
    }
  }

  $safe_name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
  $safe_email = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
  $safe_subject = htmlspecialchars($subject, ENT_QUOTES, 'UTF-8');
  $safe_message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

  $email_subject = 'Portfolio contact form: ' . $safe_subject;
  $email_body = "You received a new message from your portfolio contact form.\n\n";
  $email_body .= "Name: {$safe_name}\n";
  $email_body .= "Email: {$safe_email}\n";
  $email_body .= "Subject: {$safe_subject}\n\n";
  $email_body .= "Message:\n{$safe_message}\n";

  $headers = [
    'From: Portfolio Website <no-reply@' . ($_SERVER['SERVER_NAME'] ?? 'localhost') . '>',
    'Reply-To: ' . $safe_name . ' <' . $safe_email . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion()
  ];

  if (mail($receiving_email_address, $email_subject, $email_body, implode("\r\n", $headers))) {
    echo 'OK';
  } else {
    http_response_code(500);
    echo 'Message could not be sent. Please try again later.';
  }
?>
