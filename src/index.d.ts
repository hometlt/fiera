// Type definitions for FabricJS
// Project: http://fabricjs.com/
// Definitions by: Oliver Klemencic <https://github.com/oklemencic/>

type SVGDocument = Document;

/** A Blob object represents a file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system. */
interface Blob {
  readonly size: number;
  readonly type: string;
  arrayBuffer(): Promise<ArrayBuffer>;
  slice(start?: number, end?: number, contentType?: string): Blob;
}

declare var Blob: {
  prototype: Blob;
  new(blobParts?: BlobPart[], options?: BlobPropertyBag): Blob;
};


declare module fabric {

  function createCanvasForNode(width: number, height: number): ICanvas;
  function getCSSRules(doc: SVGDocument);
  function getGradientDefs(doc: SVGDocument);
  function loadSVGFromString(text: string, callback: (results: IObject[], options) => void , reviver?: (el, obj) => void );
  function loadSVGFromURL(url, callback: (results: IObject[], options) => void , reviver?: (el, obj) => void );
  function log(values);
  function parseAttributes(element, attributes: any[]): any;
  function parseElements(elements: any[], callback, options, reviver);
  function parsePointsAttribute(points: string): any[];
  function parseStyleAttribute(element: SVGElement);
  function parseSVGDocument(doc: SVGDocument, callback: (results, options) => void , reviver?: (el, obj) => void );
  function parseTransformAttribute(attributeValue: string);
  function warn(values);

  const isLikelyNode: boolean;
  const isTouchSupported: boolean;

  export interface IObservable {
    observe(eventCollection: IEventList);
    on(eventCollection: IEventList);

    observe(eventName: string, handler: (e) => any);
    on(eventName: string, handler: (e) => any);

    fire(eventName: string, options?);
    stopObserving(eventName: string, handler: (e) => any);

    off(eventName, handler);
  }

  export interface IFilter {
    new (): IFilter;
    new (options: any): IFilter;
  }

  export interface IEventList {
    [index: string]: (e: Event) => void;
  }

  export interface IObjectOptions {
    id?: string;
    prototype?: string;
    angle?: number;
    borderColor?: string;
    borderDashArray?: number[];
    borderOpacityWhenMoving?: number;
    borderWidth?: number;
    cornerColor?: string;
    cornerStyle?: string;
    cornerShadow?: fabric.IShadowOptions;
    cornerSize?: number;
    fill?: string;
    fillRule?: string;
    flipX?: boolean;
    flipY?: boolean;
    hasBorders?: boolean;
    hasControls?: boolean;
    hasRotatingPoint?: boolean;
    height?: number;
    includeDefaultValues?: boolean;
    left?: number;
    lockMovementX?: boolean;
    lockMovementY?: boolean;
    lockScalingX?: boolean;
    lockScalingY?: boolean;
    lockUniScaling?: boolean;
    lockScalingFlip?: boolean;
    lockRotation?: boolean;
    opacity?: number;
    originX?: string;
    originY?: string;
    overlayFill?: string;
    padding?: number;
    perPixelTargetFind?: boolean;
    rotationPointBorder?: boolean;
    rotatingPointOffset?: number;
    scaleX?: number;
    scaleY?: number;
    selectable?: boolean;
    stateProperties?: any[];
    stroke?: string;
    strokeDashArray?: any[];
    strokeWidth?: number;
    globalCompositeOperation?: string;
    top?: number;
    transformMatrix?: any[];
    transparentCorners?: boolean;
    type?: string;
    width?: number;
    visible ?: boolean;
    //zoom.js
    mouseWheelScale?: boolean;
    position?: string;
    eventListeners?: {[key: string]: Function | string}
    snapAngle?:number;
    snapThreshold?:number;
    shadow?: fabric.IShadowOptions;
    //sticker
    sticker?: boolean;
    stickerOptions?: IPathOptions;

    loader?: string;
    deactivationDisabled?: boolean;
    resizable?: boolean;

    //todo clippath
    clipPath?: any;// IShapeOptions
    clipPathFitting?: string;
    storeProperties?: string[];
    hasBoundControls?: boolean;
    hasTransformControls?: boolean;
    hasShapeBorders?: boolean;
    useSuperClassStoreProperties?: boolean;
    locked?: boolean;
    evented?: boolean;
    active?: boolean;
    stored?: boolean;

    minDpi?: number,
    dpiWarningClass?: string;
    roundCoordinates?: number;

    puzzleSpacingX?: number;
    puzzleSpacingY?: number;
    puzzlePreset?: string;
    puzzle?: {
      offsetsY?: {x: number, y: number}[],
      offsetsX?: {x: number, y: number}[]
    }

    inactiveHoverOptions?: IObjectOptions;
    activeOptions?: IObjectOptions;
    inactiveOptions?: IObjectOptions;
    activeHoverOptions?: IObjectOptions;
    resizableEdge?: boolean;
    inactiveBorder?: boolean;
    controls?: {
      [index: string]: {
        style?: string;
        button?: boolean,
        size?: number,
        intransformable?: boolean,
        styleFunction?: (control, ctx, methodName, left, top, size, stroke) => void;
        action?: string,
        altAction?: string,
        visible?: string,
        x: string | number,
        y: string | number,
        cursor?: string
      }
    }
  }

