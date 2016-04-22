/** Master module for index page scripts */

define( [
  "jquery",
  "jquery-ui",
  "bootstrap",
//  "highlight"
//  "cookies"
],
function(
  $
) {
  "use strict";

  var init = function() {
    initEvents();
  };

  var checkNonEmpty = function( e ) {
    var val = $("#permit-search").val();
    if (val && val !== "") {
        return true;
    } else {
        $("#permit-search-error").removeClass( "hidden" );
        return false;
    }
  };

  var clearError = function( e ) {
        $("#permit-search-error").addClass( "hidden" );
  };

  var initEvents = function() {
      $("#permit-search-form").on( "submit", checkNonEmpty );
      $("#permit-search").on( "keypress", clearError );
      $('[data-toggle="popover"]').popover();
  };
   
  /* Initialise on document load */
  $(init);  

} );
