define([
        'math/vector4'
    ],
    function(
        Vector4
    ) {
        'use strict';
    
        var Material = function(shaderType) {
            this.shadingModel = shaderType || Material.LAMBERT;

            this.emissive = new Vector4(0.0, 0.0, 0.0, 1.0);
            this.ambient  = new Vector4(0.2, 0.2, 0.2, 1.0);
            this.diffuse  = new Vector4(0.8, 0.8, 0.8, 1.0);
            this.specular = new Vector4(0.0, 0.0, 0.0, 1.0);
        
            this.emissiveFactor = 1;
            this.ambientFactor  = 1;
            this.diffuseFactor  = 1;
            this.specularFactor = 1;

            this.emissiveMap = null;
            this.ambientMap  = null;
            this.diffuseMap  = null;
            this.specularMap = null;
            this.normalMap = null;

            this.transparentColor = new Vector4(0.0, 0.0, 0.0, 1.0);
            this.transparentFactor = 0; // 0 -> opaque, 1 -> transparent

            this.shininess = 0;
            this.reflectionColor = new Vector4(0.0, 0.0, 0.0, 0.0);
            this.reflectionMap = null;
            this.reflectionFactor = 0;

            this.isDirty(true);
        };

        Material.prototype = {
            isDirty: function() { return this._dirty; },
            setDirty: function(value) { this._dirty = value; },

            setEmissive:  function(val) { this.emissive.setFrom(val); this._dirty = true; },
            setAmbient:   function(val) { this.ambient.setFrom(val); this._dirty = true; },
            setDiffuse:   function(val) { this.diffuse.setFrom(val); this._dirty = true; },
            setSpecular:  function(val) { this.specular.setFrom(val); this._dirty = true; },

            getEmissive:  function() { return this.emissive; },
            getAmbient:   function() { return this.ambient; },
            getDiffuse:   function() { return this.diffuse; },
            getSpecular:  function() { return this.specular; },

            setEmissiveFactor: function(val) { this.emissiveFactor = val; this._dirty = true; },
            setAmbientFactor:  function(val) { this.ambientFactor = val; this._dirty = true; },
            setDiffuseFactor:  function(val) { this.diffuseFactor = val; this._dirty = true; },
            setSpecularFactor: function(val) { this.specularFactor = val; this._dirty = true; },

            getEmissiveFactor: function() { return this.emissiveFactor; },
            getAmbientFactor:  function() { return this.ambientFactor; },
            getDiffuseFactor:  function() { return this.diffuseFactor; },
            getSpecularFactor: function() { return this.specularFactor; },

            setEmissiveMap: function(val) { this.emissiveMap = val; this._dirty = true; },
            setAmbientMap:  function(val) { this.ambientMap = val; this._dirty = true; },
            setDiffuseMap:  function(val) { this.diffuseMap = val; this._dirty = true; },
            setSpecularMap: function(val) { this.specularMap = val; this._dirty = true; },
            setNormalMap:   function(val) { this.normalMap = val; this._dirty = true; },

            getEmissiveMap: function() { return this.emissiveMap; },
            getAmbientMap:  function() { return this.ambientMap; },
            getDiffuseMap:  function() { return this.diffuseMap; },
            getSpecularMap: function() { return this.specularMap; },
            getNormalMap:   function() { return this.normalMap; },

            setTransparentColor: function(val) { this.transparentColor.setFrom(val); this._dirty = true; },
            getTransparentColor: function() { return this.transparentColor; },

            setTransparentFactor: function(val) { this.transparentFactor = val; this._dirty = true; },
            getTransparentFactor: function() { return this.transparentFactor; },

            setShininess: function(val) { this.shininess = val; this._dirty = true; },
            getShininess: function() { return this.shininess; },

            setReflectionColor: function(val) { this.reflectionColor.setFrom(val); this._dirty = true; },
            getReflectionColor: function() { return this.reflectionColor; },

            setReflectionFactor: function(val) { this.reflectionFactor = val; this._dirty = true; },
            getReflectionFactor: function() { return this.reflectionFactor; },

            setReflectionMap: function(val) { this.reflectionMap = val; this._dirty = true; },
            getReflecitonMap: function() { return this.normalMap; },
        };

        Material.BASIC    = 'basic';
        Material.TEXTURED = 'textured';
        Material.LAMBERT  = 'lambert';
        Material.PHONG    = 'phong';
        Material.TEXT     = 'text';

        return Material;
    }
);
