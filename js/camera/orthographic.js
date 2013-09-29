define([
        'math/Vector3',
        'math/matrix4'
    ],
    function(
        Vector3,
        Matrix4
    ) {

        var OrthographicCamera = function(width, height, near, far, offCenter) {
            this.width = width;
            this.height = height;
            this.near = (near !== undefined) ? near : 0.1;
            this.far = (far !== undefined) ? far : 100;
            this.offCenter = (offCenter !== undefined) ? offCenter : true;

            this.proj = new Matrix4();
            this.view = new Matrix4();
        };

        OrthographicCamera.prototype = {
            constructor: OrthographicCamera,
            update: function(elapsed) {
                if (this.offCenter) {
                    Matrix4.createOrthographic(0,this.width,0,this.height,this.near,this.far,/*out*/ this.proj);
                } else {
                    Matrix4.createOrthographic(this.width/-2,this.width/2,this.height/-2,this.height/2,this.near,this.far,/*out*/ this.proj);
                }
            },
            getProjectionMatrix: function() {
                return proj.clone();
            },
            getViewMatrix: function() {
                return view.clone();
            }
        
        };

        return OrthographicCamera;
    }
);
