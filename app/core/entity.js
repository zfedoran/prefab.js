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
        *   @param {name}
        *   @param {entityManager}
        */
        var Entity = function(name, entityManager){
            if (typeof entityManager === 'undefined') {
                throw 'Entity: cannot create entities without a manager.';
            }

            this.entityManager = entityManager;
            this.uuid          = Entity.generateUUID();

            // Entity properties
            this.name          = name || '';
            this.id            = _entityCount++;
            this.components    = {};

            // Entity tags
            this.tags          = {};

            // Entity hierarchy
            this.parent   = null;
            this.children = [];

            // Add this entity to the manager
            this.entityManager.addEntity(this);

            // Private variable
            var _context = this.entityManager.getContext();

            /**
            *   Add a component to this entity.
            *
            *   @method addComponent
            *   @param {component}
            *   @returns {undefined}
            */
            this.addComponent = function(component) {
                if (component instanceof Component) {
                    if (typeof component.constructor.__name__ === 'undefined') {
                        throw 'Entity: addComponent(), cannot add component with undefined constructor.__name__';
                    }

                    component.init(this, _context);

                    this.components[component.constructor.__name__] = component;
                    this.trigger('added:component', component);
                } else {
                    throw 'Entity: cannot addComponent() if the component is not an instance of Component.';
                }
            };

            /**
            *   Remove a component with the name or type provided, if it
            *   exists.
            *
            *   @method removeComponent
            *   @param {type}
            *   @returns {undefined}
            */
            this.removeComponent = function(type) {
                if (typeof type !== 'string') {
                    type = type.__name__;
                }

                var component = this.components[type];
                delete this.components[type];

                if (component) {
                    component.uninitialize(this, _context);
                    this.trigger('removed:component', component);
                }
            };
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
            *   Check if this entity has any children.
            *
            *   @method hasChildren
            *   @returns {boolean}
            */
            hasChildren: function() {
                return this.children.length > 0;
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
                    entity.parent = this;
                } else {
                    throw 'Entity: cannot addChild() if the child is not an instance of Entity.';
                }
            },

            /**
            *   Remove a child from this entity.
            *
            *   @method removeChild
            *   @param {entity}
            *   @returns {undefined}
            */
            removeChild: function(entity) {
                if (entity instanceof Entity) {
                    var index = this.children.indexOf(entity);
                    if (index > -1) {
                        this.children.splice(index, 0);
                        entity.parent = null;
                    }
                } else {
                    throw 'Entity: cannot removeChild() if the child is not an instance of Entity.';
                }
            },

            /**
            *   This function will filter the child entities by the provided
            *   selector and execute the callback for those that match.
            *
            *   @method filterChildrenBy
            *   @param {selector}
            *   @param {callback}
            *   @param {context}
            *   @returns {undefined}
            */
            filterChildrenBy: function(selector, callback, context) {
                // For each child
                var i, numChildren = this.children.length, child;
                for (i = 0; i < numChildren; i++) {
                    child = this.children[i];

                    // Test if the child passes the provided selector test
                    var testResult;
                    if (typeof selector === 'string') {
                        testResult = child.isPartOfGroup(selector);
                    } else {
                        testResult = child.hasAllComponents(selector);
                    }

                    // Run the callback function
                    if (testResult) {
                        callback.call(context, child);
                    }
                }
            },

            /**
            *   This method tags a provided entity to this entity using the
            *   provided entities name. If the entity has no name, its UUID
            *   will be used.
            *
            *   (generally used when you need to associate another entity with
            *   this one for easy access later on)
            *
            *   @method tagEntity
            *   @param {entity}
            *   @returns {undefined}
            */
            tagEntity: function(entity) {
                this.tags[entity.name || entity.uuid] = entity;
            },

            /**
            *   This method returns a tagged object using the provided tag
            *   name.
            *
            *   @method getWithTag
            *   @param {name}
            *   @returns {undefined}
            */
            getWithTag: function(name) {
                return this.tags[name];
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
            *   Check if this entity is part of the provided group name.
            *
            *   @method isPartOfGroup
            *   @param {name}
            *   @returns {undefined}
            */
            isPartOfGroup: function(name) {
                var entity = this.entityManager.filterByGroupName(name)[this.id];
                if (typeof entity === 'undefined') {
                    return false;
                }
                return true;
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
            *   Check if a list of components exists on this entity.
            *
            *   @method hasAllComponents
            *   @param {list}
            *   @returns {boolean}
            */
            hasAllComponents: function(list) {
                var i, len = list.length;
                for (i = 0; i < len; i++) {
                    if (!this.hasComponent(list[i])) {
                        return false;
                    }
                }
                return true;
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
