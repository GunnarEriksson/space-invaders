<!doctype html>
<html lang='sv' class='no-js'>
<head>
<meta charset='utf-8' />
<title><?=isset($title) ? $title : 'Template for testprograms in JavaScript'?></title>
<link rel="stylesheet/less" type="text/css" href="css/style.less">
<link rel="shortcut icon" href="img/favicon.ico" media="screen">
<script src="js/less.min.js"></script>
<script src="js/modernizr.js"></script>
</head>
<body>
    <header id="header"></header>

    <nav id="navbar">
        <a class="<?= selectedPage("index.php") ?>" href="index.php">Hem</a>
        <a class="<?= selectedPage("game.php") ?>" href="game.php">Spel</a>
        <a class="<?= selectedPage("about.php") ?>" href="about.php">Om</a>
    </nav>
