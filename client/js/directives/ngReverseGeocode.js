/* global app*/

app.directive('reverseGeocode', function () {
        return {
            restrict: 'A',
            template: '<input type="text" ng-model="autoLocation"></input>',
            link: function (scope, element, attrs) {
                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(attrs.lat, attrs.lng);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            element.value(results[1].formatted_address);
                        } else {
                            element.value('Location not found');
                        }
                    } else {
                        element.value('');
                    }
                });
            },
            require: "ngModel",
            replace: true
        }
    });