<!doctype html>
<html lang='sv' class='no-js'>
<head>
<meta charset='utf-8' />
<title><?=isset($title) ? $title : 'Template for testprograms in JavaScript'?></title>
<link rel="stylesheet/less" type="text/css" href="css/style.less">
<link rel="shortcut icon" href="img/favicon.ico" media="screen">
<script src="js/less.min.js"></script>
<script src="../lib/modernizr.js"></script>
</head>
<body>
    <header id="header">
        <img src="img/logo/logo.png" alt="The HTML, CSS and JS logo" />
        <span id="header-title">JavaScript</span>
        <span id="header-slogan"><q>Databaser, HTML, CSS, JavaScript och PHP</q></span>
    </header>

    <nav id="navbar">
        <a class="<?= selectedPage("index.php") ?>" href="index.php">Hem</a>
        <a class="<?= selectedPage("game.php") ?>" href="game.php">Spel</a>
        <a class="<?= selectedPage("about.php") ?>" href="about.php">Om</a>
    </nav>
