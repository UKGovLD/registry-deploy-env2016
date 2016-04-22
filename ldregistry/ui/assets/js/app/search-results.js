/** Master module for search results page scripts */

/* global define */

define( [
  "jquery",
  "jquery-ui",
  "bootstrap",
  "datatables"
],
function(
  $
) {
  "use strict";

  var init = function() {
    initControls();
    initEvents();
  };

  var initControls = function() {
    var options = {
      "order": [[ 0, "asc" ]]
    };

    if (hasDistances()) {
        var colnum = hasRegisters() ? 4 : 3;
        options.order = [[colnum, "asc"]];
        options.columnDefs = [
            { type: "num", targets: colnum }
        ];
    }

    $("table.datatable").DataTable( options );
  };

  var hasDistances = function() {
    return $("table.distances").length > 0;
  };

  var hasRegisters = function() {
    return $("table.registers").length > 0;
  };

  var initEvents = function() {
    $("button.back").on( "click", function() {
      window.history.back();
    } );
  };

  $( init );
} );
