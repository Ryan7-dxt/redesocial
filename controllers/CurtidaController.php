
<?php

require_once __DIR__ . "/../models/CurtidaModel.php";

// Recebe os dados da curtida
function receberDadosCurtida() {
    $dados = json_decode(file_get_contents("php://input"), true);

    if (
        !is_array($dados) ||
        !isset($dados['id_usuario']) ||
        !isset($dados['id_publicacao'])
    ) {
        http_response_code(400);
        echo json_encode(["erro" => "Informe o usuário e a publicação!"]);
        return null;
    }

    return $dados;
}

function receberIdCurtida() {
    $id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT,
        ["options" => ["min_range" => 1]]);

    if ($id === false) {
        http_response_code(400);
        echo json_encode(["erro" => "Informe um id de curtida válido"]);
        return null;
    }

    return $id;
}

// CREATE
function createCurtida($con) {
    $dados = receberDadosCurtida();

    if ($dados === null) {
        return;
    }

    $id = inserirCurtida($con, $dados);

    http_response_code(201);
    echo json_encode([
        "mensagem" => "Curtida registrada com sucesso!",
        "id" => $id
    ]);
}

// READ
function readCurtida($con) {
    echo json_encode(listarCurtidas($con));
}

// DELETE
function deleteCurtida($con) {
    $id = receberIdCurtida();

    if ($id === null) {
        return;
    }

    removerCurtida($con, $id);

    echo json_encode(["mensagem" => "Curtida removida com sucesso!"]);
}
