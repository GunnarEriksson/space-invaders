<?php
include(__DIR__ . "/incl/config.php");
$title = "Spel | JavaScript";
include(__DIR__ . "/incl/header.php");
?>

<article id="game">
    <h1>Space Invaders</h1>
    <div id='flash'>
        <canvas id="canvas" width="900" height="650"></canvas>
    </div>
</article>

<?php $path=__DIR__; include(__DIR__ . "/incl/footer.php"); ?>
<?php $path=__DIR__; include(__DIR__ . "/incl/si-scripts.php"); ?>
<?php $path=__DIR__; include(__DIR__ . "/incl/end-of-page.php"); ?>
