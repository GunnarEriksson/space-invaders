<?php
include("../incl/config.php");

function getHighScoreFromDB()
{
    $highScore;
    $res = [];
    try {
        $db = connectToDb();
        $sql = "SELECT score FROM si_high_score ORDER BY score desc LIMIT 1";
        $res = sendQueryToDb($db, $sql, PDO::FETCH_ASSOC);
        $highScore = $res[0]['score'];
    } catch (PDOException $exception) {
        $highScore = 0;
        log("Exception when getting high score value: " . $exception);
    }

    return $highScore;
}

function getHighScoreListFromDB()
{
    $res = [];
    try {
        $db = connectToDb();
        $sql = "SELECT name, score FROM si_high_score ORDER BY score desc LIMIT 10";
        $res = sendQueryToDb($db, $sql, PDO::FETCH_ASSOC);
    } catch (PDOException $exception) {
        log("Exception when getting high score value: " . $exception);
    }

    $highScore = [];
    foreach ($res as $row) {
        $highScore[] = [
            'name' => $row['name'],
            'score' => $row['score']
        ];
    }

    return array("scoreList" => $highScore);
}

$data = null;

// Get incoming on what to do
$action = isset($_GET['action']) ? $_GET['action'] : null;

if ($action == 'getHighScore') {
    $data = getHighScoreFromDB();
}

if ($action == 'getHighScoreList') {
    $data = getHighScoreListFromDB();
}

// Print out the content of the shopping cart
header('Content-type: application/json');
echo json_encode($data);
