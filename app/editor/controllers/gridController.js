define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Vector4,
        Controller,
        MeshFactory,
        Mesh
    ) {
        'use strict';

        /**
        *   This class updates and generates the grid Mesh for Grid components.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var GridController = function(context) {
            Controller.call(this, context);
            
            this.meshFactory = new MeshFactory(this.device);
        };

        GridController.prototype = _.create(Controller.prototype, {
            constructor: GridController,

            /**
            *   Update all entities which contain the Grid and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Grid', 'MeshFilter'], function(entity) {
                    var transform  = entity.getComponent('Transform');
                    var grid       = entity.getComponent('Grid');
                    var meshFilter = entity.getComponent('MeshFilter');

                    if (grid.isDirty()) {
                        if (typeof meshFilter.mesh !== 'undefined') {
                            meshFilter.mesh.destroy();
                        }

                        meshFilter.mesh = this.generateGridMesh(grid);
                        grid.setDirty(false);
                    }
                }, this);
            },

            /**
            *   Generate the grid mesh geometry
            *
            *   @method generateGridMesh
            *   @param {Grid}
            *   @returns {Mesh}
            */
            generateGridMesh: function(grid) {
                var w, h, d;

                w = grid.width;
                h = grid.height;
                d = grid.depth;

                var vertexCount = 0;

                var mesh = new Mesh(this.device, Mesh.LINES);
                this.meshFactory.begin(mesh);

                var color = new Vector4(0.28, 0.28, 0.28, 1);

                if (grid.hasXYPlane) {
                    this.generateXYPlane(w, h, color);
                }
                if (grid.hasXZPlane) {
                    this.generateXZPlane(w, d, color);
                }
                if (grid.hasYZPlane) {
                    this.generateYZPlane(h, d, color);
                }

                if (grid.hasXAxis) {
                    color = new Vector4(132/22, 22/256, 22/256, 1);
                    this.generateXAxis(w || Math.max(h, d), color);
                }
                if (grid.hasYAxis) {
                    color = new Vector4(22/256, 132/256, 22/256, 1);
                    this.generateYAxis(h || Math.max(w, d), color);
                }
                if (grid.hasZAxis) {
                    color = new Vector4(22/256, 22/256, 132/256, 1);
                    this.generateZAxis(d || Math.max(w, h), color);
                }

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   This method generates an X-Axis.
            *
            *   @method generateXAxis
            *   @param {u} Length of the axis
            *   @param {color} Color of the axis
            *   @returns {undefined}
            */
            generateXAxis: function(u, color) {
                var vertexCount;
                var hu = u / 2;

                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-hu, 0, 0));
                this.meshFactory.addVertex(new Vector3( hu, 0, 0));
                this.meshFactory.addColor(color);
                this.meshFactory.addColor(color);
                this.meshFactory.addLine(vertexCount, vertexCount+1);
            },

            /**
            *   This method generates an Y-Axis.
            *
            *   @method generateXAxis
            *   @param {u} Length of the axis
            *   @param {color} Color of the axis
            *   @returns {undefined}
            */
            generateYAxis: function(u, color) {
                var vertexCount;
                var hu = u / 2;

                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(0, -hu, 0));
                this.meshFactory.addVertex(new Vector3(0,  hu, 0));
                this.meshFactory.addColor(color);
                this.meshFactory.addColor(color);
                this.meshFactory.addLine(vertexCount, vertexCount+1);
            },

            /**
            *   This method generates an Z-Axis.
            *
            *   @method generateXAxis
            *   @param {u} Length of the axis
            *   @param {color} Color of the axis
            *   @returns {undefined}
            */
            generateZAxis: function(u, color) {
                var vertexCount;
                var hu = u / 2;

                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(0, 0, -hu));
                this.meshFactory.addVertex(new Vector3(0, 0,  hu));
                this.meshFactory.addColor(color);
                this.meshFactory.addColor(color);
                this.meshFactory.addLine(vertexCount, vertexCount+1);
            },

            /**
            *   This method generates the XY plane mesh geometry.
            *
            *   @method generateXYPlane
            *   @param {u} Width of the plane
            *   @param {v} Height of the plane
            *   @param {color} Color of the plane
            *   @returns {undefined}
            */
            generateXYPlane: function(u, v, color) {
                var vertexCount;
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(i-hu, -hv, 0));
                        this.meshFactory.addVertex(new Vector3(i-hu,  hv, 0));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(-hv, j-hv, 0));
                        this.meshFactory.addVertex(new Vector3( hv, j-hv, 0));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
            },

            /**
            *   This method generates the XZ plane mesh geometry.
            *
            *   @method generateXZPlane
            *   @param {u} Width of the plane
            *   @param {v} Height of the plane
            *   @param {color} Color of the plane
            *   @returns {undefined}
            */
            generateXZPlane: function(u, v, color) {
                var vertexCount;
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(i-hu, 0, -hv));
                        this.meshFactory.addVertex(new Vector3(i-hu, 0,  hv));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(-hv, 0, j-hv));
                        this.meshFactory.addVertex(new Vector3( hv, 0, j-hv));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
            },

            /**
            *   This method generates the YZ plane mesh geometry.
            *
            *   @method generateYZPlane
            *   @param {u} Width of the plane
            *   @param {v} Height of the plane
            *   @param {color} Color of the plane
            *   @returns {undefined}
            */
            generateYZPlane: function(u, v, color) {
                var vertexCount;
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(0, i-hu, -hv));
                        this.meshFactory.addVertex(new Vector3(0, i-hu,  hv));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
                for (i = 0; i <= u; i++) {
                    for (j = 0; j <= u; j++) {
                        vertexCount = this.meshFactory.getVertexCount();
                        this.meshFactory.addVertex(new Vector3(0, -hv, j-hv));
                        this.meshFactory.addVertex(new Vector3(0,  hv, j-hv));
                        this.meshFactory.addColor(color);
                        this.meshFactory.addColor(color);
                        this.meshFactory.addLine(vertexCount, vertexCount+1);
                    }
                }
            }
        });

        return GridController;
    }
);
