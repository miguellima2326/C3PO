<?php
$mensagem = ".";
$sucesso = false;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $token = filter_input(INPUT_POST, 'token', FILTER_SANITIZE_STRING);
    $nova_senha = $_POST['nova_senha'] ?? ''; // Não filtrar ainda para verificar o tamanho
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    // Validações básicas
    if (!$token) {
        $mensagem = "Token não fornecido.";
    } elseif (empty($nova_senha) || empty($confirmar_senha)) {
        $mensagem = "Por favor, preencha ambos os campos de senha.";
    } elseif ($nova_senha !== $confirmar_senha) {
        $mensagem = "As senhas não coincidem.";
    } elseif (strlen($nova_senha) < 6) {
        $mensagem = "A nova senha deve ter pelo menos 6 caracteres.";
    } else {
        // Validações passaram, processar atualização
        try {
            $db = new SQLite3('usuarios.db');

            // Verifica o token novamente (importante!)
            $stmt = $db->prepare('SELECT id FROM usuarios WHERE reset_token = :token AND reset_token_expira > :agora');
            $stmt->bindValue(':token', $token, SQLITE3_TEXT);
            $stmt->bindValue(':agora', time(), SQLITE3_INTEGER);
            $result = $stmt->execute();
            $user = $result->fetchArray(SQLITE3_ASSOC);

            if ($user) {
                // Token válido, atualiza a senha e invalida o token
                $hashedPassword = password_hash($nova_senha, PASSWORD_DEFAULT);

                $updateStmt = $db->prepare('UPDATE usuarios SET password = :password, reset_token = NULL, reset_token_expira = NULL WHERE id = :id');
                $updateStmt->bindValue(':password', $hashedPassword, SQLITE3_TEXT);
                $updateStmt->bindValue(':id', $user['id'], SQLITE3_INTEGER);
                
                if ($updateStmt->execute()) {
                    $sucesso = true;
                    $mensagem = "Sua senha foi redefinida com sucesso!";
                } else {
                    $mensagem = "Erro ao atualizar a senha no banco de dados.";
                }
            } else {
                // Token inválido ou expirado
                $mensagem = "Token inválido ou expirado. Por favor, solicite a redefinição novamente.";
            }

            $db->close();

        } catch (Exception $e) {
            $mensagem = "Erro no servidor ao atualizar a senha: " . $e->getMessage();
        }
    }
} else {
    $mensagem = "Método de requisição inválido.";
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Atualização de Senha</title>
    <link rel="stylesheet" href="css/styles.css"> 
     <style>
        body {
            font-family: sans-serif;
            background-color: #f4f4f4;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
        }
        .container-feedback {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
            text-align: center;
        }
         h2 {
            color: #333;
            margin-bottom: 20px;
        }
        .mensagem-erro {
            color: #dc3545;
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .mensagem-sucesso {
             color: #155724;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        a {
            color: #007bff;
            text-decoration: none;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container-feedback">
        <h2>Status da Redefinição</h2>
        <?php if ($sucesso): ?>
            <div class="mensagem-sucesso"><?php echo htmlspecialchars($mensagem); ?></div>
            <p>Você já pode tentar fazer login com sua nova senha.</p>
        <?php else: ?>
            <div class="mensagem-erro"><?php echo htmlspecialchars($mensagem); ?></div>
            <p>Por favor, tente solicitar a redefinição novamente se necessário.</p>
        <?php endif; ?>
        <br>
        <p><a href="index.html">Voltar para a página inicial</a></p>
    </div>
</body>
</html>
