<?php
include(__DIR__ . "/incl/config.php");
$title = "Hem | Space Invaders";
include(__DIR__ . "/incl/header.php");
?>
<article>
    <h1>Välkommen till spelsidan Space Invaders</h1>
    <img src="./img/index/si_intro.jpg" alt="Bilder från spelet som visar intro, spelet och poänglistan">
    <p>Här är sidan för alla som gillar att spela det klassiska arkadspelet
    Space Invaders.</p>
    <p>Det klassiska spelet som går ut på att med en kanon försöka hindra
    utomjordingarna från att ta över jorden. Om utomjordingarna lyckas förstöra
    din kanon, så har du ytterligare två kanoner som du kan använda. Dock bara
    en åt gången. Du får olika poäng för varje utomjording du skjuter ner beroende
    på vilket typ av utomjording det är. Lyckas du skjuta ner det mystiska skeppet
    som dyker upp då och då, så får du extra poäng. När utomjordingarna har förstört
    alla dina kanoner eller har nått jorden är spelet över. Då kan du skriva in
    ditt namn och kanske hamna överst i poänglistan.</p>
    <p>Hur du spelar spelet, visas under menyn Om.</p>
    <p>Lycka till!</p>
</article>

<?php $path=__DIR__; include(__DIR__ . "/incl/footer.php"); ?>
<?php $path=__DIR__; include(__DIR__ . "/incl/end-of-page.php"); ?>
