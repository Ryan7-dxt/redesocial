<?php

$host = "localhost";
$dbname = "redesocial";
$user = "root";
$senha = "";

try {
    $con = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $senha);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Erro na conexão: " . $e->getMessage();
}