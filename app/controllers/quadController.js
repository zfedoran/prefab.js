define([
        'lodash',
        'math/vector2',
        'math/vector3',
        'core/controller',
        'graphics/meshFactory',
        'graphics/mesh',
        'components/quad'
    ], 
    function(
        _,
        Vector2,
        Vector3,
        Controller,
        MeshFactory,
        Mesh,
        Quad
    ) {
        'use strict';

        /**
        *   This class updates the mesh associated with entities which have a
        *   Quad component.
        *
        *   @class 
        *   @param {context}
        *   @constructor
        */
        var QuadController = function(context) {
            Controller.call(this, context);

            this.meshFactory = new MeshFactory(this.device);
        };

        QuadController.prototype = _.create(Controller.prototype, {
            constructor: QuadController,

            /**
            *   Update all entities which contain the Quad and MeshFilter
            *   components.
            *
            *   @method update
            *   @returns {undefined}
            */
            update: function() {
                this.filterBy(['Transform', 'Quad', 'MeshFilter'], function(entity) {
                    var transform  = entity.getComponent('Transform');
                    var quad       = entity.getComponent('Quad');

                    if (quad.isDirty()) {
                        var meshFilter = entity.getComponent('MeshFilter');
                        var mesh       = meshFilter.getMesh();

                        if (mesh) {
                            mesh.destroy();
                        } else {
                            mesh = new Mesh(this.device, Mesh.TRIANGLES);
                        }

                        this.generateQuadMesh(quad, mesh);
                        meshFilter.setMesh(mesh);

                        quad.setDirty(false);
                    }
                }, this);
            },

            /**
            *   Generate the 6 faces of a quad and return a mesh.
            *
            *   @method generateQuadMesh
            *   @param {quad}
            *   @returns {mesh}
            */
            generateQuadMesh: function(quad, mesh) {
                var w, h, hw, hh;

                w = quad.width;
                h = quad.height;

                hw = w / 2;
                hh = h / 2;

                this.meshFactory.begin(mesh);
                
                if (quad.mode === Quad.MODE_SLICED) {
                    this.generateSlicedFace(hw, hh, quad.sprite, quad.anchor);
                } else {
                    this.generateFace(hw, hh, quad.sprite, quad.anchor);
                }

                this.meshFactory.end();

                return mesh;
            },

            /**
            *   Generate the quad face.
            *
            *   @method generateFace
            *   @param {w} width
            *   @param {h} height
            *   @param {sprite} sprite texture
            *   @param {anchor} anchor point
            *   @returns {undefined}
            */
            generateFace: function(w, h, sprite, anchor) {
                var vertexCount = this.meshFactory.getVertexCount();

                var u, v, s, t;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth();
                t = sprite.getUVHeight();

                var ax, ay, az;
                ax = anchor.x * w;
                ay = anchor.y * h;
                az = anchor.z;

                this.meshFactory.addVertex(new Vector3(-w + ax, -h + ay, az));
                this.meshFactory.addVertex(new Vector3(-w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax,  h + ay, az));
                this.meshFactory.addVertex(new Vector3( w + ax, -h + ay, az));

                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + t));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + 0));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s, v + t));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            },

            /**
            *   Generate the sliced quad face.
            *
            *   @method generateSlicedFace
            *   @param {w} width
            *   @param {h} height
            *   @param {sprite} sprite texture
            *   @param {anchor} anchor point
            *   @returns {undefined}
            */
            generateSlicedFace: function(w, h, sprite, anchor) {
                var u, v, s, t, vertexCount;
                u = sprite.getUCoordinate();
                v = sprite.getVCoordinate();
                s = sprite.getUVWidth() / 3;
                t = sprite.getUVHeight() / 3;

                // corner width and heights
                var cw = sprite.width / 3;
                var ch = sprite.height / 3;

                // edge width and hights
                var ew = Math.max(2 * (w - cw), 0);
                var eh = Math.max(2 * (h - ch), 0);

                // recalculate width and height in case ew/eh are less than 0 above
                w = (cw * 2 + ew) * 0.5;
                h = (ch * 2 + eh) * 0.5;

                var ax, ay, az;
                ax = anchor.x * w;
                ay = anchor.y * h;
                az = anchor.z;

                /*
                *  2---3------+---+
                *  | / |  /   | / |
                *  1---4------+---+
                *  | / |    / | / |
                *  |   |  /   |   |
                *  +---+------+---+
                *  | / |  /   | / |
                *  +---+------+---+
                */

                // TODO: ...
                var du, dv;

                // Top Left
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax,           -h + ay + eh + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax,            h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw,  h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw, -h + ay + eh + ch, az));

                du = 0 * s; dv = 0 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Top
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, -h + ay + eh + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax + cw,  h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw,  h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw, -h + ay + eh + ch, az));

                du = 1 * s; dv = 0 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Top Right
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw, -h + ay + eh + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw,  h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax,            h + ay,           az));
                this.meshFactory.addVertex(new Vector3( w + ax,           -h + ay + eh + ch, az));

                du = 2 * s; dv = 0 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Left
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax,           -h + ay + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax,            h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw,  h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw, -h + ay + ch, az));

                du = 0 * s; dv = 1 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Center
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, -h + ay + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax + cw,  h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw,  h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw, -h + ay + ch, az));

                du = 1 * s; dv = 1 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Right
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw, -h + ay + ch, az));
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw,  h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax,            h + ay - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax,           -h + ay + ch, az));

                du = 2 * s; dv = 1 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Bottom Left
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax,           -h + ay,           az));
                this.meshFactory.addVertex(new Vector3(-w + ax,            h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw,  h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - ew - cw, -h + ay,           az));

                du = 0 * s; dv = 2 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Bottom
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + cw, -h + ay,           az));
                this.meshFactory.addVertex(new Vector3(-w + ax + cw,  h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw,  h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax - cw, -h + ay,           az));

                du = 1 * s; dv = 2 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);

                // Bottom Right
                vertexCount = this.meshFactory.getVertexCount();
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw, -h + ay,           az));
                this.meshFactory.addVertex(new Vector3(-w + ax + ew + cw,  h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax,            h + ay - eh - ch, az));
                this.meshFactory.addVertex(new Vector3( w + ax,           -h + ay,           az));

                du = 2 * s; dv = 2 * t;
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + t + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + 0 + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + 0 + dv));
                this.meshFactory.addUVtoLayer0(new Vector2(u + s + du, v + t + dv));

                this.meshFactory.addTriangle(vertexCount, vertexCount + 2, vertexCount + 1);
                this.meshFactory.addTriangle(vertexCount, vertexCount + 3, vertexCount + 2);
            }
        });

        return QuadController;
    }
);
