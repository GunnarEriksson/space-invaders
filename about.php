<?php
include(__DIR__ . "/incl/config.php");
$title = "Hem | Space Invaders";
include(__DIR__ . "/incl/header.php");
?>
<article>
    <h1>Om spelsidan</h1>
    <p>Det här är sidan för dig som gillar att spela det klassiska arkadspelet
    Space Invaders, som går ut på att hindra utomjordingarna att ta över jorden.</p>
    <p>Spelet är ett avslutande projekt i kursen JavaScript, jQuery och AJAX med
    HTML5 och PHP (DV1483) som är den avslutande kursen i kurspaketet
    “Databaser, HTML, CSS, JavaScript och PHP” (30 hp) som ges av Blekinge
    Tekniska Högskola (BTH).</p>
</article>
<footer class="byline">
    <p>
        <img src="./img/me/byline.jpg" alt="En bild på Gunnar Eriksson">
        Webbsidan är skapad av Gunnar Eriksson i ett kursmoment som avslutar
        och eximinerar kursen JavaScript, jQuery och AJAX med HTML5 och PHP
        som ges av Blekinge Tekniska Högskola (BTH). Gunnar har arbetat med
        systemutveckling i språken C++ och Java under många år. Studerar nu
        webbprogrammering vid BTH.
    </p>
</footer>

<?php $path=__DIR__; include(__DIR__ . "/incl/footer.php"); ?>
<?php $path=__DIR__; include(__DIR__ . "/incl/end-of-page.php"); ?>
