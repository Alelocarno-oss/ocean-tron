<?php
header("Access-Control-Allow-Origin: *");
$file = 'balances.json';
$data = json_decode(file_get_contents($file), true) ?? [];

if ($_GET['action'] == 'send') {
    $from = $_GET['from'];
    $to = $_GET['to'];
    $amount = (float)$_GET['amount'];

    if (!isset($data[$from])) {
        // Se è il tuo Master e non è nel file, inizializzalo
        if ($from == "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe") $data[$from] = 100000000.00;
        else $data[$from] = 0;
    }

    if ($data[$from] >= $amount) {
        $data[$from] -= $amount;
        $data[$to] = ($data[$to] ?? 0) + $amount;
        file_put_contents($file, json_encode($data));
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Insufficient Balance"]);
    }
} elseif ($_GET['action'] == 'get') {
    $addr = $_GET['address'];
    $bal = $data[$addr] ?? ($addr == "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe" ? 100000000.00 : 0);
    echo json_encode(["balance" => $bal]);
}
?>