  export interface IShapeOptions  {
    offsets?:  number | [number,number,number,number]
    offsetsUnits?: number | [number,number,number,number]
    points?: number[]
    radius?: number | number[],
    path?: string,
    units?: string,
    src?: string,
    original?: {
      "width": number,
      "height": number
    }
  }


  type PathInstructionDeclaration = (string | number)[]
  type PathDeclaration = string | PathInstructionDeclaration[]

  export interface IPathOptions extends IObjectOptions {
    path?: PathDeclaration,
    strokeLineCap?: string,
    strokeLineJoin?: string,
  }

  export interface ITextOptions extends IObjectOptions {
    lockOnEdit?: boolean;
    charSpacing?: number;
    fontSize?: number;
    fontWeight?: any;
    fontFamily?: string;
    color?: string;
    textDecoration?: string;
    textShadow?: string;
    textAlign?: string;
    fontStyle?: string;
    lineHeight?: number;
    strokeStyle?: string;
    strokeWidth?: number;
    backgroundColor?: string;
    textBackgroundColor?: string;
    type?: string;
    text?: string;
  }

  export interface IGroupOptions extends IObjectOptions {
    objects?: IAnyObjectOptions[];
    contentOrigin?: string;
  }

  export interface ILineOptions extends IObjectOptions {
    x1?: number;
    x2?: number;
    y1?: number;
    y2?: number;
  }

  export interface IImageOptions extends IObjectOptions {
    src?: string | false;
    sourceRoot?: string;
    thumbnailSourceRoot?: string;
    sourceCanvas?: ICanvasOptions;
    element?: HTMLImageElement | HTMLCanvasElement
    fitting?: string;

    //crop module
    crop?: {
      top: number,
      left: number,
      scaleX: number,
      scaleY: number
    },
  }

  export interface ICircleOptions extends IObjectOptions {
    radius?: number;
  }

  export interface IWarpOptions extends IObjectOptions {
    subdivisions?: number;
    points?: [number] | [{x: number,y : number}] | false;
    transformations? : false | [{x: number, y: number, c?: boolean | 0 | 1}];
  }

  export interface IAnyObjectOptions extends ICanvasOptions, IRectOptions, ICircleOptions, ITextOptions ,IPathOptions, IImageOptions, ILineOptions, IGroupOptions, IWarpOptions {
  }

  export interface IPoint {
    add(that: IPoint): IPoint;
    addEquals(that: IPoint): IPoint;
    distanceFrom(that: IPoint);
    divide(scalar: number);
    divideEquals(scalar: number);
    eq(that: IPoint);
    gt(that: IPoint);
    gte(that: IPoint);
    init(x, y);
    lerp(that: IPoint, t);
    lt(that: IPoint);
    lte(that: IPoint);
    max(that: IPoint);
    min(that: IPoint);
    multiply(scalar);
    multiplyEquals(scalar);
    scalarAdd(scalar): IPoint;
    scalarAddEquals(scalar: number, thisArg: IPoint);
    scalarSubtract(scalar: number);
    scalarSubtractEquals(scalar);
    setFromPoint(that: IPoint);
    setXY(x, y);
    subtract(that: IPoint): IPoint;
    subtractEquals(that: IPoint): IPoint;
    swap(that: IPoint);
    tostring(): string;
  }



  export interface IShadowOptions {
    affectStroke?: boolean,
    color?: string,
    blur?: number,
    offsetX?: number,
    offsetY?: number
  }

  export interface IUploaderOptions {
    onRead: Function
  }

  export interface IObject extends IObservable, IObjectOptions {
    id: string;

    clipPath: IObject;
    strokeStyle: string;
    backgroundColor: string;
    group: IGroup;

    // constraint properties
    lockMovementX: boolean;
    lockMovementY: boolean;
    lockScalingX: boolean;
    lockScalingY: boolean;
    lockScaling: boolean;
    lockUniScaling: boolean;
    lockScalingFlip: boolean;
    lockRotation: boolean;

    getCurrentWidth(): number;
    getCurrentHeight(): number;
    setPuzzlePreset(value: string);
    setPuzzle(value: {
      offsetsY?: {x: number, y: number}[],
      offsetsX?: {x: number, y: number}[]
    } | Boolean);

    originX: string;
    originY: string;

    angle: number;
    getAngle(): number;
    setAngle(value: number): IObject;

    borderColor: string;
    getBorderColor(): string;
    setBorderColor(value: string): IObject;

    borderOpacityWhenMoving: number;
    borderScaleFactor: number;
    getBorderScaleFactor(): number;

    cornerColor: string;

    cornersize: number;
    getCornersize(): number;
    setCornersize(value: number): IObject;

    fill: string;
    getFill(): string;
    setFill(value: string): IObject;

    fillRule: string;
    getFillRule(): string;
    setFillRule(value: string): IObject;

    flipX: boolean;
    getFlipX(): boolean;
    setFlipX(value: boolean): IObject;

    flipY: boolean;
    getFlipY(): boolean;
    setFlipY(value: boolean): IObject;

    hasBorders: boolean;

    hasControls: boolean;
    hasRotatingPoint: boolean;

    height: number;
    getHeight(): number;
    setHeight(value: number): IObject;

    includeDefaultValues: boolean;

    left: number;
    getLeft(): number;
    setLeft(value: number): IObject;

    opacity: number;
    getOpacity(): number;
    setOpacity(value: number): IObject;

