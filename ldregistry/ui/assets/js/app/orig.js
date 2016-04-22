/** Master module for original search page scripts */

/* global define, GLOBAL_EPR_ROOT */

define( [
  "lodash",
  "jquery",
  "openspace",
  "jquery-ui",
  "bootstrap"
],
function(
  _,
  $,
  OpenSpace
) {
  "use strict";

  var SEARCH_TYPE_POSTCODE = 1;
  var SEARCH_TYPE_TOWN = 2;
  var SEARCH_TYPE_NAME = 3;
  var SEARCH_TYPE_PERMIT = 4;

  var LOCAL_TYPE_FIELD = "LOCAL_TYPE";
  var GEOMETRY_X_FIELD = "GEOMETRY_X";
  var GEOMETRY_Y_FIELD = "GEOMETRY_Y";
  var NAME1_FIELD = "NAME1";

//  var ID_API = "/epr/id";
//  var COMPLETION_API = "/epr/api/completion";
  var ID_API = (GLOBAL_EPR_ROOT ? GLOBAL_EPR_ROOT : "/epr") + "/waste-carrier-dealers/id";
  var COMPLETION_API = (GLOBAL_EPR_ROOT ? GLOBAL_EPR_ROOT : "/epr") + "/api/completion";

  var POSTCODE_VALIDATOR = /^([g][i][r][0][a][a])$|^((([a-pr-uwyz]{1}([0]|[1-9]\d?))|([a-pr-uwyz]{1}[a-hk-y]{1}([0]|[1-9]\d?))|([a-pr-uwyz]{1}[1-9][a-hjkps-uw]{1})|([a-pr-uwyz]{1}[a-hk-y]{1}[1-9][a-z]{1}))(\d[abd-hjlnp-uw-z]{2})?)$/i;

  var osNames = "https://api.ordnancesurvey.co.uk/opennames/v1/find";
  var osNamesKey = "eXByCPn2aulKNWAx3bKDPuZUhilUnN83";

  var osGazetteer = new OpenSpace.Gazetteer();

  var selectedLocation = null;

  var init = function() {
    initEvents();
  };

  var initEvents = function() {
    $("#search-type").on( "change", onChangeSearchType );
    $("#search-type").on( "select", onChangeSearchType );
    $("#search-criterion")
      .autocomplete( {
        minLength: 2,
        source: onAutocompleteSearch
      } );
    $("button.search").on( "click", onSubmitSearch );
    $("section.search").on( "keyup", clearValidation );
    $("section.search").on( "select", clearValidation );
    $("section.search").on( "change", clearValidation );
  };

  var onChangeSearchType = function() {
    showHideRadiusSearch();
    clearSearchCriterion();
  };

  var selectedSearchType = function() {
    return parseInt( $("#search-type").val() );
  };

  var selectedRegime = function() {
    return parseInt( $("#select-register").val() );
  };

  var selectedRegimeName = function() {
    return {
      1: "carrier",
      2: "carrier-dealer",
      3: "broker-dealer"
    }[selectedRegime()];
  };

  var showHideRadiusSearch = function() {
    var st = selectedSearchType();
    revealElement( ".radius", (st === SEARCH_TYPE_TOWN || st === SEARCH_TYPE_POSTCODE) );
  };

  var currentRadius = function() {
    return parseInt( $( "#radius" ).val() );
  };

  var clearSearchCriterion = function() {
    $(".search-criterion").val( "" );
  };

  var currentSearchCriterion = function() {
    return _.escape( $("#search-criterion").val() );
  };

  var revealElement = function( selector, reveal ) {
    if (reveal) {
      $(selector).removeClass( "hidden" );
    }
    else {
      $(selector).addClass( "hidden" );
    }
  };

  var onAutocompleteSearch = function( acRequest, acResponse ) {
    var term = _.escape( acRequest.term );

    switch (selectedSearchType()) {
      case SEARCH_TYPE_POSTCODE:
        onAutocompletePostcode( term, acResponse );
        break;

      case SEARCH_TYPE_TOWN:
        onAutocompleteTown( term, acResponse );
        break;

      case SEARCH_TYPE_NAME:
        onAutocompleteEprApi( term, "name", acResponse );
        break;

      case SEARCH_TYPE_PERMIT:
        onAutocompleteEprApi( term, "number", acResponse );
        break;

      default:
        console.log( "Unexpected item in bagging area: " + selectedSearchType() );
    }
  };

  var onAutocompletePostcode = function( term, acResponse ) {
    $.ajax( osNames, {
      data: {
        key: osNamesKey,
        query: term
      }
    })
    .done( function( results ) {
      onAutocompletePostcodeResults( results, term, acResponse );
    } )
    .error( function( x, status, msg ) {
      console.log( "Postcode lookup failed: " + msg + ", status = " + status );
    } );
  };

  var onAutocompletePostcodeResults = function( results, term, acResponse ) {
    var hits = _.pluck( results.results, "GAZETTEER_ENTRY" );
    var termFilter = term.toLocaleUpperCase();

    hits = _.map( hits, function( hit ) {
      if (hit[LOCAL_TYPE_FIELD] === "Postcode" && hit[NAME1_FIELD].indexOf( termFilter ) === 0) {
        return hit[NAME1_FIELD];
      }
      else {
        return null;
      }
    } );

    acResponse( _.compact( hits ) );
  };

  var onAutocompleteTown = function( term, acResponse ) {
    osGazetteer.getLocations( term, function( locations ) {
      onTownLookup( locations, acResponse );
    } );
  };

  var onTownLookup = function( gazeteerEntries, acResponse ) {
    var l = _.map( gazeteerEntries, function( ge ) {
      var t = ge.type;
      return (t === "CITY" || t === "TOWN") ? ge.name : null;
    } );

    acResponse.call( null, _.compact( l ).sort() );
  };

  var onAutocompleteEprApi = function( term, field, acResponse ) {
    var data = {};
    data[field] = term;

    if (selectedRegime() !== 0) {
      data.regime = selectedRegimeName();
    }

    $.ajax( COMPLETION_API, {
      data: data
    } )
    .done( function( results ) {
      acResponse( results );
    } );
  };


  // ------

  var onSubmitSearch = function( e ) {
    e.preventDefault();
    if (validateRegister()) {
      validateSearchCriterion().done( postValidation );
    }
  };

  var clearValidation = function() {
    $(".validation-error").addClass( "hidden" );
    $(".has-error").removeClass( "has-error" );
  };

  var validateRegister = function() {
    var valid = true;

    if (selectedRegime() === 0 ) {
      $("#select-register").parents( ".form-group" ).addClass( "has-error" );
      $(".select-register-fail").removeClass( "hidden" );
      valid = false;
    }

    return valid;
  };

  var validateSearchCriterion = function( ) {
    var deferred = new $.Deferred();

    switch (selectedSearchType()) {
      case SEARCH_TYPE_POSTCODE:
        validatePostcode( deferred );
        break;

      case SEARCH_TYPE_TOWN:
        validateTown( deferred );
        break;

      default:
        // no need to wait, we know that the validation is OK
        deferred.resolve( true );
    }

    return deferred;
  };

  var validatePostcode = function( deferred ) {
    var term = currentSearchCriterion();

    if (term.replace( / /g, "" ).match( POSTCODE_VALIDATOR )) {
      $.ajax( osNames, {
        data: {
          key: osNamesKey,
          query: term,
          maxresults: 1
        }
      })
      .done( function( results ) {
        var hits = results.results;
        var valid = false;

        if (hits.length > 0) {
          var ge = hits[0].GAZETTEER_ENTRY;
          if (ge[NAME1_FIELD].indexOf( term.toLocaleUpperCase )) {
            selectedLocation = {
              easting: Math.round( ge[GEOMETRY_X_FIELD] ),
              northing: Math.round( ge[GEOMETRY_Y_FIELD] )
            };
            valid = true;
          }
        }

        if (!valid) {
          showInvalidPostcode();
        }

        deferred.resolve( valid );
      } );
    }
    else {
      showInvalidPostcode();
      deferred.resolve( false );
    }
  };

  var showInvalidPostcode = function() {
    $("#search-criterion").parents( ".form-group" ).addClass( "has-error" );
    $(".invalid-postcode-fail").removeClass( "hidden" );
  };

  var postValidation = function( valid ) {
    if (valid) {
      submitQuery();
    }
  };

  var validateTown = function( deferred ) {
    var term = currentSearchCriterion();
    osGazetteer.getLocations( term, function( locations ) {
      onTownValidationResult( locations, term, deferred );
    } );
  };

  var onTownValidationResult = function( gazeteerEntries, term, deferred ) {
    var townFilter = term.toLocaleLowerCase();
    var ge = _.find( gazeteerEntries, function( ge ) {
      var t = ge.type;
      return (t === "CITY" || t === "TOWN") && ge.name.toLocaleLowerCase() === townFilter;
    } );

    if (ge) {
      selectedLocation = {
        easting: ge.location.getEasting(),
        northing: ge.location.getNorthing()
      };
    }
    else {
      showInvalidTownName();
    }

    deferred.resolve( !!ge );
  };

  var showInvalidTownName = function() {
    $("#search-criterion").parents( ".form-group" ).addClass( "has-error" );
    $(".invalid-town-fail").removeClass( "hidden" );
  };


  var submitQuery = function() {
    var filters = collectFilters();
    var url = ID_API + "?" + $.param( filters );
    window.location = url;
  };

  var collectFilters = function() {
    var filters = {
      regime: selectedRegimeName()
    };

    if (selectedLocation) {
      filters = _.extend( filters, {dist: currentRadius()}, selectedLocation );
    }
    else if (selectedSearchType() === SEARCH_TYPE_PERMIT) {
      filters = _.extend( filters, {permissionNumber: currentSearchCriterion()} );
    }
    else if (selectedSearchType() === SEARCH_TYPE_NAME) {
      filters = _.extend( filters, {name: currentSearchCriterion()} );
    }

    return filters;
  };

  // initialise module on page ready
  $(init);
} );
