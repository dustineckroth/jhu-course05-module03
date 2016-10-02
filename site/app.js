(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
         .controller('NarrowItDownController', NarrowItDownController)
         .service('MenuSearchService', MenuSearchService)
         .directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject = ['MenuSearchService'];

  function NarrowItDownController(MenuSearchService) {
    var narrow = this;

    narrow.hasNoMatchingItems = true;
    narrow.found = [];

    narrow.getMatchedMenuItems = function() {

      // if (narrow.searchTerm.trim().length > 0) {
        var promise = MenuSearchService.getMatchedMenuItems(narrow.searchTerm);

        promise.then(function (foundItems) {
          if (foundItems.length > 0) {
            narrow.hasNoMatchingItems = false;
            narrow.found = foundItems;
            console.log(narrow.found);
          } else {
            narrow.hasNoMatchingItems = true;
          }
        }).catch(function (error) { console.log(error); });
      // }
    };

    narrow.removeItem = function(index) {
      MenuSearchService.removeItem(index);
    };
  }

  MenuSearchService.$inject = ['$http'];
  function MenuSearchService($http) {
    var service = this;
    var foundItems = [];

    service.removeItem = function(index) {
      found.splice(index, 1);
    };

    service.getMatchedMenuItems = function(searchTerm) {

      return $http.get('//davids-restaurant.herokuapp.com/menu_items.json')
                  .then(function(result) {
        // process result and only keep items that match
        foundItems = [];

        result.data.menu_items.forEach(function(item) {
          if (item.description.indexOf(searchTerm) != -1) {
            foundItems.push(item);
          }
        });

        console.log("Result");
        console.log(result);
        console.log("Found Items");
        console.log(foundItems);

        // return processed items
        return foundItems;
      });
    }
  }

  function FoundItemsDirective() {
    var ddo = {
      templateUrl: 'foundItems.html',
      restrict: 'E',

      scope: {
        found: '<',
        onRemove: '&'
      },

      controller: NarrowItDownController,
      controllerAs: 'narrow',
      bindToController: true,
      link: FoundItemsDirectiveLink,
      transclude: true
    }

    return ddo;
  }

  function FoundItemsDirectiveLink(scope, element, attrs, controller) {
    scope.$watch('narrow.found'), function(oldValue, newValue) {});
    scope.$watch('narrow.hasNoMatchingItems'), function(oldValue, newValue) {});
  }


})(); // iife end
