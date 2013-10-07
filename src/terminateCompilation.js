angular.module('terminateCompilation', [])

  // We don't want angularjs interpolation that appears inside comments to be compiled
  // so this directive basically terminates compilation at the point where discussions
  // are rendered
  // (Unfortunately, GitHub also sticks content into a <meta property="og:description"> tag,
  // which also needs to be terminated)
  .directive('discussionTimeline', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })
  .directive('diffView', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })
  .directive('commit', function() {
    return {
      restrict: 'C',
      terminal: true,
      link: function(scope, element) {
        element.addClass('ng-terminated');
      }
    };
  })

  

  // We have to do this work at the head element, since we can't stop the compiler from
  // interpolating the current element's attributes, even if the element cotains a directive
  // set to terminal!
  .directive('head', function() {
    return {
      restrict: 'E',
      compile: function(element, attr) {
        var descriptionElement, descriptionContent, ogDescriptionElement, ogDescriptionContent;

        // Find the description and og:description meta tag and clear out their contents while we
        // compile the head element
        angular.forEach(element.children(), function(element) {

          // Wrap the element in jqLite to have access to `attr()`
          element = angular.element(element);

          if (element[0].nodeName === 'META' ) {
            if (element.attr('name') === 'description') {
              descriptionElement = element;
              descriptionContent = descriptionElement.attr('content');
              descriptionElement.attr('content', '');
            }

            if (element.attr('property') === 'og:description') {
              ogDescriptionElement = element;
              ogDescriptionContent = ogDescriptionElement.attr('content');
              ogDescriptionElement.attr('content', '');
            }
          }

        });

        return function postLink(scope, element, attr) {
          // Add the contents back into the descriptin and og:description meta tags
          if ( descriptionElement ) {
            descriptionElement.attr('content', descriptionContent);
          }
          if ( ogDescriptionElement ) {
            ogDescriptionElement.attr('content', ogDescriptionContent);
          }
        };
      }
    };
  })