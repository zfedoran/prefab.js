define([
    ],
    function(
    ) {
        'use strict';

        /**
        *   Application asset library.
        *
        *   @class 
        *   @constructor
        */
        var ControllerManager = function(context) {
            this.context = context;

            this.controllerList  = [];
        };

        ControllerManager.prototype = {
            constructor: ControllerManager,

            /**
            *   This method calls each controller's update() function
            *
            *   @method update
            *   @param {elapsed} Time since last update in seconds
            *   @returns {undefined}
            */
            update: function(elapsed) {
                var i, controller;
                for (i = 0; i < this.controllerList.length; i++) {
                    this.controllerList[i].update(elapsed);
                }
            },

            /**
            *   This method loads and initializes the provided controllers
            *   asynchronously.
            *
            *   @method asyncLoadControllers
            *   @param {controllers} List of controllers
            *   @param {callback}
            *   @returns {undefined}
            */
            asyncLoadControllers: function(controllers, callback) {
                requirejs(controllers, (function() { 
                    for (var i = 0; i < arguments.length; i++) {
                        this.controllerList.push(new (arguments[i])(this.context));
                    }
                    callback();
                }).bind(this));
            },
            
        };

        return ControllerManager;
    }
);
