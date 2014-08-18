<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/header.png" alt="" />

##About the Project

The goal of this project is to make it as easy as possible to create block based 3d assets. Prefab.js should have built in texturing support as well. Animations will be handled by external tools, such as Blender.

The architecture is loosely based on the entity component system ([ECS](http://en.wikipedia.org/wiki/Entity_component_system)). This is similar to the architecture provided by [Unity](http://docs.unity3d.com/Documentation/Components/index.html), with some key differences. Unlike Unity, `Components` contain only data and no logic. The logic has been moved out to `Controllers` that process groups of entities based on which components exist within the entities. This promotes separation of concern and reduces spaghetti code. `Entities` exist only for convenience and should not contain any logic. More information can be found [here](http://piemaster.net/2011/07/entity-component-primer/).

All rendering is done through WebGL, including UI elements. This may result in performance gains down the line but is primarily done to increase platform/language portability.

###Technologies

* JavaScript
* WebGL
* NodeWebkit
* Minimal DOM usage (WebGL is used for UI)

###Direction

This project is a result of frustration in trying to create 3d game assets quickly. Texture mapping `3D blocks`, with 3D content creation tools such as Blender, is large pain and takes a lot of time. One of the goals of this project is to streamline both the model creation and the texture painting processes. 

The following 3d models were created with [Blender](http://www.blender.org/). These models are primary driving factors behind this project.

<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/sample.png" alt="" />


###Milestone 1 - current
This milestone is largely devoted to getting the core components completed. This includes various WebGL wrappers, Math class, Entity manages, UI components, and Input devices.

* Math Library
	* Vector2/3/4 Classes
	* Matrix & Quaternion Classes
	* Ray Class
	* Util Classes (Rectangle, Bounding Box, Math Helper)
* Entity Component System
	* Entity Class
	* Entity Manager
	* Basic components for: Camera, Transform, Mesh, Block
* Rendering pipeline
	* WebGL wrapper class (GraphicsDevice)
	* Rendering loop
	* Support for materials / shaders / textures
	* Mesh Renderer
	* Text rendering (Sprite font support)
	* Camera support (view + projection calculations)
* Basic UI framework
	* Support for Buttons, Labels, Inputs
	* Support for Active, Hover, and Normal states on UI elements
	* Raycasting of UI elements (2d to 3d unprojection of  mouse coordinates)
* Input Devices
	* Keyboard Class
	* Mouse Class

###Milestone 2
Once most of the core classes are in place, this milestone will largely focus on fleshing out the UI features required to build a menu. The focus will be on hard coding the Transform and Block properties into a UI menu.

* Basic UI layout support
* Initial Property Inspector (menu for component properties)
	* Transform Component
	* Block Component
* Basic keyboard controls for 3D view
* 3D orientation widget
	* Allows the user to switch between views (top, bottom, left, right, front, back)
	* Allows the user to switch between ortho and perspective
	
###Milestone 3
This milestone will make the Property Inspector more generic, allowing any component to be shown as long as it has exposed properties.

* Property Inspector
	* Generic support for any type of component

###Milestone 4
This milestone will focus on adding support for multiple non-overlaping windows or views. The windows will function in a manner similar to Blender's UI. Initial work will begin on creating Scene Graph and Asset views.

* Window management (non-overlaping views) similar to Blender's UI
	* 3D Scene view
	* Scene Graph view
	* Asset view

###Milestone 5
This milestone will focus on adding the texture painting and mapping functionality. 

* 2D texture mapping view
* 2D painting
	* Support for drawing on textures
	* Paint brush support
	* Color panel
	
###Milestone 6
This milestone will focus on adding features that are required to actually save and load scenes. A file menu will be created to facilitate this functionality. Once this milestone is complete, the application should be at its first usable state. 

* File format for scenes
* File menu for application 
* Undo/Redo support

<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/wireframe.png" alt="" />

##Screenshots

Note: this project is **very** early in development stages and not yet usable in practical terms.

<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/screenshot.png" alt="" />

