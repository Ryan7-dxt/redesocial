
<?php

// CREATE
function inserirCurtida($con, $dados) {
    $stmt = $con->prepare(
        "INSERT INTO Curtidas (id_usuario, id_publicacao)
         VALUES (?, ?)"
    );

    $stmt->execute([
        $dados['id_usuario'],
        $dados['id_publicacao']
    ]);

    return $con->lastInsertId();
}

// READ
function listarCurtidas($con) {
    $stmt = $con->query("SELECT * FROM Curtidas");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// DELETE
function removerCurtida($con, $id) {
    $stmt = $con->prepare(
        "DELETE FROM Curtidas WHERE id_curtida = ?"
    );

    $stmt->execute([$id]);
}
