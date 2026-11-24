
<?php

// CREATE
function inserirPublicacao($con, $dados) {
    $stmt = $con->prepare(
        "INSERT INTO Publicacoes (conteudo, id_usuario)
         VALUES (?, ?)"
    );

    $stmt->execute([
        $dados['conteudo'],
        $dados['id_usuario']
    ]);

    return $con->lastInsertId();
}

// READ
function listarPublicacoes($con) {
    $stmt = $con->query("SELECT * FROM Publicacoes");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// UPDATE
function atualizarPublicacao($con, $id, $dados) {
    $stmt = $con->prepare(
        "UPDATE Publicacoes SET conteudo = ? WHERE id_publicacao = ?"
    );

    $stmt->execute([
        $dados['conteudo'],
        $id
    ]);
}

// DELETE
function removerPublicacao($con, $id) {
    $stmt = $con->prepare(
        "DELETE FROM Publicacoes WHERE id_publicacao = ?"
    );

    $stmt->execute([$id]);
}