    overlayFill: string;
    getOverlayFill(): string;
    setOverlayFill(value: string): IObject;

    padding: number;
    perPixelTargetFind: boolean;
    rotatingPointOffset: number;

    scaleX: number;
    getScaleX(): number;
    setScaleX(value: number): IObject;

    scaleY: number;
    getScaleY(): number;
    setScaleY(value: number): IObject;

    selectable: boolean;
    stateProperties: any[];
    stroke: string;
    strokeDashArray: any[];
    strokeWidth: number;

    top: number;
    getTop(): number;
    setTop(value: number): IObject;

    transformMatrix: any[];
    transparentCorners: boolean;
    type: string;
    effectiveDpi: number;

    width: number;
    getWidth(): number;
    setWidth(value: number): IObject;

    // methods
    isOnBottom(): boolean;
    isOnTop(): boolean;
    bringForward(): IObject;
    bringToFront(): IObject;
    center(): IObject;
    centerH(): IObject;
    centerV(): IObject;
    clone(callback?, propertiesToInclude?): IObject;
    cloneAsImage(callback): IObject;
    complexity(): number;
    drawBorders(context: CanvasRenderingContext2D): IObject;
    drawCorners(context: CanvasRenderingContext2D): IObject;
    get (property: string): any;
    getBoundingRectHeight(): number;
    getBoundingRectWidth(): number;
    getSvgStyles(): string;
    getSvgTransform(): string;
    hasStateChanged(): boolean;
    initialize(options: any);
    intersectsWithObject(other: IObject): boolean;
    intersectsWithRect(selectionTL: any, selectionBR: any): boolean;
    isActive(): boolean;
    isContainedWithinObject(other: IObject): boolean;
    isContainedWithinRect(selectionTL: any, selectionBR: any): boolean;
    isType(type: string): boolean;
    remove(): IObject;
    render(ctx: CanvasRenderingContext2D, noTransform: boolean);
    rotate(value: number): IObject;
    saveState(): IObject;
    scale(value: number): IObject;
    scaleToHeight(value: number): IObject;
    scaleToWidth(value: number): IObject;
    sendBackwards(): IObject;
    sendToBack(): IObject;

    set(properties: IAnyObjectOptions): IObject;
    set(name: string, value: any): IObject;
    setActive(active: boolean): IObject;
    setCoords();
    setGradientFill(options);
    setOptions(options: any);
    setSourcePath(value: string): IObject;
    toDatalessObject(propertiesToInclude): any;
    toDataURL(callback): string;
    toggle(property): IObject;
    toGrayscale(): IObject;
    toJSON(propertiesToInclude): string;
    toObject(propertiesToInclude): IAnyObjectOptions;
    tostring(): string;
    transform(ctx: CanvasRenderingContext2D);
    removeFromCanvas()
    //additional methods
    getThumbnail(options: {
      width?: number,
      height?: number,
      scale?: number,
      shadow?: boolean
    }, output?: HTMLCanvasElement) :  HTMLCanvasElement;

    setClipPath(clipPath: any): void;

    drawObject(ctx: CanvasRenderingContext2D)
    dirty: boolean;
    dpiWarning: boolean;
    getState(): IAnyObjectOptions;
    canvas: ICanvas;
    shadow: fabric.IShadowOptions;
    //todo should not list private functions here
    _setShadow (ctx: CanvasRenderingContext2D, object : IObject);
    calcTransformMatrix: any;
    updateClipPath: () => void
  }

  export interface IRect extends IObject {
    x: number;
    y: number;
    rx: number;
    ry: number;

    initialize(options: any);
    initialize(points: number[], options: any): IRect;

    complexity(): number;
    toObject(propertiesToInclude: any[]): any;
    toSVG(): string;
  }

  export interface IText extends IObject {

    charSpacing: number;
    fontSize: number;
    fontWeight: any;
    fontFamily: string;
    fontStyle: string;
    textDecoration: string;
    textShadow: string;
    textAlign: string;
    lineHeight: number;
    textBackgroundColor: string;
    text: string;

    initialize(options: any);
    initialize(text: string, options: any): IText;

    toString(): string;
    render(ctx: CanvasRenderingContext2D, noTransform: boolean);
    toObject(propertiesToInclude: any[]): IObject;
    toSVG(): string;
    setColor(value: string): IText;
    setFontsize(value: number): IText;
    getStyle(style: string): any;
    setStyle(style: string, value: any): void;
    getText(): string;
    setText(value: string): IText;
  }

  export interface ITriangle extends IObject {
    complexity(): number;
    initialize(options: any): ITriangle;
    toSVG(): string;
  }

  export interface IEllipse extends IObject {
    initialize(options: any): any;
    toObject(propertiesToInclude: any[]): any;
    toSVG(): string;
    render(ctx: CanvasRenderingContext2D, noTransform: boolean);
    complexity(): number;
  }

  export interface IGroup extends IObject {
    initialize(options: any);
    initialize(objects, options): any;

    remove(): IObject;
    remove(object): IGroup;

    activateAllObjects(): IGroup;
    add(object): IGroup;
    addWithUpdate(object): IGroup;
    complexity(): number;
    contains(object): boolean;
    containsPoint(point): boolean;
    destroy(): IGroup;
    getObjects(): IObject[];
    hasMoved(): boolean;
    item(index): IObject;
    removeWithUpdate(object): IGroup;
    render(ctx, noTransform): void;
    saveCoords(): IGroup;
    setObjectsCoords(): IGroup;
    size(): number;
    toObject(propertiesToInclude: any[]): any;
    tostring(): string;
    toSVG(): string;
  }

