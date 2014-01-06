define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller
    ) {
        'use strict';

        var OrbitController = function(context) {
            Controller.call(this, context, ['Transform', 'Camera', 'Orbit']);

            this.state = OrbitController.STATE_NONE;

            this.currHitTestCache = [];
            this.prevHitTestCache = [];

            this.mousePosition = new Vector2();
        };

        OrbitController.prototype = _.extend(Object.create(Controller.prototype), {
            constructor: OrbitController,

            getCurrentEntity: function() {
                return this.currHitTestCache[0]; 
            },

            hasCurrentEntity: function() {
                return this.currHitTestCache.length > 0;
            },

            onMouseDown: function(button) {
                if (this.hasCurrentEntity()) {
                    if (button === 0) {
                        this.state = OrbitController.STATE_ROTATE;
                    } else if (button === 1) {
                        this.state = OrbitController.STATE_ZOOM;
                    } else if (button === 2) {
                        this.state = OrbitController.STATE_PAN;
                    }
                }
            },

            onMouseUp: function() {
                this.state = OrbitController.STATE_NONE;
            },

            onMouseLeave: function() {
                this.state = OrbitController.STATE_NONE;
            },

            onMouseMove: function(pageX, pageY) {
                var deltaX = this.mousePosition.x - pageX;
                var deltaY = this.mousePosition.y - pageY;

                this.mousePosition.x = pageX;
                this.mousePosition.y = pageY;

                if (this.state === OrbitController.STATE_ROTATE) {
                    this.rotate(deltaX, deltaY);
                } else if (this.state === OrbitController.STATE_ZOOM) {
                    this.zoom(deltaX, deltaY);
                } else if (this.state === OrbitController.STATE_PAN) {
                    this.pan(deltaX, deltaY);
                } else {
                    this.testForMouseOverEvents();
                } 
            },

            testForMouseOverEvents: function() {
                var entities = this.entityManager.getAllUsingFilterName(this.filterHash);

                // Swap and clear the hit test cache list
                var tmp = this.prevHitTestCache;
                this.prevHitTestCache = this.currHitTestCache;
                this.currHitTestCache = tmp;
                this.currHitTestCache.length = 0;

                var o, entity;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];
                        if (entity.hasComponent('Camera')) {
                            var camera = entity.getComponent('Camera');
                            if (camera.isEnabled() && camera.renderGroups.length > 0) {
                                if (camera.viewRect.contains(this.mousePosition)) {
                                    this.currHitTestCache.push(entity);
                                }
                            }
                        }
                    }
                }
            },

            focus: function() {
            },

            zoom: function() {
            },

            pan: function() {
            },

            rotate: function(deltaX, deltaY) {
                var entity = this.getCurrentEntity();
                var transform = entity.getComponent('Transform');
                var camera    = entity.getComponent('Camera');
                var center    = camera.getTargetPosition();
                var vector    = new Vector3();

                // vector = cameraPosition - center;
                Vector3.subtract(transform.getPosition(), center, /*out*/ vector);

                var theta = Math.atan2( vector.x, vector.z );
                var phi   = Math.atan2( Math.sqrt( vector.x * vector.x + vector.z * vector.z ), vector.y );

                deltaX *= 0.005;
                deltaY *= 0.005;

                theta += deltaX;
                phi   += deltaY;

                var EPS = 0.000001;
                phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

                var radius = vector.length();

                vector.x = radius * Math.sin( phi ) * Math.sin( theta );
                vector.y = radius * Math.cos( phi );
                vector.z = radius * Math.sin( phi ) * Math.cos( theta );

                //TODO: the set the local position correctly
                // cameraPosition = center + vector;
                Vector3.add(center, vector, /*out*/ transform.localPosition);
                transform.setDirty(true);
            }
        });

        OrbitController.STATE_NONE   = 'none';
        OrbitController.STATE_ZOOM   = 'zoom';
        OrbitController.STATE_ROTATE = 'rotate';
        OrbitController.STATE_PAN    = 'pan';

        return OrbitController;
    }
);
