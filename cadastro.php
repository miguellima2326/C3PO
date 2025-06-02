<?php
// cadastro.php - ATUALIZADO para incluir Nome Completo e E-mail

header('Content-Type: application/json');

$response = ['success' => false, 'message' => 'Erro desconhecido.'];

try {
    // --- Validação de Entrada ---
    $required_fields = ['nome_completo', 'email', 'username', 'password'];
    foreach ($required_fields as $field) {
        if (!isset($_POST[$field]) || empty(trim($_POST[$field]))) {
            throw new Exception('Todos os campos são obrigatórios.');
        }
    }

    $nome_completo = trim($_POST['nome_completo']);
    $email = trim($_POST['email']);
    $username = trim($_POST['username']);
    $password = $_POST['password'];

    // Validação específica do E-mail
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Formato de e-mail inválido.');
    }
    
    // Validação específica da Senha
    if (strlen($password) < 6) {
        throw new Exception('A senha deve ter no mínimo 6 caracteres.');
    }

    // --- Conexão e Lógica com o Banco de Dados ---
    $db = new SQLite3('usuarios.db');
    $db->enableExceptions(true);

    // 1. Verificar se o username OU o e-mail já existem
    $stmt = $db->prepare('SELECT id FROM usuarios WHERE username = :username OR email = :email');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();

    if ($result->fetchArray()) {
        throw new Exception('Usuário ou e-mail já cadastrado.');
    }
    $stmt->close();
    
    // 2. Criptografar a senha (HASH)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // 3. Inserir o novo usuário no banco de dados
    $stmt = $db->prepare('
        INSERT INTO usuarios (nome_completo, email, username, password) 
        VALUES (:nome_completo, :email, :username, :password)
    ');
    $stmt->bindValue(':nome_completo', $nome_completo, SQLITE3_TEXT);
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $stmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
    $stmt->execute();
    $stmt->close();

    $db->close();
    
    $response = ['success' => true, 'message' => 'Cadastro realizado com sucesso! Você já pode fazer o login.'];

} catch (Exception $e) {
    // Para o usuário final, uma mensagem genérica é mais segura.
    $response['message'] = $e->getMessage();
}

echo json_encode($response);
?>