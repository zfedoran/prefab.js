define([
        'math/rectangle'
    ],
    function(
        Rectangle
    ) {
        'use strict';

        var GUIStyle = function() {
            this.position = 'static';

            this.color = null;
            this.background = null;

            this.fontFamily = 'monospace';
            this.fontSize = 10;
            this.fontStyle = 'none';
            this.lineHeight = 'auto';
            this.textAlign = 'left';

            this.width = 'auto';
            this.height = 'auto';

            this.left = 0;
            this.right = 0;  // overrides the width
            this.top = 0;
            this.bottom = 0; // overrides the height

            this.padding = 0;
            this.paddingTop = 0;
            this.paddingBottom = 0;
            this.paddingLeft = 0;
            this.paddingRight = 0;

            this.margin = 0;
            this.marginTop = 0;
            this.marginBottom = 0;
            this.marginLeft = 0;
            this.marginRight = 0;

            this.state = new Rectangle();
        };

        GUIStyle.prototype = {
            updateState: function(parentState) {
                this.state.x = this.getPositionX(parentState.x, parentState.width);
                this.state.y = this.getPositionY(parentState.y, parentState.height);
                this.state.width = this.getWidth(parentState.width);
                this.state.height = this.getHeight(parentState.height);
            },

            getCurrentState: function() {
                return this.state;
            },

            getNumberValue: function(value, base) {
                if (typeof value === 'number') {
                    return value;
                }

                if (typeof value === 'string') {
                    var hasPercent = value.match(/%/);
                    var number = value.match(/\d*\.?\d*/);

                    if (hasPercent) {
                        number = number / 100;
                        return base * number;
                    } 

                    return number;
                }

                throw 'GUIStyle: cannot get number value of ' + typeof value;
            },

            getPositionX: function(currentX, currentWidth) {
                var offset = 0;
                if (this.marginLeft !== 'auto') {
                    offset = this.getNumberValue(this.marginLeft, currentWidth);
                }

                if (this.position === 'relative') {
                    return offset + currentX + this.getNumberValue(this.left, currentX);
                }

                if (this.position === 'absolute') {
                    return offset + this.getNumberValue(this.left, currentX);
                }

                return offset + currentX;
            },

            getPositionY: function(currentY, currentHeight) {
                var offset = 0;
                if (this.marginTop !== 'auto') {
                    offset = this.getNumberValue(this.marginTop, currentHeight);
                }

                if (this.position === 'relative') {
                    return offset + currentY + this.getNumberValue(this.top, currentY);
                }

                if (this.position === 'absolute') {
                    return offset + this.getNumberValue(this.top, currentY);
                }

                return offset + currentY;
            },

            getWidth: function(currentWidth) {
                if (this.right !== 'auto') {
                    var width = currentWidth - this.getNumberValue(this.right, currentWidth);
                    if (width < 0) {
                        return 0;
                    }
                    return width;
                }

                if (this.width !== 'auto') {
                    return this.getNumberValue(this.width, currentWidth);
                }

                return currentWidth;
            },

            getHeight: function(currentHeight) {
                if (this.bottom !== 'auto') {
                    var height = currentHeight - this.getNumberValue(this.bottom, currentHeight);
                    if (height < 0) {
                        return 0;
                    }
                    return height;
                }

                if (this.height !== 'auto') {
                    return this.getNumberValue(this.height, currentHeight);
                }

                return currentHeight;
            }
        };

        return GUIStyle;
    }
);
