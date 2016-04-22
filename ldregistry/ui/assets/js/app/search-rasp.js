/** Configure SMD search form */

/* global define */

define( [
  "lodash",
  "jquery",
  "app/base-search-form",
  "app/la-search",
  "app/postcode-search",
  "jquery-ui",
  "bootstrap"
],
function(
  _,
  $,
  base,
  laSearch
) {
  "use strict";
   
  /* Do we need to defer this? */
  base.setFieldsToCheck(  [
    "#name-search", 
    "#permit-search", 
    "#location-address", 
    "#location-postcode",
    "#la-search"
  ] );

  return {};

} );
