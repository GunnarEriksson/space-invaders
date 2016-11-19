/**
 * Helpers and tools to ease your JavaScript day.
 *
 * @author Gunnar Eriksson (me@mikaelroos.se)
 */
window.Guer = (function (window, document, undefined) {
    var Guer = {};

    /**
   * Get the position of an element.
   * http://stackoverflow.com/questions/442404/dynamically-retrieve-html-element-x-y-position-with-javascript
   * @param el the element.
   */
  Guer.getOffset = function ( el ) {
      var _x = 0;
      var _y = 0;
      while ( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
          _x += el.offsetLeft - el.scrollLeft;
          _y += el.offsetTop - el.scrollTop;
          el = el.offsetParent;
      }
      return { top: _y, left: _x };
  };

  /**
   * Random number generator
   *
   * Generates a random number betweem min and max.
   * Both numbers are included in the output range of
   * random numbers.
   *
   */
  Guer.random = function (min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Expose public methods
  return Guer;


})(window, window.document);
