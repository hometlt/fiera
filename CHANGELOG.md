# Changelog

## [2020.03.03]
- **breaking**: options states setters/getter refactoring
- refactoring: moved plugins library outside of src
- removed: tools internatiolization
- add: webgl canvas renderer
- fix: setActiveSlide argument now from 0
- add: sourceCanvas module
- add: image-dpi module

## [2020.02.11]
- **breaking**: ES modules plugins system
- **breaking**: added Toolbar contoller. 
- refactoring: renamed `value` to `variable`. action function set 1 target argument
- fixed: improved 
- add: potrace tracing library
- add: clipboard polyfill

## [2020.02.04]
- **breaking**: removing Fabricjs backward comatibility. Removing Separate Sync Classes. from now all klasses are sync
- **breaking**: using "_set" method abd "cacheProperties" option to propogate re-render for parent objects
- add: better subtargets events.
- add: beforeRender /afterRender objects options. used for decorations, stickers
- add: puzzleSize, puzzleTransform, puzzleOverflow options
- add: rulers options 
- add: stickers module
- add: trace module
- add: Fiera manual tests
- add: typings
- fix: improving file dialog
- fix: clippath rendering on canvas zoom
- fix: zoom-to-point

## [2020.01.20]

- **breaking**: ES6 modules
- Add: PNG metadata reading/writing
- Add: NodeJS Auth
- Add: NodeJS Mongoose
- Add: Puzzle module
- Add: Warp Object
- Add: NodeJS fonts fallbacks
- Add: locked setters/getters
- Add: D3 Charts
- Add: controls module : buttons controls, ActiveCorner property
- Add: fabric.BackgroundImage, fabric.OverlayImage classes
- Add: fabric.Area class
- Add: alignElements, alignElementsInArea alignElements in ActiveSelection function
- Add: ShapeBrush
- Removed: RectangleBrush
- Fix: PatternBrush, PencilBrush fixed
- Optimisation: replaced "application" variable with editor
- Optimisation: removing underscore global dependency

## [2019.10.14]

- **breaking**: removed fabric.Frame class. 
- **breaking**: image.crop module 
- **breaking**: object.clippath module
- **breaking**: object.frame module. possiblity to apply frame for any object
- **breaking**: Added support multiple Toolbar instances for the same object. "Static" toolbars. 
- Add: modular toolbar styles. Toolbar styles variables
- Add: SVG-inline loader. new SVG icons for alignment actions. toolbarButton buttonContent property
- Fix: bug with cutted frame during cropping
- Fix: fixed bugs with pixelating of cropped images
- Improvement: rewrited toSVG functions.
- Add: group/ungroup,alignment, dimensions actions
- Improvement: PDF shadow support
- Improvement: better prototyping
- Add: webPackDevServer. possibly to add Hot reloading [article](https://dev.to/riversun/how-to-run-webpack-dev-server-on-express-5ei9)
- Fix: eventListeners prototyping bugs
- Add: FontAwesome PRO, fontawesome-after icons
- Add: fiera-node webpack build




## [2020.07.28]
- colorfont textRender
- emojis textRender
- crop: active parent element
- configurable node plugins
- node-webgl warp