  export interface ILine extends IObject {
    x1: number;
    x2: number;
    y1: number;
    y2: number;

    initialize(options: any);
    initialize(points: number[], options: any): ILine;

    complexity(): number;
    toObject(propertiesToInclude: any[]): any;
    toSVG(): string;
  }

  export interface IImage extends IObject {
    filters: any;
    initialize(options: any);
    initialize(element: string, options: any);

    applyFilters(callback);
    clone(propertiesToInclude, callback);
    complexity(): number;
    getElement(): HTMLImageElement;
    getOriginalSize(): { width: number; height: number; };
    getSrc(): string;
    initialize(element: HTMLImageElement, options: any);
    render(ctx: CanvasRenderingContext2D, noTransform: boolean);
    setElement(element)
    setSourceCanvas(ICanvas)
    toObject(propertiesToInclude): any;
    tostring(): string;
    toSVG(): string;

    //additional methods

    _originalElement: HTMLImageElement | HTMLCanvasElement;
    _element: HTMLImageElement | HTMLCanvasElement;
    setSrc(string) : void;
    uploaderOptions: IUploaderOptions
  }

  export interface IMaterialPoint extends IObject {
  }

  export interface IWarp extends IImage {
  }

  export interface ICircle extends IObject {
    // methods
    complexity(): number;
    getRadiusX(): number;
    getRadiusY(): number;
    initialize(options: ICircleOptions): ICircle;
    setRadius(value: number): number;
    toObject(propertiesToInclude): any;
    toSVG(): string;
  }

  export interface IPath extends IObject {
    initialize(options: any);
    initialize(path, options);

    complexity(): number;
    render(ctx: CanvasRenderingContext2D, noTransform: boolean);
    toDatalessObject(propertiesToInclude): any;
    toObject(propertiesToInclude): any;
    tostring(): string;
    toSVG(): string;
  }

  export interface IPolygon extends IObject {
    initialize(options: any);
    initialize(points, options);
    complexity(): number;
    toObject(propertiesToInclude): any;
    toSVG(): string;
  }

  export interface IPolyline extends IObject {
    initialize(options: any);
    initialize(points, options);
    complexity(): number;
    toObject(propertiesToInclude): any;
    toSVG(): string;
  }

  export interface IPathGroup extends IObject {
    initialize(options: any);
    initialize(paths, options);
    complexity(): number;
    isSameColor(): boolean;
    render(ctx: CanvasRenderingContext2D);
    toDatalessObject(propertiesToInclude): any;
    toObject(propertiesToInclude): any;
    tostring(): string;
    toSVG(): string;
  }

  export type IAnyObject = IObject | IGroup | ILine | IImage | IMaterialPoint | IWarp | ICircle | IPath | IPolygon | IPolyline | IPathGroup | IRect | IText | ITriangle | IEllipse

  export interface IIntersection {
    appendPoint(status: string);
    appendPoints(status: string);
    init(status: string);
  }

  export interface IGradient {
    initialize(options): any;
    toObject(): any;
    toLiveGradient(ctx: CanvasRenderingContext2D): any;
  }

  export interface IColor {
    getSource(): any[];
    setSource(source: any[]): any;
    toRgb(): string;
    toRgba(): string;
    toHex(): string;
    getAlpha(): number;
    setAlpha(alpha: number): IColor;
    toGrayscale(): IColor;
    toBlackWhite(threshold): IColor;
    overlayWith(otherColor: string): IColor;
    overlayWith(otherColor: IColor): IColor;
  }

  export interface IStaticCanvas extends IObservable, IStaticCanvasOptions {
    // backgroundColor: string;
    // backgroundImage: string;
    // backgroundImageOpacity: number;
    // backgroundImageStretch: number;
    // controlsAboveOverlay: boolean;
    // includeDefaultValues: boolean;
    // overlayImage: string;
    // overlayImageLeft: number;
    // overlayImageTop: number;
    // renderOnAddition: boolean;
    // stateful: boolean;
    wrapperEl: HTMLElement;
    _objects: IObject[];

    // static
    EMPTY_JSON: string;
    clipTo(clipFunction: (context: CanvasRenderingContext2D) => void );
    supports(methodName: string): boolean;

    // methods
    add(...object: IObject[]): ICanvas;
    bringForward(object: IObject): ICanvas;
    calcOffset(): ICanvas;
    centerObject(object: IObject): ICanvas;
    centerObjectH(object: IObject): ICanvas;
    centerObjectV(object: IObject): ICanvas;
    clear(): ICanvas;
    clearContext(context: CanvasRenderingContext2D): ICanvas;
    complexity(): number;
    dispose(): ICanvas;
    drawControls();
    forEachObject(callback: (object: IObject) => void , context?: CanvasRenderingContext2D): ICanvas;
    getActiveGroup(): IGroup;
    getActiveObject(): IObject;
    getCenter(): IObject;
    getContext(): CanvasRenderingContext2D;
    getElement(): HTMLCanvasElement;
    getHeight(): number;
    getWidth(): number;
    insertAt(object: IObject, index: number, nonSplicing: boolean): ICanvas;
    isEmpty(): boolean;
    item(index: number): IObject;
    onBeforeScaleRotate(target: IObject);
    remove(object: IObject): IObject;
    renderAll(allOnTop?: boolean): ICanvas;
    renderTop(): ICanvas;

