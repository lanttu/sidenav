'use strict';
/*global angular*/

angular.module('sidenav', [])

.directive('sidenav', ['$timeout', function ($timeout) {

    var clsPrefix = 'sidenav-';
    var transTime = 200; // ms

    return {
        restrict: 'A'
      , require: 'ngModel'
      , link: function (scope, menu, attrs, model) {
            var container = menu.parent();
            var content   = menu.next();
            var overlay   = angular.element('<div>');
            var isOpen    = null;

            container.addClass('sidenav');

            menu.addClass(clsPrefix + 'menu');

            content.addClass(clsPrefix + 'content');

            overlay.addClass(clsPrefix + 'overlay');
            container.append(overlay);

            scope.$watch(attrs.ngModel, function (value) {
                show(value ? true : false);
            });

            overlay.bind('click', function () {
                show(false);
                $timeout(function () {
                    model.$setViewValue(false);
                });
            });

            function setClass(cls) {
                container.removeClass(clsPrefix + 'open');
                container.removeClass(clsPrefix + 'closed');
                container.removeClass(clsPrefix + 'opening');
                container.removeClass(clsPrefix + 'closing');
                container.addClass(clsPrefix + cls);
            }

            function show(value) {
                if (value === isOpen) return;

                if (isOpen === null) {
                    // Initial call
                    // Don't do animation
                    setClass(value ? 'open' : 'closed');
                } else if (value) {
                    // Open the menu
                    setClass('opening');
                    $timeout(function () {
                        if (isOpen) setClass('open');
                    }, transTime);
                } else {
                    // Close the menu
                    setClass('closing');
                    $timeout(function () {
                        if (!isOpen) setClass('closed');
                    }, transTime);
                }

                isOpen = value;
            }
        }
    };
}]);

var sidenavApp = angular.module('sidenavApp', ['sidenav']);

sidenavApp.controller('AppCtrl', function ($scope) {
    $scope.showMenu = true;

    $scope.toggleMenu = function () {
        $scope.showMenu = !$scope.showMenu;
    };
});
