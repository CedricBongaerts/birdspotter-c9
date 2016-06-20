/* global app angular WIKIPEDIA_BASE_URL*/

app.directive("wikipediaContent", function() {
  return {
    scope: {
      wikipediaContent: '='
    },
    link: function(scope, directiveElement) {


      scope.$watch('wikipediaContent', function() {

        if (!scope.wikipediaContent) {
          return;
        }

        var wikipediaElement = angular.element(scope.wikipediaContent);
        wikipediaElement.find('a').each(function() {

          var element = angular.element(this);
          var href = element.attr('href');

          if (href.match(/^http/)) {
            return;
          }
          var WIKIPEDIA_BASE_URL = 'http://en.wikipedia.org';
          element.attr('href', WIKIPEDIA_BASE_URL + href);
        });


        directiveElement.replaceWith(wikipediaElement);

      });
    }
  }
});