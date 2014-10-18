define([
        'lodash',
        'core/component',
        'math/vector3',
        'math/boundingBox'
    ],
    function(
        _,
        Component,
        Vector3,
        BoundingBox
    ) {
        'use strict';

        /**
        *   The Bounds component class.
        *
        *   @class 
        *   @constructor
        */
        var Bounds = function() {
            Component.call(this);

            // Local bounding box
            this.localBoundingBox = new BoundingBox();

            // World bounding box
            this._boundingBox = new BoundingBox();
        };

        Bounds.__name__ = 'Bounds';

        Bounds.prototype = _.create(Component.prototype, {
            constructor: Bounds,

            /**
            *   This method is called when this component is added to an entity.
            *
            *   @method init
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            init: function(entity, context) {
                this._entity = entity;
            },

            /**
            *   This method is called when this component is removed from an
            *   entity.
            *
            *   @method uninitialize
            *   @param {entity}
            *   @param {context}
            *   @returns {undefined}
            */
            uninitialize: function(entity, context) {
                this._entity = null;
            },

            /**
            *   This method returns the local bounding box width for this
            *   entity.
            *
            *   @method getLocalWidth
            *   @returns {undefined}
            */
            getLocalWidth: function() {
                if (this.isDirty()) {
                    this.update();
                }

                return this.localBoundingBox.getWidth();
            },

            /**
            *   This method returns the local bounding box height for this
            *   entity.
            *
            *   @method getLocalHeight
            *   @returns {undefined}
            */
            getLocalHeight: function() {
                if (this.isDirty()) {
                    this.update();
                }

                return this.localBoundingBox.getHeight();
            },

            /**
            *   This method returns the local bounding box depth for this
            *   entity.
            *
            *   @method getLocalDepth
            *   @returns {undefined}
            */
            getLocalDepth: function() {
                if (this.isDirty()) {
                    this.update();
                }

                return this.localBoundingBox.getDepth();
            },

            /**
            *   This method returns the local bounding box for this entity.
            *
            *   @method getLocalBoundingBox
            *   @returns {undefined}
            */
            getLocalBoundingBox: function() {
                if (this.isDirty()) {
                    this.update();
                }

                return this.localBoundingBox;
            },

            /**
            *   This method gets the world bounding box for this entity.
            *
            *   @method getWorldBoundingBox
            *   @param {function}
            *   @returns {undefined}
            */
            getWorldBoundingBox: (function() {
                var boundingBoxCoords = [
                    new Vector3(), new Vector3(), new Vector3(), new Vector3(),
                    new Vector3(), new Vector3(), new Vector3(), new Vector3()
                ];

                return function() {
                    var transform = this.getComponent('Transform');
                    if (transform) {
                        if (this.isDirty()) {
                            this.update();
                        }

                        this._boundingBox.makeEmpty();

                        var hw = this.localBoundingBox.getWidth() * 0.5;
                        var hh = this.localBoundingBox.getHeight() * 0.5;
                        var hd = this.localBoundingBox.getDepth() * 0.5;
                        
                        boundingBoxCoords[0].set(-hw, -hh,  hd);
                        boundingBoxCoords[1].set( hw, -hh,  hd);
                        boundingBoxCoords[2].set(-hw, -hh, -hd);
                        boundingBoxCoords[3].set( hw, -hh, -hd);
                        boundingBoxCoords[4].set(-hw,  hh,  hd);
                        boundingBoxCoords[5].set( hw,  hh,  hd);
                        boundingBoxCoords[6].set(-hw,  hh, -hd);
                        boundingBoxCoords[7].set( hw,  hh, -hd);

                        var matrix = transform.getAnchorAdjustedWorldMatrix();
                        for (var i = 0; i < 8; i++) {
                            var vector = boundingBoxCoords[i];
                            vector.transform(matrix);
                            this._boundingBox.expandByVector(vector);
                        }
                    }
                    return this._boundingBox;
                };
            })(),

            /**
            *   This method sets the local bounding box for this entity.
            *
            *   @method setLocalBoundingBox
            *   @param {boundingBox}
            *   @returns {undefined}
            */
            setLocalBoundingBox: function(boundingBox) {
                this.localBoundingBox = boundingBox;
                this.setDirty(false);
            },

            /**
            *   This method sets the local bounding box using the provided
            *   dimensions. This function uses the Anchor and Transform
            *   components to calculate the final local bounding box.
            *
            *   (Useful for cases where the calculated dimensions are not the
            *   same as the Dimensions component dimensions)
            *
            *   @method setLocalDimensions
            *   @param {width}
            *   @param {height}
            *   @param {depth}
            *   @returns {undefined}
            */
            setLocalDimensions: function(width, height, depth) {
                width  = width || 0;
                height = height || 0;
                depth  = depth || 0;

                var anchor     = this.getComponent('Anchor');
                var transform  = this.getComponent('Transform');

                // If this entity has a Transform component
                if (transform) {

                    // Get the anchor point values (if they exist)
                    var ax = 0, ay = 0, az = 0;
                    if (anchor) { 
                        ax = anchor.anchorPoint.x;
                        ay = anchor.anchorPoint.y;
                        az = anchor.anchorPoint.z;
                    }

                    var hw = width * 0.5;
                    var hh = height * 0.5;
                    var hd = depth * 0.5;

                    var px = transform.localPosition.x;
                    var py = transform.localPosition.y;
                    var pz = transform.localPosition.z;

                    px = px + ax * hw;
                    py = py + ay * hh;
                    pz = pz + az * hd;

                    this.localBoundingBox.min.x = px - hw;
                    this.localBoundingBox.min.y = py - hh;
                    this.localBoundingBox.min.z = pz - hd;

                    this.localBoundingBox.max.x = px + hw;
                    this.localBoundingBox.max.y = py + hh;
                    this.localBoundingBox.max.z = pz + hd;

                    this.setDirty(false);
                } else {
                    throw 'Bounds: cannot update dirty local boundingBox value without a Transform component.';
                }
            },

            /**
            *   This method updates the local bounding box using the Dimensions
            *   and Transform components attached to this entity.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                var anchor     = this.getComponent('Anchor');
                var dimensions = this.getComponent('Dimensions');
                var transform  = this.getComponent('Transform');

                // If this entity has a Dimensions component
                if (dimensions) {

                    // If this entity has a Transform component
                    if (transform) {

                        // Get the anchor point values (if they exist)
                        var ax = 0, ay = 0, az = 0;
                        if (anchor) { 
                            ax = anchor.anchorPoint.x;
                            ay = anchor.anchorPoint.y;
                            az = anchor.anchorPoint.z;
                        }

                        var hw = dimensions.localWidth * 0.5;
                        var hh = dimensions.localHeight * 0.5;
                        var hd = dimensions.localDepth * 0.5;

                        var px = transform.localPosition.x;
                        var py = transform.localPosition.y;
                        var pz = transform.localPosition.z;

                        px = px + ax * hw;
                        py = py + ay * hh;
                        pz = pz + az * hd;

                        this.localBoundingBox.min.x = px - hw;
                        this.localBoundingBox.min.y = py - hh;
                        this.localBoundingBox.min.z = pz - hd;

                        this.localBoundingBox.max.x = px + hw;
                        this.localBoundingBox.max.y = py + hh;
                        this.localBoundingBox.max.z = pz + hd;

                        this.setDirty(false);
                    } else {
                        throw 'Bounds: cannot update dirty local boundingBox value without a Transform component.';
                    }
                } else {
                    throw 'Bounds: cannot update dirty local boundingBox value without a Dimensions component.';
                }
            },
        });

        return Bounds;
    }
);
