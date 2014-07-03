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
            *   This method returns the given asset name as a sprite.
            *
            *   @method getSprite
            *   @param {name}
            *   @returns {undefined}
            */
            getSprite: function(name) {
                return this.getTexture(name).getFullTextureSprite();
            },

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
            *   This method initializes this asset library using the provided
            *   directory path.
            *
            *   @method asyncInit
            *   @param {directory}
            *   @param {callback}
            *   @returns {undefined}
            */
            asyncInit: function(directory, callback) {
                var self = this;
                self.asyncLoadDirectory(directory, function(files) {
                    var images = [];

                    _.forEach(files, function(filepath) {
                        if (filepath.match(/\.png$/)) { images.push(filepath); }
                    });

                    self.asyncLoadTextures(images, callback);
                });
            },

            /**
            *   This method loads a full directory recursively. The provided
            *   callback is called with the list of filenames.
            *
            *   @method asyncLoadDirectory
            *   @param {directory}
            *   @param {callback}
            *   @returns {undefined}
            */
            asyncLoadDirectory: function(directory, callback) {
                var path  = require('path');
                var walk  = require('walk');
                var files = [];

                var walker = walk.walk(directory, { followLinks: false });

                walker.on('file', function(root, stat, next) {
                    var filepath = path.join(root, stat.name);
                    files.push(filepath);
                    next();
                });

                walker.on('end', function() {
                    callback(files);
                });
            },

            /**
            *   This function loads the provided image assets asynchronously
            *   into the asset library.
            *
            *   @method asyncLoadTextures
            *   @param {filepaths}
            *   @param {callback}
            *   @returns {undefined}
            */
            asyncLoadTextures: function(filepaths, callback) {
                var self = this;

                // Needed to create texture objects
                var device = this.context.getGraphicsDevice();

                // Create a list of require.js ready dependencies
                var dependencies = _.map(filepaths, function(src) { return 'image!' + src; });

                // Load the image dependencies
                requirejs(dependencies, (function() { 
                    var image, name, i, len = arguments.length;
                    for (i = 0; i < len; i++) {
                        image = arguments[i];
                        name  = filepaths[i];

                        if (typeof self.images[name] === 'undefined') {
                            var texture         = new Texture(device, image);
                            self.images[name]   = image;
                            self.textures[name] = texture;
                            texture.name        = name;
                        }
                    }
                    callback();
                }).bind(this));
            },
            
        };

        return AssetLibrary;
    }
);
