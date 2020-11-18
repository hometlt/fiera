
import fabric from './fabric/main.js'

import './fabric/mixins/observable.mixin.js'
import './fabric/mixins/collection.mixin.js'
import './fabric/mixins/shared_methods.mixin.js'
import './fabric/util/misc.js'
import './fabric/util/arc.js'
import './fabric/util/lang_array.js'
import './fabric/util/lang_object.js'
import './fabric/util/lang_string.js'
// import StringUtils from '../util/string.js'
// Object.assign(fabric.util.string, StringUtils)


import './fabric/util/lang_class.js'
import './fabric/util/dom_event.js'
import './fabric/util/dom_style.js'
import './fabric/util/dom_misc.js'
import './fabric/util/dom_request.js'
import './fabric/util/named_accessors.mixin.js'
import './fabric/util/parser.js'
import './fabric/util/elements_parser.js'
import '../util/canvas.toBlob.js'
import './util/log.js'

/** core logic **/
import './fabric/classes/point.class.js'
import './fabric/classes/intersection.class.js'
import './fabric/classes/color.class.js'
import './fabric/classes/static_canvas.class.js'
import './fabric/classes/canvas.class.js'
import './fabric/mixins/canvas_events.mixin.js'
import './fabric/mixins/canvas_grouping.mixin.js'
import './fabric/mixins/canvas_dataurl_exporter.mixin.js'
import './fabric/mixins/canvas_serialization.mixin.js'
import './fabric/shapes/object.class.js'

import './fabric/mixins/object_origin.mixin.js'
import './fabric/mixins/object_geometry.mixin.js'
import './fabric/mixins/object_stacking.mixin.js'
import './fabric/mixins/object.svg_export.js'
import './fabric/mixins/stateful.mixin.js'

/* fabricjs animations */
import './fabric/util/animate.js'
import './fabric/util/animate_color.js'
import './fabric/util/anim_ease.js'
import './fabric/mixins/animation.mixin.js'

/** fabricjs interaction and gestures **/
import './fabric/mixins/object_interactivity.mixin.js'
import './fabric/mixins/canvas_gestures.mixin.js'


/** fabricjs basic classes **/
import './fabric/shapes/line.class.js'
import './fabric/shapes/circle.class.js'
import './fabric/shapes/triangle.class.js'
import './fabric/shapes/ellipse.class.js'
import './fabric/shapes/rect.class.js'
import './fabric/shapes/polyline.class.js'
import './fabric/shapes/polygon.class.js'
import './fabric/shapes/path.class.js'
import './fabric/shapes/group.class.js'
import './fabric/shapes/image.class.js'
import './fabric/shapes/active_selection.class.js'
import './fabric/mixins/object_straightening.mixin.js'

/** fabricjs Text **/
import './fabric/shapes/text.class.js'
import './fabric/mixins/text_style.mixin.js'
import './fabric/shapes/itext.class.js'
import './fabric/mixins/itext_behavior.mixin.js'
import './fabric/mixins/itext_click_behavior.mixin.js'
import './fabric/mixins/itext_key_behavior.mixin.js'
import './fabric/mixins/itext.svg_export.js'
import './fabric/shapes/textbox.class.js'
import './fabric/mixins/textbox_behavior.mixin.js'

/* additional classes */
import './fabric/classes/gradient.class.js'
import './fabric/classes/pattern.class.js'
import './fabric/classes/shadow.class.js'

import '../plugins/event.js'

import './core/plugins.js'
import './core/text.ext.js'
import './core/states.js'
import './core/base.js'
import './core/xcanvas.js'

import './core/layers.js'
import './core/group.ext.js'
import './core/image.ext.js'
import './core/fromURL.js'
import './core/target.js';
import './core/interactivity.js'

import './canvas/collection.js'
import './canvas/events.js'
import './text/itext.history.js'

import {FmObject}           from './core/object.ext.js'
import {FmInitialize}		from './core/object.initialize.js'
import {FmSetters} 			from './core/object.options.js'
import {FmStates} 			from './core/states.js'
import {FmEditor} 			from './core/editor.js'
import {FmObservable}       from "./core/event-listeners.js";

fabric.installPlugins([
    FmObject,
    FmEditor,
    FmInitialize,
    FmSetters,
    FmStates,
    FmObservable
])


// import './core/editor.js'
// import './core/states.js'
// import './core/object.options.js'
// import './core/object.initialize.js'
// import './core/activate.js'

export default fabric;
