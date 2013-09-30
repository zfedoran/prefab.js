define([
        'math/vector3',
        'math/quaternion'
    ],
    function(
        Vector3,
        Quaternion
    ) {

        var Transform = function() {
            this.position = new Vector3();
            this.scale = new Vector3();
            this.rotation = new Quaternion();
        };

        Transform.__name__ = 'Transform';

        return Transform;
    }
);
