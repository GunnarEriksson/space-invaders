<?php
  $d = explode("/", trim($path, "/"));
  $srcUrl = '../source.php?dir=' . end($d) . '&amp;file=' . basename($_SERVER["PHP_SELF"]) . '#file';
?>

<footer id='footer'>

<nav>Validatorer:
  <a href='http://validator.w3.org/check/referer'>HTML5</a>
  <a href='http://jigsaw.w3.org/css-validator/check/referer?profile=css3'>CSS3</a>
  <a href='http://validator.w3.org/unicorn/check?ucn_uri=referer&amp;ucn_task=conformance'>Unicorn</a>
  <a href='http://csslint.net/'>CSS-lint</a>
  <a href='http://jslint.com/'>JS-lint</a>
</nav>

<nav>Verktyg:
  <a href='http://dbwebb.se/forum'>forum</a>
  <a href='http://dbwebb.se/style'>style</a>
  <a href='http://jsfiddle.net/'>jsfiddle</a>
  <a href='https://jsfiddle.net/user/guer/fiddles/'>fiddles/guer</a>
  <a href='http://pastebin.com/'>pastebin</a>
  <a href='https://gist.github.com/'>gist</a>
  <a href='http://www.quirksmode.org/compatibility.html'>quirksmode</a>
  <a href='http://caniuse.com/'>when can I use</a>
  <a href='http://www.workwithcolor.com/hsl-color-schemer-01.htm'>colors</a>
  <a href='<?=$srcUrl?>'>source</a>
</nav>

<nav>Manualer:
  <a href='http://www.w3.org/2009/cheatsheet'>Cheatsheet</a>
  <a href='http://www.w3.org/'>W3C</a>
  <a href='http://dev.w3.org/html5/spec/spec.html'>HTML5</a>
  <a href='http://www.w3.org/TR/CSS2'>CSS2</a>
  <a href='http://www.w3.org/Style/CSS/current-work#CSS3'>CSS3</a>
  <a href='https://developer.mozilla.org/en/JavaScript/Reference'>JS Core</a>
  <a href='https://developer.mozilla.org/en/Gecko_DOM_Reference'>JS DOM</a>
  <a href='https://developer.mozilla.org/en/DOM/DOM_event_reference'>JS DOM Events</a>
  <a href='http://php.net/manual/en/index.php'>PHP</a>
  <a href='http://api.jquery.com/'>jQuery</a>
  <a href='http://lesscss.org/'>LESS</a>
  <a href='https://developer.mozilla.org/'>Mozilla DN</a>
  <a href='http://developer.apple.com/library/safari/navigation/'>Apple DN</a>
  <a href='http://www.w3schools.com/'>w3schools</a>
</nav>
</footer>
<script src="../../lib/jquery.js"></script>
<script src="../js/guer.js"></script>
<script src="../game/helper-functions.js"></script>
<script src="../game/intro.js"></script>
<script src="../game/game-over.js"></script>
<script src="main.js"></script>
</body>
</html>
