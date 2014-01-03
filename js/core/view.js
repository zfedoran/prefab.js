define([
        'core/entity',
        'entities/guiLayerEntity'
    ],
    function(
        Entity,
        GUILayerEntity
    ) {
        'use strict';
    
        var View = function(context, viewRect) {
            Entity.call(this);

            this.context        = context;
            this.scene          = context.scene;
            this.entityManager  = context.entityManager;

            this.viewRect = viewRect;

        };

        View.prototype = Object.create(Entity.prototype);

        View.prototype.constructor = View;

        View.prototype.getGroupInstanceName = function(group) {
            return group + this.id;
        };

        View.prototype.addEntityToGroup = function(entity, group) {
            this.entityManager.addEntityToGroup(entity, this.getGroupInstanceName(group));
        };

        View.prototype.removeEntityFromGroup = function(entity, group) {
            this.entityManager.removeEntityFromGroup(entity, this.getGroupInstanceName(group));
        };

        View.prototype.getWidth = function() {
            return this.viewRect.width;
        };

        View.prototype.getHeight = function() {
            return this.viewRect.height;
        };
    
        return View;
    }
);
