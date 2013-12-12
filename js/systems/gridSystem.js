define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'math/vector4',
        'core/subSystem',
        'graphics/meshFactory',
        'graphics/mesh'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Vector4,
        SubSystem,
        MeshFactory,
        Mesh
    ) {
        'use strict';

        var GridSystem = function(entityManager, device) {
            SubSystem.call(this, entityManager, ['Grid', 'MeshFilter']);
            this.device = device;
            this.meshFactory = new MeshFactory(this.device);
        };

        GridSystem.prototype = _.extend(Object.create(SubSystem.prototype), {
            constructor: GridSystem,

            update: function() {
                var entities = this.entityManager.getAllUsingFilter(this.filterHash);
                var o, entity, guiElement;
                for (o in entities) {
                    if (entities.hasOwnProperty(o)) {
                        entity = entities[o];

                        if (entity.hasComponent('Grid')) {
                            this.updateGrid(entity);
                        }
                    }
                }
            },

            updateGrid: function(entity) {
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
            },

            generateGridMesh: function(grid) {
                var w, h, d;

                w = grid.width;
                h = grid.height;
                d = grid.depth;

                var vertexCount = 0;

                var mesh = new Mesh(this.device, Mesh.LINES);
                this.meshFactory.begin(mesh);

                var color = new Vector4(0.5, 0.5, 0.5, 0.5);
                this.generateXYPlane(w, h, color);
                this.generateXZPlane(w, d, color);
                this.generateYZPlane(h, d, color);

                this.meshFactory.end();

                return mesh;
            },

            generateXYPlane: function(u, v, color) {
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i < u; i++) {
                    for (j = 0; j < u; j++) {
                        this.meshFactory.addVertex(new Vector3(-i/2, -hv, 0));
                        this.meshFactory.addVertex(new Vector3( i/2,  hv, 0));
                        this.meshFactory.addVertex(color);
                        this.meshFactory.addVertex(color);
                    }
                }
                this.meshFactory.addVertex(new Vector3(-hu, -hv, 0));
                this.meshFactory.addVertex(new Vector3( hu, -hv, 0));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);

                this.meshFactory.addVertex(new Vector3(-hu,  hv, 0));
                this.meshFactory.addVertex(new Vector3( hu,  hv, 0));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);
            },

            generateXZPlane: function(u, v, color) {
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i < u; i++) {
                    for (j = 0; j < u; j++) {
                        this.meshFactory.addVertex(new Vector3(-i/2, 0, -hv));
                        this.meshFactory.addVertex(new Vector3( i/2, 0,  hv));
                        this.meshFactory.addVertex(color);
                        this.meshFactory.addVertex(color);
                    }
                }
                this.meshFactory.addVertex(new Vector3(-hu, 0, -hv));
                this.meshFactory.addVertex(new Vector3( hu, 0, -hv));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);

                this.meshFactory.addVertex(new Vector3(-hu, 0,  hv));
                this.meshFactory.addVertex(new Vector3( hu, 0,  hv));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);
            },

            generateYZPlane: function(u, v, color) {
                var hu = u / 2, hv = v / 2, i, j;
                for (i = 0; i < u; i++) {
                    for (j = 0; j < u; j++) {
                        this.meshFactory.addVertex(new Vector3(0, -i/2, -hv));
                        this.meshFactory.addVertex(new Vector3(0,  i/2,  hv));
                        this.meshFactory.addVertex(color);
                        this.meshFactory.addVertex(color);
                    }
                }
                this.meshFactory.addVertex(new Vector3(0, -hu, -hv));
                this.meshFactory.addVertex(new Vector3(0,  hu, -hv));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);

                this.meshFactory.addVertex(new Vector3(0, -hu,  hv));
                this.meshFactory.addVertex(new Vector3(0,  hu,  hv));
                this.meshFactory.addVertex(color);
                this.meshFactory.addVertex(color);
            }

        });

        return GridSystem;
    }
);
