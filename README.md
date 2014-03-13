<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/header.png" alt="" />

##About the Project

The goal of this project is to make it as easy as possible to create block based 3d assets. Prefab.js should have built in texturing support as well. Animations will be handled by external tools, such as Blender.

The architecture is loosely based on the entity component system ([ECS](http://en.wikipedia.org/wiki/Entity_component_system)). This is similar to the architecture provided by [Unity](http://docs.unity3d.com/Documentation/Components/index.html), with some key differences. Unlike Unity, `Components` contain only data and no logic. The logic has been moved out to `Controllers` that process groups of entities based on which components exist within the entities. This promotes separation of concern and reduces spaghetti code. `Entities` exist for only for convenience and should not contain any logic. More information can be found [here](http://piemaster.net/2011/07/entity-component-primer/).

As a personal challenge, I chose not to use HTML for UI elements on this project. All rendering is done through WebGL. This may result in performance gains down the line. 

###Technologies

* JavaScript
* WebGL
* NodeWebkit

###Direction

This project is a result of frustration in trying to create 3d game assets quickly. Texture mapping blocks, with 3d content creation tools such as Blender, is large pain and takes a lot of time. One of the goals of this project is to streamline both the model creation and the texture painting processes. 

The following 3d models were created with [Blender](http://www.blender.org/). It took more time and effort than it should have, as Blender is simply not designed to work with blocks. These models and the effort taken to create them are primary driving factors behind this project.

<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/sample.png" alt="" />

##Current Status

This project is **very** early in development stages and is provided only as a code reference at this time.

<img src="https://github.com/zfedoran/prefab.js/raw/master/doc/images/screenshot.png" alt="" />