    sendBackwards(object: IObject): ICanvas;
    sendToBack(object: IObject): ICanvas;
    setBackgroundImage(object: IObject): ICanvas;
    setDimensions(object: { width: number; height: number; }): ICanvas;
    setHeight(height: number): ICanvas;
    setOverlayImage(url: string, callback: () => any, options): ICanvas;
    setWidth(width: number): ICanvas;
    toDatalessJSON(propertiesToInclude?: any[]): string;
    toDatalessObject(propertiesToInclude?: any[]): string;
    toDataURL(format: string, quality?: number): string;
    toDataURLWithMultiplier(propertiesToInclude: any[]): string;
    toGrayscale(propertiesToInclude: any[]): string;
    toJSON(propertiesToInclude: any[]): string;
    toObject(propertiesToInclude: any[]): string;
    tostring(): string;
    toSVG(): string;
    clearObjects(): void;
    load(data: ICanvasOptions): void;

    editor: IEditor;
    find (object: IAnyObjectOptions) : IObject[]
    getOriginalWidth(): number;
    getOriginalHeight(): number;
    getOriginalSize(): { width: number; height: number; };
    resizeObserver: any;
  //  resizeObserver: ResizeObserver;
  }

  export interface ICanvas extends IStaticCanvas, ICanvasOptions {
    (element: HTMLCanvasElement): ICanvas;
    (element: string): ICanvas;

    lowerCanvasEl: HTMLCanvasElement;
    // containerClass: string;
    // defaultCursor: string;
    // freeDrawingColor: string;
    // freeDrawingLineWidth: number;
    // hoverCursor: string;
    // interactive: boolean;
    // moveCursor: string;
    // perPixelTargetFind: boolean;
    // rotationCursor: string;
    // selection: boolean;
    // selectionBorderColor: string;
    // selectionColor: string;
    // selectionDashArray: number[];
    // selectionLineWidth: number;
    // targetFindTolerance: number;

    // methods
    containsPoint(e: Event, target: IObject): boolean;
    deactivateAll(): ICanvas;
    deactivateAllWithDispatch(): ICanvas;
    discardActiveGroup(): ICanvas;
    discardActiveObject(): ICanvas;
    drawDashedLine(ctx: CanvasRenderingContext2D, x: number, y: number, x2: number, y2: number, dashArray: number[]): ICanvas;
    findTarget(e: MouseEvent, skipGroup: boolean): ICanvas;
    getPointer(e): { x: number; y: number; };
    getSelectionContext(): CanvasRenderingContext2D;
    getSelectionElement(): HTMLCanvasElement;
    setActiveGroup(group: IGroup): ICanvas;
    setActiveObject(object: IObject, e?): ICanvas;

    loadFromSvg(text: string,callback?: () => void): Promise<any>;
    loadFromJSON(json, callback: () => void): void;
    loadFromDatalessJSON(json, callback: () => void): void;

    requestRenderAll();

    //additional methods
    getZoom(): number;
    getObjectByID(id: string) : IObject;
    //get Canvas with rendered canvas
    getThumbnail(options?: {
        width?: number,
        height?: number,
        cutEdges?: boolean,
        zoom?: number,
        contentMode?: string,
        area?: { left?: number, top?: number, width?: number, height?: number}
      }, output?: HTMLCanvasElement) :  HTMLCanvasElement;

    addInActiveArea: any
    _onResize(): void
    centerAndZoomOut(): void
    createObject(IAnyObjectOptions): fabric.IObject;

    setOriginalSize(size: any)
    //ponomarevtlt
    getState(): ICanvasOptions;
    set(options: ICanvasOptions): void
    set(option: string, value: any): void
    getPhotoPlaceholder: (size: {width: number, height: number}) => {width: number, height: number};
    originalHeight: number;
    originalWidth: number;

    //todo remove this. replace withEditor.dpi
    dotsPerUnit: number;
    loaded: boolean;
    processing: boolean;

    drawingModeEnabled: boolean;
    setInteractiveMode(boolean);
    updateCanvasSize();
    setViewportTransform(viewportTransform: [number,number,number,number,number,number]);
    setFreeDrawingBrush(string);
    setOuterCanvasContainer(HTMLElement);

    dpiWarning: boolean;
    effectiveDpi: number;
  }

  export interface IBrightnessFilter {}
  export interface IInvertFilter {}
  export interface IRemoveWhiteFilter {}
  export interface IGrayscaleFilter {}
  export interface IBlurFilter {}
  export interface ISepiaFilter {}
  export interface ISepia2Filter {}
  export interface INoiseFilter {}
  export interface IGradientTransparencyFilter {}
  export interface IPixelateFilter {}
  export interface IConvoluteFilter {}

  export interface IStaticCanvasOptions {
    backgroundColor?: string;
    backgroundImage?: string;
    backgroundImageOpacity?: number;
    backgroundImageStretch?: number;
    controlsAboveOverlay?: boolean;
    includeDefaultValues?: boolean;
    overlayImage?: string;
    overlayImageLeft?: number;
    overlayImageTop?: number;
    renderOnAddition?: boolean;
    stateful?: boolean;
    objects?: IAnyObjectOptions[];


