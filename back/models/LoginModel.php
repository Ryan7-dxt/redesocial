
<?php

function buscarUsuarioLogin($con, $login) {
    $stmt = $con->prepare(
        "SELECT * FROM usuarios
         WHERE username = ? OR email = ?"
    );

    $stmt->execute([$login, $login]);

    return $stmt->fetch(PDO::FETCH_ASSOC);
}
