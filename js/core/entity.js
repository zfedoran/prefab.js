define([
        'underscore',
        'core/events'
    ],
    function(
        _,
        Events
    ) {

        var _entityCount = 0;

        var Entity = function(){
            this.uuid = Entity.generateUUID();
            this.name = '';
            this.id = _entityCount;
            this.components = {};
            _entityCount++;
        };

        Entity.prototype = {
            constructor: Entity,

            toString: function() {
                return this.name;
            },

            addComponent: function(component) {
                if (component) {
                    if (typeof component.constructor.__name__ === 'undefined') {
                        throw 'Entity: addComponent(), cannot add component with undefined constructor.__name__';
                    }
                    this.components[component.constructor.__name__] = component;
                    this.trigger('component.added', component);
                }
            },

            getComponent: function(type) {
                return this.components[type.__name__];
            },

            hasComponent: function(type) {
                return typeof this.components[type.__name__] !== 'undefined';
            },

            removeComponent: function(type) {
                var component = this.components[type.__name__];
                delete this.components[type.__name__];
                if (component) {
                    this.trigger('component.removed', component);
                }
            },
        };

        Entity.generateUUID = (function (){
            // http://www.broofa.com/Tools/Math.uuid.htm
            var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            var charArray = chars.split('');
            var uuid = new Array(36);
            var rnd = 0, r, i;
            return function () {
                for (i = 0; i < 36; i++) {
                    if (i === 8 || i === 13 || i === 18 || i === 23) {
                        uuid[i] = '-';
                    } else if (i === 14) {
                        uuid[i] = '4';
                    } else {
                        if (rnd <= 0x02) {
                            rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                        } 
                        r = rnd & 0xf;
                        rnd = rnd >> 4;
                        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
                    }
                }
                return uuid.join('');
            };
        }());

        _.extend(Entity.prototype, Events.prototype);

        return Entity;
    }
);
