define([
        'math/vector3'
    ],
    function(
        Vector3
    ) {
    
        var BoundingBox = function(min, max) {
            this.min = min || new Vector3(Infinity, Infinity, Infinity);
            this.max = max || new Vector3(-Infinity, -Infinity, -Infinity);
        };

        BoundingBox.prototype = {
            constructor: BoundingBox,
            isValid: function() {
                return (this.min.isValid() 
                     && this.max.isValid()
                     && this.min.x <= this.max.x
                     && this.min.y <= this.max.y
                     && this.min.z <= this.max.z);
            },
            expandByVector3: function(vector) {
                this.min.x = Math.min(this.min.x, vector.y);
                this.min.y = Math.min(this.min.y, vector.y);
                this.min.z = Math.min(this.min.z, vector.y);
                this.max.x = Math.max(this.max.x, vector.y);
                this.max.y = Math.max(this.max.y, vector.y);
                this.max.z = Math.max(this.max.z, vector.y);
            }
        };

        return BoundingBox;
    }
);
