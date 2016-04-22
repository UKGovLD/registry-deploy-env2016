/**
 * Module for postcode search completion - pulls in base-search-form
 * Auto initializes
 */

/* global define */

define( [
  "lodash",
  "jquery",
  "app/base-search-form"
],
function(
  _,
  $,
  base
) {
  "use strict";

  /* Constants */
  var LOCAL_TYPE_FIELD = "LOCAL_TYPE";
  var GEOMETRY_X_FIELD = "GEOMETRY_X";
  var GEOMETRY_Y_FIELD = "GEOMETRY_Y";
  var NAME1_FIELD = "NAME1";

  var MIN_POSTCODE_SEARCH_LENGTH = 3;

  var osNames = "https://api.ordnancesurvey.co.uk/opennames/v1/find";
  var osNamesKey = "eXByCPn2aulKNWAx3bKDPuZUhilUnN83";

  /* Map from postcode to easting/northing */
  var postCodeLocationsCache = {};

  /* Map from input term to postcode completions */
  var postCodeCompletionsCache = {};

  var init = function() {
    initEvents();
  };

  var initEvents = function() {
    base.setOnSubmitForm( onSubmitForm );

    _.defer( function() {
      $("#location-postcode").autocomplete( {
        minLength: 0,
        autoFocus: true,
        source: onAutocompletePostcode,
        change: onPostcodeChange,
        select: onPostcodeChange
      } );
    } );
  };

  var onSubmitForm = function( e ) {
    if ( base.onSubmitForm( e )) {
      return checkNonCompletedPostcodeLookup( e );
    } else {
      return false;
    }
  };

  var onAutocompletePostcode = function( acRequest, acResponse ) {
    hideInvalidPostcode();

    var term = _.escape( acRequest.term );
    if (term.length >= MIN_POSTCODE_SEARCH_LENGTH) {
      var termNorm = term.toLocaleUpperCase();
      var hits = cachedLookahead( termNorm );

      if (hits) {
        acResponse( hits );
      }
      else {
        doPostcodeAjaxLookup( term, acResponse );
      }
    }
  };

  var cachedLookahead = function( key ) {
    return postCodeCompletionsCache[key];
  };

  var doPostcodeAjaxLookup = function( term, onCompletion ) {
    $.ajax( osNames, {
      data: {
        key: osNamesKey,
        query: term
      }
    })
    .done( function( results ) {
      onAutocompletePostcodeResults( results, term, onCompletion );
    } )
    .error( function( x, status, msg ) {
      console.log( "Postcode lookup failed: " + msg + ", status = " + status );
    } );
  };

  var onAutocompletePostcodeResults = function( results, term, onCompletion ) {
    var hits = _.pluck( results.results, "GAZETTEER_ENTRY" );
    var termFilter = term.toLocaleUpperCase();

    hits = _.map( hits, function( hit ) {
      if (hit[LOCAL_TYPE_FIELD] === "Postcode" && hit[NAME1_FIELD].indexOf( termFilter ) === 0) {
        var postCode = hit[NAME1_FIELD];
        var postCodeNorm = normalizePostcode( postCode );
        var easting = hit[GEOMETRY_X_FIELD];
        var northing = hit[GEOMETRY_Y_FIELD];

        postCodeLocationsCache[postCodeNorm] = {
          easting: easting.toFixed(),
          northing: northing.toFixed()
        };

        return postCode;
      }
      else {
        return null;
      }
    } );

    hits = _.compact( hits );
    postCodeCompletionsCache[termFilter] = hits;
    onCompletion( hits );
  };


  var normalizePostcode = function( postCode ) {
    return _.trim( postCode.replace( / +/g, " " ).toLocaleUpperCase() );
  };

  var onPostcodeChange = function( event, selected ) {
    var postCode = (selected && selected.item) ? selected.item.label : currentPostcodeValue();
    validatePostcode( postCode );
  };

  var validatePostcode = function( postCode ) {
    var postCodeNorm = normalizePostcode( postCode );
    var cached = postCodeLocationsCache[postCodeNorm];
    var e = "";
    var n = "";
    var valid = true;

    if (cached) {
      e = cached.easting.toString();
      n = cached.northing.toString();
    }
    else {
      showInvalidPostcode();
      valid = false;
    }

    setEastingNorthing( e, n );
    return valid;
  };

  var currentPostcodeValue = function() {
    return $("#location-postcode").val().toLocaleUpperCase();
  };

  var setNormalizedPostcode = function() {
    return $("#location-postcode").val( currentPostcodeValue() );
  };


  var setEastingNorthing = function( e, n ) {
    $("#easting").val( e );
    $("#northing").val( n );
  };

  /* Return false to prevent submit event */
  var checkNonCompletedPostcodeLookup = function( e ) {
    var postcodeOK = true;
    var postcode = currentPostcodeValue();

    if (_.isString( postcode ) && postcode !== "") {
      if (_.has( postCodeCompletionsCache, postcode )) {
        if (!validatePostcode( postcode )) {
          e.preventDefault();
          postcodeOK = false;
        }
      }
      else {
        doPostcodeAjaxLookup( postcode, function() {
          if (validatePostcode( postcode )) {
            setNormalizedPostcode();
            submitForm();
          }
        } );

        // prevent the submit for now
        e.preventDefault();
        postcodeOK = false;
      }
    }

    return postcodeOK;
  };

  var submitForm = function() {
    $("form").submit();
  };

  var showInvalidPostcode = function() {
    $("#location-postcode").parents( ".form-group" ).addClass( "has-error" );
    $(".invalid-postcode-fail").removeClass( "hidden" );
    base.checkSubmit();
  };

  var hideInvalidPostcode = function() {
    $("#location-postcode").parents( ".form-group" ).removeClass( "has-error" );
    $(".invalid-postcode-fail").addClass( "hidden" );
    base.checkSubmit();
  };

  /* Initialise on document load */
  $(init);

  return {};
} );
