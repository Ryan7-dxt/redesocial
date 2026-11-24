
<?php

require_once __DIR__ . "/../models/LoginModel.php";

function loginUsuario($con) {

    $dados = json_decode(file_get_contents("php://input"), true);

    if (
        !is_array($dados) ||
        !isset($dados['login']) ||
        !isset($dados['senha']) ||
        trim($dados['login']) === '' ||
        trim($dados['senha']) === ''
    ) {
        http_response_code(400);
        echo json_encode([
            "erro" => "Informe o usuário e a senha!"
        ]);
        return;
    }

    $usuario = buscarUsuarioLogin($con, $dados['login']);

    if (!$usuario) {
        http_response_code(401);
        echo json_encode([
            "erro" => "Usuário ou senha incorretos!"
        ]);
        return;
    }

    // Verifica senha criptografada ou senha antiga em texto
    $senhaCorreta = password_verify(
        $dados['senha'],
        $usuario['senha']
    ) || hash_equals(
        $usuario['senha'],
        $dados['senha']
    );

    if (!$senhaCorreta) {
        http_response_code(401);
        echo json_encode([
            "erro" => "Usuário ou senha incorretos!"
        ]);
        return;
    }

    // Atualiza senhas antigas para formato criptografado
    if (!password_get_info($usuario['senha'])['algo']) {
        $novaSenha = password_hash(
            $dados['senha'],
            PASSWORD_DEFAULT
        );

        $stmt = $con->prepare(
            "UPDATE usuarios SET senha = ? WHERE id_usuario = ?"
        );

        $stmt->execute([
            $novaSenha,
            $usuario['id_usuario']
        ]);
    }

    echo json_encode([
        "mensagem" => "Login realizado com sucesso!",
        "usuario" => [
            "id_usuario" => $usuario['id_usuario'],
            "nome" => $usuario['nome'],
            "username" => $usuario['username'],
            "email" => $usuario['email']
        ]
    ]);
}
