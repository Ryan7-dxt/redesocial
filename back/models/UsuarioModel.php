
<?php

// CREATE
function inserirUsuario($con, $dados) {
    $stmt = $con->prepare(
        "INSERT INTO usuarios (nome, username, email, senha)
         VALUES (?, ?, ?, ?)"
    );

    $senha = password_hash($dados['senha'], PASSWORD_DEFAULT);

    $stmt->execute([
        $dados['nome'],
        $dados['username'],
        $dados['email'],
        $senha
    ]);

    return $con->lastInsertId();
}

// READ
function listarUsuarios($con) {
    $stmt = $con->query("SELECT * FROM usuarios");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// UPDATE
function atualizarUsuario($con, $id, $dados) {
    $senha = password_hash($dados['senha'], PASSWORD_DEFAULT);

    $stmt = $con->prepare(
        "UPDATE usuarios SET senha = ? WHERE id_usuario = ?"
    );

    $stmt->execute([$senha, $id]);
}

// DELETE
function removerUsuario($con, $id) {
    $stmt = $con->prepare(
        "DELETE FROM usuarios WHERE id_usuario = ?"
    );

    $stmt->execute([$id]);
}
