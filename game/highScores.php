<?php
include("../incl/config.php");

/**
 * Gets the highest score from the high score list.
 *
 * @return integer  the highest score in the high score list.
 */
function getHighScoreFromDB()
{
    $highScore;
    $res = [];
    try {
        $db = connectToDb();
        $sql = "SELECT score FROM si_high_score ORDER BY score desc LIMIT 1";
        $res = sendQueryToDb($db, $sql, PDO::FETCH_ASSOC);
        $highScore = isset($res[0]['score']) ? $res[0]['score'] : 0;
    } catch (PDOException $exception) {
        $highScore = 0;
        log("Exception when getting high score value: " . $exception);
    }

    return $highScore;
}

/**
 * Gets name and score from the high score list in the database.
 *
 * @param  integer $offset  the start position in the high score list.
 * @param  integer $limit   the number of items to get from the list.
 *
 * @return object[]         the array of players and the related scores.
 */
function getHighScoreListFromDB($offset, $limit)
{
    $res = [];
    try {
        $db = connectToDb();
        $sql = "SELECT name, score FROM si_high_score ORDER BY score desc LIMIT $limit OFFSET $offset";
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

/**
 * Adds a players name and score to the database.
 *
 * @param string $name      the name of the player.
 * @param integer $score    the players score.
 *
 * @return void
 */
function addResultInDB($name, $score)
{
    $res = [];
    try {
        $db = connectToDb();
        $sql = "INSERT INTO si_high_score (name, score) VALUES (?, ?)";
        $params = [$name, $score];
        $res = sendQueryToDb($db, $sql, PDO::FETCH_ASSOC, $params);
    } catch (PDOException $exception) {
        log("Exception when getting high score value: " . $exception);
    }

    return $res;
}

$data = null;

// Get incoming on what to do
$action = isset($_GET['action']) ? $_GET['action'] : null;

if ($action == 'getHighScore') {
    $data = getHighScoreFromDB();
}

if ($action == 'getHighScoreList') {
    $offset = isset($_POST['offset']) ? $_POST['offset'] : 0;
    $limit = isset($_POST['limit']) ? $_POST['limit'] : 10;
    $data = getHighScoreListFromDB($offset, $limit);
}

if ($action == 'addResult') {
    $name = isset($_POST['name']) ? $_POST['name'] : "Anonymous";
    $score = isset($_POST['score']) ? $_POST['score'] : 0;
    $data = addResultInDB($name, $score);
}

// Print out the content of the shopping cart
header('Content-type: application/json');
echo json_encode($data);
