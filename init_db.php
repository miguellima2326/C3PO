<?php
$db = new SQLite3('usuarios.db');
$db->exec("CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)");
$db->exec("INSERT INTO usuarios (username, password) VALUES ('Dev', 'Dev1234')");
echo "Banco de dados criado com sucesso!";
?>
