<?php
$token = filter_input(INPUT_GET, 'token', FILTER_SANITIZE_STRING);
$mensagem = '';
$mostrar_formulario = false;

if (!$token) {
    $mensagem = 'Token inválido ou não fornecido.';
} else {
    try {
        $db = new SQLite3('usuarios.db');

        // Verifica se o token é válido e não expirou
        $stmt = $db->prepare('SELECT id FROM usuarios WHERE reset_token = :token AND reset_token_expira > :agora');
        $stmt->bindValue(':token', $token, SQLITE3_TEXT);
        $stmt->bindValue(':agora', time(), SQLITE3_INTEGER);
        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);

        if ($user) {
            // Token válido, mostra o formulário
            $mostrar_formulario = true;
        } else {
            // Token inválido ou expirado
            $mensagem = 'Token inválido ou expirado. Por favor, solicite a redefinição novamente.';
            // Opcional: Limpar o token expirado do banco aqui, se desejado.
            // $cleanupStmt = $db->prepare('UPDATE usuarios SET reset_token = NULL, reset_token_expira = NULL WHERE reset_token = :token');
            // $cleanupStmt->bindValue(':token', $token, SQLITE3_TEXT);
            // $cleanupStmt->execute();
        }

        $db->close();

    } catch (Exception $e) {
        $mensagem = 'Erro no servidor ao validar o token: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinir Senha</title>
    <!-- Incluir CSS básico ou linkar para o seu CSS principal se aplicável -->
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
        .container-redefinir {
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
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .mensagem-sucesso {
             color: #155724;
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            text-align: left;
        }
        input[type="password"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box;
        }
        button {
            background-color: #5cb85c;
            color: white;
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            transition: background-color 0.3s ease;
        }
        button:hover {
            background-color: #4cae4c;
        }
        #password-strength {
            margin-top: -10px;
            margin-bottom: 15px;
            font-size: 0.8em;
            text-align: left;
        }
    </style>
</head>
<body>
    <div class="container-redefinir">
        <h2>Redefinir Senha</h2>

        <?php if ($mensagem && !$mostrar_formulario): ?>
            <div class="mensagem-erro"><?php echo htmlspecialchars($mensagem); ?></div>
            <p><a href="index.html">Voltar para a página inicial</a></p>
        <?php endif; ?>

        <?php if ($mostrar_formulario): ?>
            <form id="form-nova-senha" action="atualizar_senha.php" method="post" autocomplete="off">
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">
                
                <label for="nova_senha">Nova Senha:</label>
                <input type="password" id="nova_senha" name="nova_senha" required minlength="6">
                <div id="password-strength"></div>

                <label for="confirmar_senha">Confirmar Nova Senha:</label>
                <input type="password" id="confirmar_senha" name="confirmar_senha" required minlength="6">

                <button type="submit">Redefinir Senha</button>
            </form>
            <div id="mensagem-feedback" style="margin-top: 15px;"></div>
        <?php endif; ?>

    </div>

    <script>
        // Script simples para feedback de confirmação de senha
        const form = document.getElementById('form-nova-senha');
        const novaSenhaInput = document.getElementById('nova_senha');
        const confirmarSenhaInput = document.getElementById('confirmar_senha');
        const feedbackDiv = document.getElementById('mensagem-feedback');

        if (form) {
            form.addEventListener('submit', function(event) {
                feedbackDiv.textContent = ''; // Limpa mensagens anteriores
                feedbackDiv.className = '';

                if (novaSenhaInput.value !== confirmarSenhaInput.value) {
                    event.preventDefault(); // Impede o envio do formulário
                    feedbackDiv.textContent = 'As senhas não coincidem!';
                    feedbackDiv.className = 'mensagem-erro';
                    novaSenhaInput.focus();
                } else if (novaSenhaInput.value.length < 6) {
                     event.preventDefault(); // Impede o envio do formulário
                    feedbackDiv.textContent = 'A senha deve ter pelo menos 6 caracteres.';
                    feedbackDiv.className = 'mensagem-erro';
                    novaSenhaInput.focus();
                }
                // Se tudo estiver ok, o formulário será enviado para atualizar_senha.php
            });
        }
    </script>
</body>
</html>
