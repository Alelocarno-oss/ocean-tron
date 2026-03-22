<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
$file = 'balances.json';
$master = "TVi3MehBatfYSUutm4fPeR6y5bqnQjWEYe";

if (!file_exists($file)) { file_put_contents($file, json_encode([$master => 100000000.00])); }
$data = json_decode(file_get_contents($file), true);

$action = $_GET['action'] ?? '';
$addr = $_GET['address'] ?? $_GET['from'] ?? '';

if ($action == 'get') {
    $bal = isset($data[$addr]) ? $data[$addr] : ($addr == $master ? 100000000.00 : 0.00);
    echo json_encode(["balance" => $bal]);
} 
elseif ($action == 'send') {
    $from = $_GET['from'];
    $to = $_GET['to'];
    $amount = (float)$_GET['amount'];
    
    $currentFrom = isset($data[$from]) ? $data[$from] : ($from == $master ? 100000000.00 : 0.00);
    
    if ($currentFrom >= $amount) {
        $data[$from] = $currentFrom - $amount;
        $data[$to] = (isset($data[$to]) ? $data[$to] : 0) + $amount;
        file_put_contents($file, json_encode($data));
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Insufficient Balance"]);
    }
}
?>
