
/*  ////  --|    Polyfills

    * 
*/


/* 
  Object.assign
  
  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
*/

if (typeof Object.assign != 'function') {
  
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, "assign", {
    value: function assign(target, varArgs) { // .length of function is 2
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    },
    writable: true,
    configurable: true
  });
}


// CSS.object-fit

// We will build this from scratch

var object_fit_polyfill = function() {

    let images = document.getElementsByTagName( 'img' );
    
    for ( var i = 0; i < images.length; i++ ) {

        let img = images[i],
            img_styles = window.getComputedStyle( img );

        if ( img_styles.getPropertyValue( 'font-family' ) == '"object-fit"' ) {

            img.style.width = img.parentElement.offsetWidth + 'px';
            img.style.height = 'auto';
            img.style.top = '50%';
            img.style.transform = 'translateY(-50%)';
        }
    }
}

if ( 'CSS' in window === false ) {
  object_fit_polyfill();

} else {

  if ( 'objectFit' in document.documentElement.style === false ) {
    object_fit_polyfill();
  }
}


/* 
  NodeList.prototype.forEach

  https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach
*/

if ( window.NodeList && ! NodeList.prototype.forEach ) {

    NodeList.prototype.forEach = Array.prototype.forEach;
}

