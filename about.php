<?php
include(__DIR__ . "/incl/config.php");
$title = "Hem | Space Invaders";
include(__DIR__ . "/incl/header.php");
?>
<article>
    <h1>Om spelet</h1>
    <p>Det här är sidan för dig som gillar att spela det klassiska arkadspelet
    Space Invaders, som går ut på att hindra utomjordingarna att ta över jorden.</p>
    <p>Du styr kanonen med vänster respektive höger piltangent. För att avfyra en
    missil använder du mellanslag.</p>
    <p>Det gäller att skjuta ned så många utomjordingar som möjligt innan dina tre
    kanoner är förbrukade eller innan utomjordingarna har nått jorden. Du får olika
    poäng beroende på vilket typ av utomjording du träffar med kanonens missiler.
    Ju fler utomjordingar du träffar, desto snabbare rör sig utomjordingarna. När
    de har nått vänster respektive höger kanten, flyttas utomjordingarna ned ett
    steg. Det gäller för dig att hindra att utomjordingarna når jorden.</p>
    <p>Det finns också ett rött mystiskt rymdskepp som då och då rör sig högt uppe
    i rymden. Lyckas du skjuta ned rymdskeppet får du extra poäng.</p>
    <p>Efter spelet är slut kan du skriva in ditt namn för att komma med i poänglistan.</p>
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
