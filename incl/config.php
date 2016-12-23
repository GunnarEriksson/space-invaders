<?php
// Create and define a DSN for the database
define("DSN", "sqlite:" . __DIR__ . "/../db/si_game.sqlite");

/**
 * Checks if web page is active
 *
 * Checks the file name against the file which was given in order
 * to access this page. If it is, the function returns the string
 * selected. If not, the function returns an emtpy string.
 *
 * @param string $fileName - the file name to compare.
 * @return string - the string 'selected' if the file name is equal
 *                  to the file which was given in order to access
 *                  this page. If not, an empty string is returned.
 */
 function selectedPage($fileName)
 {
     $class = '';
     if (strpos($_SERVER['REQUEST_URI'], $fileName)) {
         $class = 'selected';
     }

     return $class;
 }

 /**
 * Connects the database.
 *
 * Open the database file and catch the exception it it fails,
 * add an explanation and re-throw the exception.
 *
 * @throws PDOException if the attempt to connect to the requested
 * database fails.
 *
 * @return PDO as the database connection.
 */
function connectToDb()
{
    try {
        $db = new PDO(DSN);
        $db -> setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
    } catch (PDOException $exception) {
        echo "Failed to connect to the database using DSN: " . DSN . "<br>";
        throw $exception;
    }
}

/**
 * Sends query to the database.
 *
 * Prepares an SQL statement, with or without parameters, and sends the query
 * to a database server. Returns the result array from the query.
 *
 * @param string $db the database server to send the statement to.
 * @param PDO $sql the SQL statement to send to the database.
 * @param integer $pdoFetchType the fetch type to fetch data from database.
 * @param array $params the array with parameters that can be sent to the
 *                      database. Is set to null as default.
 *
 * @return [] $res the resultset from the query to a database.
 */
function sendQueryToDb($db, $sql, $pdoFetchType, $params = null)
{
    $stmt = $db->prepare($sql);

    if (isset($params)) {
        $stmt->execute($params);
    } else {
        $stmt->execute();
    }

    return $stmt->fetchAll($pdoFetchType);
}
