<?php
header("Content-Type: application/json");

$response = ['success' => false, 'message' => 'Erro desconhecido.'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

    if (!$email) {
        $response['message'] = 'Formato de e-mail inválido.';
        echo json_encode($response);
        exit;
    }

    try {
        $db = new SQLite3('usuarios.db');

        // Verifica se o e-mail existe
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE email = :email');
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);

        if ($user) {
            // Gera um token seguro
            $token = bin2hex(random_bytes(32));
            // Define a expiração para 1 hora (3600 segundos)
            $expira = time() + 3600;

            // Atualiza o token e a expiração no banco de dados
            $updateStmt = $db->prepare('UPDATE usuarios SET reset_token = :token, reset_token_expira = :expira WHERE email = :email');
            $updateStmt->bindValue(':token', $token, SQLITE3_TEXT);
            $updateStmt->bindValue(':expira', $expira, SQLITE3_INTEGER);
            $updateStmt->bindValue(':email', $email, SQLITE3_TEXT);
            
            if ($updateStmt->execute()) {
                // Simulação de envio de e-mail
                // Em uma aplicação real, aqui você enviaria um e-mail com um link como:
                // $link = "http://seusite.com/redefinir_senha.php?token=" . $token;
                // mail($email, "Redefinição de Senha", "Clique neste link para redefinir sua senha: " . $link);
                
                $response['success'] = true;
                // Mensagem para o usuário final (simulando o envio)
                $response['message'] = 'Se o e-mail estiver cadastrado, instruções para redefinição de senha foram enviadas (simulado).'; 
                 // Para fins de teste durante o desenvolvimento, podemos incluir o token na resposta
                 // Em produção, REMOVA a linha abaixo!
                 // $response['debug_token'] = $token; 
            } else {
                $response['message'] = 'Erro ao atualizar o token no banco de dados.';
            }
        } else {
            // Mesmo que o e-mail não exista, retornamos uma mensagem genérica por segurança
            // para não confirmar quais e-mails estão ou não cadastrados.
             $response['success'] = true; // Ainda retorna sucesso para não vazar informação
             $response['message'] = 'Se o e-mail estiver cadastrado, instruções para redefinição de senha foram enviadas (simulado).';
        }

        $db->close();

    } catch (Exception $e) {
        // Em produção, logar o erro em vez de exibi-lo
        $response['message'] = 'Erro no servidor: ' . $e->getMessage(); 
    }

} else {
    $response['message'] = 'Método de requisição inválido.';
}

echo json_encode($response);
?>
