define([
        'math/vector3',
        'math/matrix4'
    ],
    function(
        Vector3,
        Matrix4
    ) {

        var PerspectiveCamera = function(fov, aspect, near, far) {
            this.fov = fov;
            this.aspect = aspect;
            this.near = near;
            this.far = far;

            this.position = new Vector3();
            this.target = new Vector3();
            this.up = Vector3.UP;

            this.proj = new Matrix4();
            this.view = new Matrix4();
        };

        PerspectiveCamera.prototype = {
            constructor: PerspectiveCamera,
            update: function(elapsed) {
                Matrix4.createPerspective(this.fov, this.aspect, this.near, this.far, /*out*/ this.proj);
                Matrix4.createLookAt(this.position, this.target, this.up, /*out*/ this.view);
            },
            getProjectionMatrix: function() {
                return proj.clone();
            },
            getViewMatrix: function() {
                return view.clone();
            }
        
        };

        return PerspectiveCamera;
    }
);
