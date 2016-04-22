/** Master module for search results page scripts */

define( [
  "jquery",
  "datepicker"
/*  , "datepickerGB"  */
],
function(
  $, datepicker
) {

  var init = function() {
    initEvents();
    initDatepicker();
  };

  var initEvents = function() {
    $(".search-clear").on( "click", onClearSearch );
    $("input").on( "keypress", onInputKeyPress );
  };

  var initDatepicker = function() {
      $('#pick-after-date').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    });

      $('#pick-before-date').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    });
  };

  var onClearSearch = function( e ) {
    e.preventDefault();
    var target = $(e.currentTarget);
    var bg = target.parent( ".btn-group" );

    bg.find( "input" )
      .val( "" )
      .focus();
  }; 

  var onInputKeyPress = function( e ) {
    if (e.which === 13) {
      e.preventDefault();
      $( e.currentTarget ).parents( "form" ).submit();
    }
  };

  /* Initialise on document load */
  $(init);

} );
