<?php
session_start();
// Define o tipo de conteúdo da resposta como JSON
header('Content-Type: application/json'); 

// mensagem padrão de erros
$response = ['success' => false, 'message' => 'Erro desconhecido.'];

try {
    // Caminho do banco de dados
    $dbPath = 'usuarios.db'; 
    if (!file_exists($dbPath)) {
        throw new Exception('Arquivo do banco de dados não encontrado.');
    }
    // Tenta abrir o banco de dados
    $db = new SQLite3($dbPath);
    $db->enableExceptions(true); 

    // Verificar se os dados foram enviados via POST
    if (!isset($_POST['username']) || !isset($_POST['password'])) {
        throw new Exception('Nome de usuário ou senha não fornecidos.');
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    // Preparr e executar a consulta de forma segura
    $stmt = $db->prepare('SELECT * FROM usuarios WHERE username = :username');
    if (!$stmt) throw new Exception('Falha ao preparar consulta: ' . $db->lastErrorMsg());
    
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $result = $stmt->execute();
    if (!$result) throw new Exception('Falha ao executar consulta: ' . $db->lastErrorMsg());

    $user = $result->fetchArray(SQLITE3_ASSOC);
    $stmt->close();

    // Veerifica o usuário e a senha
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user['username'];
        //mensagem de sucesso
        $response = ['success' => true, 'message' => 'Login bem-sucedido!'];

    } else {
        // mesnagem de erro
        $response['message'] = 'Usuário ou senha incorretos.';
    }

    $db->close(); 

} catch (Exception $e) {
    
    error_log('Erro em login.php: ' . $e->getMessage()); 
    $response['message'] = 'Ocorreu um erro no servidor. Tente novamente.';
}

echo json_encode($response); 
?>