    id?: string;
    areas?: IAreaOptions[];
    //behavior on mouse actions. could be mixed, hand, draw
    interactiveMode?: string;
    //zoom.js
    freeHandModeEnabled?: boolean;
    handModeEnabled?: boolean;
    zoomCtrlKey?: boolean;
    mouseWheelZoom?: boolean;
    changeDimensionOnZoom?: boolean;
    autoCenterAndZoomOut?: boolean;
    //stretchable.js


    clipPath?: any;//todo IShapeOptions
    // clipPath?: IAnyObjectOptions | IObject;
    //snapping
    snapping?: boolean,
    backdropColor?: string,
    drawSnapping?: boolean,
    snappingToArea?: boolean,
    snappingToObjects?: boolean,
    snappingToGrid?: boolean,

    maxZoom?: number;
    background?: string;
    stretchable?: boolean;
    stretchingOptions?: {
      action?: "zoom" | "resize"
      maxWidth?: number;
      maxHeight?: number;
      maxWidthRate?: number;
      maxHeightRate?: number;
      margin?: number;
      marginX?: number;
      marginY?: number;
    },
    eventListeners?: {[key: string]: Function | string}
  }

  enum ICanvasType{
    Canvas = "canvas",
    WebGL = "webgl",
    SVG = "svg"
  }

  export interface ICanvasOptions extends IStaticCanvasOptions {
    canvasType?: string;
    containerClass?: string;
    defaultCursor?: string;
    freeDrawingColor?: string;
    freeDrawingLineWidth?: number;
    hoverCursor?: string;
    interactive?: boolean;
    imageSmoothingEnabled?: boolean;
    moveCursor?: string;
    perPixelTargetFind?: boolean;
    rotationCursor?: string;
    selection?: boolean;
    selectionBorderColor?: string;
    selectionColor?: string;
    selectionDashArray?: number[];
    selectionLineWidth?: number;
    targetFindTolerance?: number;
    useBufferRendering?: boolean;

    preserveObjectStacking?: boolean;
    preserveObjectStackingSelection?: boolean;

    title?: string;
    minZoom?: number;
    originalWidth?: number;
    originalHeight?: number;
    width?: number;
    height?: number;
    thumbnail?: HTMLCanvasElement;

    outerCanvasOpacity?: number;
  }

  export interface IAreaOptions {
    width?: number;
    height?: number;
  }

  export interface IRectOptions extends IObjectOptions {
    x?: number;
    y?: number;
    rx?: number;
    ry?: number;
  }

  export interface ITriangleOptions extends IObjectOptions {
  }

  export type ITemplate = IEditorOptions;

  type Index = 'a' | 'b' | 'c'
  type FromIndex = { [k in Index]?: number }


  export interface IPrototypes {
    [key: string]: IAnyObjectOptions
  }





  let Canvas2dFilterBackend: {
    new (): any
  }
  /*********************************************************************************************************************
   *********************************************************************************************************************
   * Fabric classes
   */
  let Rect: {
    fromElement(element: SVGElement, options: IRectOptions): IRect;
    fromObject(object): IRect;
    new (options?: IRectOptions): IRect;
    prototype: any;
  };

  let Triangle: {
    new (options?: ITriangleOptions): ITriangle;
  };

  let ActiveSelection: {
  };

  let Canvas: {
    new (element: HTMLCanvasElement, options?: ICanvasOptions): ICanvas;
    new (element: string, options?: ICanvasOptions): ICanvas;

    EMPTY_JSON: string;
    supports(methodName: string): boolean;
    prototype: any;
  };

  let StaticCanvas: {
    new (element: HTMLCanvasElement, options?: ICanvasOptions): ICanvas;
    new (element: string, options?: ICanvasOptions): ICanvas;

    EMPTY_JSON: string;
    supports(methodName: string): boolean;
    prototype: any;
  };

  let Circle: {
    ATTRIBUTE_NAMES: string[];
    fromElement(element: SVGElement, options: ICircleOptions): ICircle;
    fromObject(object): ICircle;
    new (options?: ICircleOptions): ICircle;
    prototype: any;
  };

  let Group: {
    new (items?: any[], options?: IObjectOptions): IGroup;
  };

  let Line: {
    ATTRIBUTE_NAMES: string[];
    fromElement(element: SVGElement, options): ILine;
    fromObject(object): ILine;
    prototype: any;
    new (points: number[], objObjects?: IObjectOptions): ILine;
  };

  let Intersection: {
    intersectLineLine(a1, a2, b1, b2);
    intersectLinePolygon(a1, a2, points);
    intersectPolygonPolygon(points1, points2);
    intersectPolygonRectangle(points, r1, r2);
  };

  let Path :{
    fromElement(element: SVGElement, options?: IPathOptions): IPath;
    fromObject(object): IPath;
    new (object): IPath;
  };

  let PathGroup: {
    fromObject(object: IPathOptions): IPathGroup;
    new (object: IPathOptions): IPathGroup;
    prototype: any;
  };

  let Point: {
    new (x, y): IPoint;
    prototype: any;
  };

  let Object: {
    prototype: any;
  };

  let Polygon: {
    fromObject(object): IPolygon;
    fromElement(element: SVGElement, options): IPolygon;
    new (): IPolygon;
    prototype: any;
  };

