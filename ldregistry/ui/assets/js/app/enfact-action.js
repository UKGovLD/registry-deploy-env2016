/** Master module for enforcement action page */

/* global define */

define( [
  "jquery",
  "jquery-ui",
  "bootstrap"
],
function(
  $
) {
  "use strict";

  var init = function() {
    initEvents();
  };

  var initEvents = function() {
    $("button.back").on( "click", function() {
      window.history.back();
    } );
  };

  $( init );
} );
