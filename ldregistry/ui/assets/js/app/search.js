/** Configure general search form */

/* global define */

define( [
  "lodash",
  "jquery",
  "app/base-search-form",
  "app/postcode-search"
],
function(
  _,
  $,
  base,
  postcodeSearch
) {
  "use strict";
   
  base.setFieldsToCheck( ["#name-search", "#permit-search", "#location-address", "#location-postcode"] );

  return {};

} );