  let Polyline: {
    fromObject(object): IPolyline;
    fromElement(element: SVGElement, options): IPolyline;
    new (): IPolyline;
    prototype: any;
  };

  let Text: {
    new (text: string, options?: ITextOptions): IText;
  };

  let Image: {
    fromURL(url: string): IImage;
    fromURL(url: string, callback: (image: IImage) => any): IImage;
    fromURL(url: string, callback: (image: IImage) => any, objObjects: IImageOptions): IImage;
    new (element: HTMLImageElement, objObjects: IObjectOptions): IImage;
    new (objObjects: IImageOptions): IImage;
    prototype: any;

    filters:
      {
        Blur: {
          new (options?: { blur: number; }): IBlurFilter;
        };
        Grayscale: {
          new (): IGrayscaleFilter;
        };
        Brightness: {
          new (options?: { brightness: number; }): IBrightnessFilter;
        };
        RemoveWhite: {
          new (options?: {
            threshold?: string;
            distance?: string;
          }): IRemoveWhiteFilter;
        };
        Invert: {
          new (): IInvertFilter;
        };
        Sepia: {
          new (): ISepiaFilter;
        };
        Sepia2: {
          new (): ISepia2Filter;
        };
        Noise: {
          new (options?: {
            noise?: number;
          }): INoiseFilter;
        };
        GradientTransparency: {
          new (options?: {
            threshold?: number;
          }): IGradientTransparencyFilter;
        };
        Pixelate: {
          new (options?: {
            color?: any;
          }): IPixelateFilter;
        };
        Convolute: {
          new (options?: {
            matrix: any;
          }): IConvoluteFilter;
        };
      };
  };

  //ponomarevtlt
  let Editor : {
    new (options?: IEditorOptions): IEditor;
    prototype: any;
  };

  /*
   * end Fabric classes
   *********************************************************************************************************************
   ********************************************************************************************************************/

  /**
   * end Fabric properties and methods
   */

  function saveAs (blob: Blob, title: string);

  //ponomarevtlt
  let DPI: number;
  let mediaRoot: string;
  let perfLimitSizeTotal: number;
  let maxCacheSideLimit: number;

  let util: {
    addClass(element: HTMLElement, className: string);
    addListener(element, eventName: string, handler);
    animate(options: {
      onChange?: (value: number) => void;
      onComplete?: () => void;
      startValue?: number;
      endValue?: number;
      byValue?: number;
      easing?: (currentTime, startValue, byValue, duration) => number;
      duration?: number;
    });
    createClass(parent, properties);
    degreesToRadians(degrees: number): number;
    falseFunction(): () => boolean;
    getById(id: HTMLElement): HTMLElement;
    getById(id: string): HTMLElement;
    getElementOffset(element): { left: number; top: number; };
    getPointer(event: Event);
    getRandomInt(min: number, max: number);
    getScript(url: string, callback);
    groupSVGElements(elements: any[], options, path?: string);
    loadImage(url, callback? : (HTMLImageElement) => any, context?: any, crossOrigin?: boolean) : Promise<HTMLImageElement>
    makeElement(tagName: string, attributes);
    makeElementSelectable(element: HTMLElement);
    makeElementUnselectable(element: HTMLElement);
    populateWithProperties(source, destination, properties): any[];
    radiansToDegrees(radians: number): number;
    removeFromArray(array: any[], value);
    removeListener(element: HTMLElement, eventName, handler);
    request(url, options);
    requestAnimFrame(callback, element);
    setStyle(element: HTMLElement, styles);
    toArray(arrayLike): any[];
    toFixed(number, fractionDigits);
    wrapElement(element: HTMLElement, wrapper, attributes);
    parseUnit(value: string, fontSize?:number) : number;
    //ponomarevtlt extensions
    extendPrototypes(prototypes: IPrototypes, namespace?: IPrototypes);
    createCanvasElement(a?: any,b?: any) : HTMLCanvasElement;
    readImage(file: Blob, callback?: Function) : Promise<HTMLCanvasElement | HTMLImageElement>;
    uploadDialog(options: any);
    getProportions(item: {width:number,height: number}, container: {width:number,height: number}, mode?: string) : {width:number,height: number,scale: number};
    png: {
      readMetadata(buffer: ArrayBuffer): {'tEXt'?: {[key: string]: string}, 'pHYs'?: {x: number, y: number, units: PNG_RESOLUTION_UNITS}, [key: string]: any};
      writeMetadata(buffer: ArrayBuffer, chunks: {clear?: boolean, 'tEXt'?:  {[key: string]: string}, 'pHYs'?: {x: number, y: number, units: PNG_RESOLUTION_UNITS}}): ArrayBuffer;
      writeMetadataB(blob: Blob, chunks: {clear?: boolean, 'tEXt'?:  {[key: string]: string}, 'pHYs'?: {x: number, y: number, units: PNG_RESOLUTION_UNITS}}): Blob;
    };
    qrDecompose: any;
    canvasToBlobPromise(canvas: HTMLCanvasElement) : Promise<Blob>;
    canvasToBlob(
        canvas: HTMLCanvasElement,
        format?: string,
        options?: { quality?: number, dpi?: number , meta?: {[key: string]: string}, }) : Promise<Blob>;

    shapes: {
      circle(options: {
        radius: number,
        offsetX?: number,
        offsetY?: number,
      }): PathInstructionDeclaration[],
      star(options: {
        cornerRadius?: number,
        innerRadius?: number,
        outerRadius: number,
        rays: number,
        startAngle?: number,
        offsetX?: number,
        offsetY?: number,
      }): PathInstructionDeclaration[]
    }
  };

