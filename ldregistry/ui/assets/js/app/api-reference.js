/** Master module for reference page scripts */

define( [
  "jquery",
  "highlight",
  "bootstrap"
],
function(
  $, highlight
) {
    // Try to work around require.js screwing up highlightin and affix - I so hate require.js
    var init = function() {
        initHighlighting();
        initAffix();
    };

    var initHighlighting = function() {
        $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
        });
    };

    var initAffix = function() {
        $('.toc').affix({});
    };

    $( init );

} );
