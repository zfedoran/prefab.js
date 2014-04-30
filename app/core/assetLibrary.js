define([
        'lodash',
        'graphics/texture'
    ],
    function(
        _,
        Texture
    ) {
        'use strict';

        /**
        *   Application asset library.
        *
        *   @class 
        *   @constructor
        */
        var AssetLibrary = function(context) {
            this.context = context;

            this.images = {};
            this.textures = {};
        };

        AssetLibrary.prototype = {
            constructor: AssetLibrary,

            /**
            *   This method returns a texture object for an image asset. If the
            *   asset has not been loaded, an error will be thrown.
            *
            *   @method getTexture
            *   @param {name}
            *   @returns {undefined}
            */
            getTexture: function(name) {
                var texture = this.textures[name];
                if (typeof this.textures[name] === 'undefined') {
                    throw 'AssetLibrary: cannot find texture "'+name+'".';
                }
                return texture;
            },

            /**
            *   This function loads the provided image assets asynchronously
            *   into the asset library.
            *
            *   @method asyncLoadTextures
            *   @param {assets}
            *   @param {callback}
            *   @returns {undefined}
            */
            asyncLoadTextures: function(assets, callback) {
                var self = this;

                // Needed to create texture objects
                var device = this.context.getGraphicsDevice();

                // Create a list of require.js ready dependencies
                var dependencies = _.map(assets, function(src) { return 'image!' + src; });

                // Load the image dependencies
                requirejs(dependencies, (function() { 
                    var image, name, i, len = arguments.length;
                    for (i = 0; i < len; i++) {
                        image = arguments[i];
                        name  = assets[i];

                        if (typeof self.images[name] === 'undefined') {
                            self.images[name]   = image;
                            self.textures[name] = new Texture(device, image);
                        }
                    }
                    callback();
                }).bind(this));
            },
            
        };

        return AssetLibrary;
    }
);