  export enum PNG_RESOLUTION_UNITS {
    UNDEFINED = 0,
    METERS = 1,
    INCHES = 2
  }

  export interface IFabricModule {
    name: string;
    prototypes: IPrototypes
  }

  export interface IFabricOptions {
    DPI?: number;
    mediaRoot?: string;
    fontsRoot?: string;
    nopic?: string;
    addNoCache?: boolean;
    plugins?: IFabricModule[];
    perfLimitSizeTotal?: number;
    maxCacheSideLimit?: number;
  }

  export interface IEditorOptions {
    dpi?: number;
    minDpi?: number;
    id?: string;
    fonts?: string[];
    uiFonts?: string[];

    plugins?: IFabricModule[];
    frames?: any;

    prototypes?: IPrototypes;
    history?: boolean;
    slide?: ICanvasOptions;
    slides?: ICanvasOptions[];

    //templates
    template?: string;
    activeSlide?: number;
    templates?: ITemplate[];
    //create editor, target and canvas global variables
    debug?: boolean;
    //main container to display slides
    storeProperties?: string[]
    canvasContainer?:string;
    title?: string;
    lang?: any;
    onReady?(editor?: IEditor):void;
    onLoad?(editor?: IEditor):void;
    eventListeners?: {[key: string]: Function | string}
    onResize?( width: number ,height: number):void;
  }

  type IEditorOptionsToVoid = (options: fabric.IEditorOptions) => void;

  export type ObjectCallbackFunction = (object: fabric.IObject) => void;

  export interface IEditor extends IObservable{
    load: IEditorOptionsToVoid;
    canvas: fabric.ICanvas;

    getState(): IEditorOptions;
    target: fabric.IAnyObject;
    ready: boolean;
    lang: any;
    exportPngClient: any;
    promise: Promise<fabric.IEditor>;

    loaded: boolean;
    fonts: string[];
    slides: ICanvas[];
    addSlide: (slideData: ICanvasOptions)  => void;
    activeSlide: number;
    setActiveSlide: (index: number) => void;
    templates?: ITemplate[];
    history: any;
    getZoom(): number;
    prototypes: IPrototypes;
    set(IEditorOptions): void
    createObject(options: IAnyObjectOptions, callback? : ObjectCallbackFunction): fabric.IObject;

    export(options: {
      format?: string,
      output?: string,
      background?: string,
      quality?: number,
      dpi?: number ,
      meta?: {[key: string]: string},
      width?: number,
      height?: number,
      zoom?: number,
      area?: any,
      contentMode?: string,
      cutEdges?: boolean
    }) : Promise<Blob>;

    removeProgress(item: Object)
    addProgress(item: Object)
    progress: Object[];
    dpiWarning: boolean;
    effectiveDpi: number;

    createCanvas(ICanvasOptions): fabric.ICanvas;
  }

/*
  type FabricSetFunction = (this: any,value: any, ...options: any) => void;
  type FabricGetFunction = (this: any, ...options: any) => any;
  export interface IFabricToolOptions {
    template?: any;
    container?: HTMLElement;
    className?: string | Function;
    popupWidth?: number;
    popupClass?: string;
    itemClassName?: string;
    subMenuClassName?: string;
    enabled?: string | boolean | Function;
    visible?: string | Function;
    id?: string;
    width?: number
    observe?: string;
    variable?: string;
    type?: string;
    menu?: IFabricToolDeclaration[];
    popup?: boolean;
    toggled?: boolean;
    closeOnBlur?: boolean;
    target?: string | Function;
    title?: string;
    showControls?: boolean;
    showLabel?: boolean;
    showButtonText?: boolean;
    buttonClassName?: string;
    menuClassName?: string;
    reference?: string;
    showMenuIndicator?: boolean;
    showButton?: boolean;
    buttonContent?: string;
    buttonImageSrc?: string;
    option?: string;
    options?: Function | any[];
    action?: string | Function;
    set?: string | FabricSetFunction;
    get?: string | FabricGetFunction;
    min?: number | Function;
    max?: number | Function;
    step?: number | Function;
    key?: string;
    // for select plugin
    dropdown?: any;
    static?: boolean;
    // for colorpicker plugin
    select?:  {
      imageWidth: 100
    },
    colorpicker?:  {
      swatches?:     string[],
      opacity?:      boolean,
      text?:         boolean
    }
  }
  export type IFabricToolDeclaration  = IFabricToolOptions | string;
  export type IFabricDynamicToolsList  = {[key: string]: IFabricToolDeclaration[]};
  export type IFabricStaticToolsList  = IFabricToolDeclaration[];
  export type IToolbarActionFunction = (object) => void;
  export type IToolbarGetFunction = (object) => any
  export type IToolbarSetFunction = (object,any) => void

  export interface IToolbarOptions  {
    buttons?: {
      selectClassName?: string;
      buttonClassName?: string;
    }
  }

  export interface IToolbar  {
  }

  let Toolbar : {
    new (options?: IToolbarOptions): IToolbar;
    prototype: any;
  };
*/

}

