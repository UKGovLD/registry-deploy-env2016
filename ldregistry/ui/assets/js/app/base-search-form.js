/**
 * Base module for form submission management
 *  setFieldsToCheck( arrage-of-strings )   - form elements, one of which sould be non-empty
 *  onSubmitForm                     - default function run on form submit
 *  setOnSubmitForm( fn )            - set the function to run on form submit
 */

/* global define */

define( [
  "lodash",
  "jquery",
  "jquery-ui",
  "bootstrap",
  "app/back-button"
],
function(
  _,
  $
) {
  "use strict";

  var fieldsToCheck = ["#name-search", "#permit-search", "#location-address", "#location-postcode"];

  var init = function() {
    initEvents();
  };

  var initEvents = function() {
    $(".search-clear").on( "click", onClearSearch );

    $("input").on( "keypress", onInputKeyPress );

    $("form").on( "submit", function( e ) { 
        onSubmitFormFn(e); 
    } );

  };

  var onClearSearch = function( e ) {
    e.preventDefault();
    var target = $(e.currentTarget);
    var bg = target.parent( ".btn-group" );

    bg.parents( ".form-group" )
      .removeClass( "has-error" )
      .find(  ".validation-error" )
      .addClass( "hidden" );
    checkSubmit();

    if (target.hasClass("location")) {
      setEastingNorthing( "", "" );
    }

    bg.find( "input" )
      .val( "" )
      .focus();
  };

  var onInputKeyPress = function( e ) {
    $(".empty-search").addClass( "hidden" );

    if (e.which === 13) {
      e.preventDefault();
      $( e.currentTarget ).parents( "form" ).submit();
    }
  };

  var checkSubmit = function( noSubmit ) {
    if ($(".has-error").length > 0 || noSubmit) {
      $("button[type=submit]").attr( "disabled", "disabled" );
      return false;
    }
    else {
      $("button[type=submit]").removeAttr( "disabled" );
      return true;
    }
  };

  var nonEmptySearch = function( e ) {
    var isOK = true;

    var atLeastOneValue = _.find( fieldsToCheck, function( f ) {
      var v = $(f).val();
      return v && v !== "";
    } );

    if (atLeastOneValue) {
      isOK = checkSubmit();
    }
    else {
      $(".empty-search").removeClass( "hidden" );
      isOK = false;
    }

    if (!isOK) {
      e.preventDefault();
    }

    return isOK;
  };

  var defaultOnFormSubmit = function( e ) {
    return nonEmptySearch( e );
  };

  var onSubmitFormFn = defaultOnFormSubmit;

  /* Initialise on document load */
  $(init);

  /* Exports from the module */
  return {
    setFieldsToCheck : function( fields ) { fieldsToCheck = fields; },
    onSubmitForm     : defaultOnFormSubmit,
    setOnSubmitForm  : function( fn ) { onSubmitFormFn = fn; },
    checkSubmit      : checkSubmit
  };

} );
