<?php
//Подключение файлов
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer-6.4.1/src/Exception.php';
require 'PHPMailer-6.4.1/src/PHPMailer.php';

$mail = new PHPMailer(true);
$mail->CharSet = 'UTF-8';
$mail->setLanguage('ru', 'PHPMailer-6.4.1/language/');
$mail->IsHTML(true);

//От кого письмо
$mail->setForm('nateriver345@gmail.com', 'River');
//Кому отправить
$mail->addAddress('volodyapgg1@gmail.com');
//Тема письма
$mail->Subject = 'Hello';

$hand = "Правая";
if ($_POST['hand'] == 'left'){
  $hand = 'Левая';
}

//Тело письма
$body = '<h1>Супер письмо!</h1>';

if (trim(!empty($_POST['name']))){
  $body.='<p><strong>Имя:</strong> '.$_POST['name'].'</p>';
}

if (trim(!empty($_POST['email']))){
  $body.='<p><strong>E-mail:</strong> '.$_POST['email'].'</p>';
}

if (trim(!empty($_POST['hand']))){
  $body.='<p><strong>Рука:</strong> '.$hand.'</p>';
}

if (trim(!empty($_POST['age']))){
  $body.='<p><strong>Возраст:</strong> '.$_POST['age'].'</p>';
}

if (trim(!empty($_POST['message']))){
  $body.='<p><strong>Имя:</strong> '.$_POST['message'].'</p>';
}

//Прикрепить файл
if (!empty($_FILES['image']['tmp_name'])) {
  //Путь загрузки
  $filePath = __DIR__ . "/files/" . $_FILES['image']['name'];
  //Загрузка файла
  if (copy($_FILES['image']['tmp_name'], $filePath)) {
    $fileAttach = $filePath;
    $body.='<p><strong>Фото в приложении</strong></p>';
    $mail->addAttachment($fileAttach);
  }
}

$mail->Body = $body;

//Отправка
if (!$mail->send()) {
  $message = 'Ошибка отправки!';
} else {
  $message = 'Данные успешно отправленны!';
}

$response =['message' => $message];

header('Content-type: application/json');
echo json_encode($response);

?>