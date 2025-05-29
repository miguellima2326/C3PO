<?php
session_start();
// Define o tipo de conteúdo da resposta como JSON
header('Content-Type: application/json'); 

// Prepara uma resposta padrão de erro
$response = ['success' => false, 'message' => 'Erro desconhecido.'];

try {
    // Certifique-se de que o caminho para usuarios.db está correto
    $dbPath = 'usuarios.db'; 
    if (!file_exists($dbPath)) {
        throw new Exception('Arquivo do banco de dados não encontrado.');
    }
    // Tenta abrir o banco de dados
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true); // Habilita exceções para erros do SQLite

    // Verifica se os dados foram enviados via POST
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception('Nome de usuário ou senha não fornecidos.');
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepara e executa a consulta de forma segura
    $stmt = $db->prepare('SELECT * FROM users WHERE username = :username');
    if (!$stmt) throw new Exception('Falha ao preparar consulta: ' . $db->lastErrorMsg());
    
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $result = $stmt->execute();
    if (!$result) throw new Exception('Falha ao executar consulta: ' . $db->lastErrorMsg());

    $user = $result->fetchArray(SQLITE3_ASSOC);
    $stmt->close(); // Fecha o statement

    // Verifica o usuário e a senha
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user['username'];
        // Define a resposta de sucesso
        $response = ['success' => true, 'message' => 'Login bem-sucedido!'];
        // O redirecionamento foi removido - o JavaScript cuidará disso
    } else {
        // Define a mensagem de erro específica
        $response['message'] = 'Usuário ou senha incorretos.';
    }

    $db->close(); // Fecha a conexão com o banco

} catch (Exception $e) {
    // Em caso de qualquer erro, registra (opcional) e define a mensagem de erro genérica
    error_log('Erro em login.php: ' . $e->getMessage()); // Log para debug
    $response['message'] = 'Ocorreu um erro no servidor. Tente novamente.';
    // http_response_code(500 ); // Opcional: definir código de erro HTTP
}

// Envia a resposta final como JSON
echo json_encode($response); 
?>
