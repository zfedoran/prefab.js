define([
    ],
    function(
    ) {
        'use strict';

        var MathHelper = function() {
        };

        MathHelper.PI = Math.PI;
        MathHelper.PI2 = Math.PI * 2;

        MathHelper.clamp = function(a, b, val) {
            return ( val < a ) ? a : ( ( val > b ) ? b : val );
        };

        MathHelper.min = function(a, b) {
            return a < b ? a : b;
        };

        MathHelper.max = function(a, b) {
            return a > b ? a : b;
        };

        MathHelper.lerp = function(a, b, amount) {
            return a + ( b - a ) * amount;
        };

        MathHelper.distanceSquared = function(a, b) {
            return a * a + b * b;
        };

        MathHelper.distance = function(a, b) {
            return Math.sqrt(a * a + b * b);
        };

        MathHelper.toDegrees = function(val) {
            return val * Math.PI / 180;
        };

        MathHelper.toRadians = function(val) {
            return val * 180 / Math.PI;
        };

        return MathHelper;
    }
);
