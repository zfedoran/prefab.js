define([
        'core/component'
    ],
    function(
        Component
    ) {

        var MeshFilter = function(mesh) {
            Component.call(this);

            this.mesh = mesh;
        };

        MeshFilter.__name__ = 'MeshFilter';

        MeshFilter.prototype = Object.create(Component.prototype);

        MeshFilter.prototype.constructor = MeshFilter;

        return MeshFilter;
    }
);
