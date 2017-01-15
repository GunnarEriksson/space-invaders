SPACE INVADERS
==============

This project is the final assignment in the JavaScript, jQuery and AJAX with
HTML5 and PHP course held by Blekinge Institute of Technology (BTH). It is a
version of the classic arcade game Space Invaders.
The code is written in JavaScript and uses Ajax and PHP to communicate with the
SQLite database.


Install Package
---------------
* Clone the project by following this link: https://github.com/GunnarEriksson/space-invaders.git
* Upload the package on a server or use a local server, for example XAMP.


Install Database
----------------
A SQLite database is included in the package. No further steps has to be made.
The database si_game.sqlite is included in the folder db.

Space Invaders as Stand Alone
-----------------------------
It is possible to include the game Space Invaders on an own website. The following
folders should be included.
* db
* game
* img
* js
* sound

To show the game, include the row in your webpage

    <canvas id="canvas" width="900" height="650"></canvas>

If the width and height should be changed, the JavaScript code have to be
updated as well.


Use Space Invaders
------------------
* User has three cannons to be used one at the time.
* Control the movement of the cannon with left and right arrows.
* Fire a missile with the cannon with the space bar and try to hit the aliens.
* Aliens moving between the left and right border of the game board.
* Aliens moves one step down when reaching the left or right border of the game board.
* Aliens fires beams and rays randomly, which could hit the cannon.
* Hitting an alien get points, see the intro of the game to see the value for the different aliens.
* The game is over when the alien has reached the earth and captures the cannon or all three cannons are destroyed.
* When the game is over, it is possible to save a name to the high score list.
* The highest score and the gamers actual score, is shown on the top of the game board.


License
------------------
This software is free software and carries a MIT license.


Use of external libraries
-----------------------------------
The following external modules are included and subject to its own license


Use of External Libraries
-------------------------
The following external modules are included and subject to its own license

###jQuery
* Website: https://jquery.com/
* Version v1.12.4
* License: MIT license
* Path included: `js/jquery.js`


### Modernizr
* Website: http://modernizr.com/
* Version: 2.6.2
* License: MIT license
* Path: included in `js/modernizr.js`


History
-----------------------------------
###History for Space Invaders

v1.0 (2017-01-14)

* First version of Space Invaders



```
 .  
..:  Copyright (c) 2017 Gunnar Eriksson
```
