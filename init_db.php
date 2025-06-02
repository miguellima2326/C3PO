<?php
// init_db.php - ATUALIZADO com Nome Completo e E-mail

$db = new SQLite3('usuarios.db');

// Cria a tabela com as novas colunas
$db->exec("CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_completo TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
)");

// Senha em texto puro para o usuário de teste
$plainPassword = 'Dev1234';

// Criptografa a senha
$hashedPassword = password_hash($plainPassword, PASSWORD_DEFAULT);

// Verifica se o usuário 'Dev' já existe antes de inserir
$stmt = $db->prepare('SELECT id FROM usuarios WHERE username = :username');
$stmt->bindValue(':username', 'Dev', SQLITE3_TEXT);
$result = $stmt->execute();

if (!$result->fetchArray()) {
    // Insere o usuário 'Dev' com os novos campos
    $insertStmt = $db->prepare("
        INSERT INTO usuarios (nome_completo, email, username, password) 
        VALUES (:nome_completo, :email, :username, :password)
    ");
    $insertStmt->bindValue(':nome_completo', 'Desenvolvedor', SQLITE3_TEXT);
    $insertStmt->bindValue(':email', 'dev@email.com', SQLITE3_TEXT);
    $insertStmt->bindValue(':username', 'Dev', SQLITE3_TEXT);
    $insertStmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
    $insertStmt->execute();
    echo "Usuário 'Dev' criado com sucesso com os novos campos!<br>";
} else {
    echo "Usuário 'Dev' já existe.<br>";
}

echo "Banco de dados pronto para uso!";
?>