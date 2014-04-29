define([
        'lodash',
        'core/component',
        'core/events'
    ],
    function(
        _,
        Component,
        Events
    ) {
        'use strict';

        var _entityCount = 0;

        /**
        *   Base entity class. An entity is made up of components and may have
        *   a hierarchy of child entities.
        *
        *   @class
        *   @constructor
        */
        var Entity = function(entityManager){
            if (typeof entityManager === 'undefined') {
                throw 'Entity: cannot create entities without a manager.';
            }

            this.entityManager = entityManager;
            this.uuid          = Entity.generateUUID();

            // Entity properties
            this.name          = '';
            this.id            = _entityCount++;
            this.components    = {};

            // Entity hierarchy
            this.parent   = null;
            this.children = [];

            // Add this entity to the manager
            this.entityManager.addEntity(this);
        };

        Entity.prototype = {
            constructor: Entity,

            /**
            *   Check if this entity has a parent class.
            *
            *   @method hasParent
            *   @returns {boolean}
            */
            hasParent: function() {
                return this.parent !== null;
            },

            /**
            *   Get the parent entity, if one exists.
            *
            *   @method getParent
            *   @returns {entity}
            */
            getParent: function() {
                return this.parent;
            },

            /**
            *   Set the parent entity to the provided entity.
            *
            *   @method setParent
            *   @param {entity}
            *   @returns {undefined}
            */
            setParent: function(entity) {
                this.parent = entity;
            },

            /**
            *   Add a child to this entity.
            *
            *   @method addChild
            *   @param {entity}
            *   @returns {undefined}
            */
            addChild: function(entity) {
                if (entity instanceof Entity) {
                    this.children.push(entity);
                    entity.setParent(this);
                }
            },

            /**
            *   Check if this entity has any children.
            *
            *   @method hasChildren
            *   @returns {boolean}
            */
            hasChildren: function() {
                return this.children.length > 0;
            },

            /**
            *   Remove a child from this entity.
            *
            *   @method removeChild
            *   @param {entity}
            *   @returns {undefined}
            */
            removeChild: function(entity) {
                var index = this.children.indexOf(entity);
                if (index > -1) {
                    this.children.splice(index, 0);
                    entity.setParent(null);
                }
            },

            /**
            *   Add this entity to the provided group name.
            *
            *   @method addToGroup
            *   @param {name}
            *   @returns {undefined}
            */
            addToGroup: function(name) {
                this.entityManager.addEntityToGroup(this, name);
            },

            /**
            *   Remove this entity from the provided group name.
            *
            *   @method removeFromGroup
            *   @param {name}
            *   @returns {undefined}
            */
            removeFromGroup: function(name) {
                this.entityManager.removeFromGroup(this, name);
            },

            /**
            *   Add a component to this entity.
            *
            *   @method addComponent
            *   @param {component}
            *   @returns {undefined}
            */
            addComponent: function(component) {
                if (component instanceof Component) {
                    if (typeof component.constructor.__name__ === 'undefined') {
                        throw 'Entity: addComponent(), cannot add component with undefined constructor.__name__';
                    }
                    component.setEntity(this);
                    this.components[component.constructor.__name__] = component;
                    this.trigger('component.added', component);
                }
            },

            /**
            *   Get a component which matches the name or type provided.
            *
            *   @method getComponent
            *   @param {type}
            *   @returns {component}
            */
            getComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }
                return this.components[type];
            },

            /**
            *   Check if a component with the name or type exists on this
            *   entity.
            *
            *   @method hasComponent
            *   @param {type}
            *   @returns {boolean}
            */
            hasComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }
                return typeof this.components[type] !== 'undefined';
            },

            /**
            *   Remove a component with the name or type provided, if it
            *   exists.
            *
            *   @method removeComponent
            *   @param {type}
            *   @returns {undefined}
            */
            removeComponent: function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }

                var component = this.components[type];
                delete this.components[type];

                if (component) {
                    this.trigger('component.removed', component);
                }
            },

            /**
            *   Returns the name of this entity.
            *
            *   @method toString
            *   @returns {string}
            */
            toString: function() {
                return this.name;
            }
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
