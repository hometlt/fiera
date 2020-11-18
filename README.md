FabricJS with Extensions 
===============
 - history/objects arrange/grid/snap to edge/zooming/Document shapes/QRCode objects/images cropping/transparent color
 - toolbars/shapes gallery/Google fonts/Multiple cards 
 - CurvedText object (2 days) 
 - Text vertical alignment  (1 days)
 - wrapping text around image (2 days)


tutorial https://www.youtube.com/watch?v=fKoZaBiVOgY&list=PLbu98QxRH81LlbbwYHMqOFjHwY3D48tEC

GUI (React/Angular) 
===
 - React?

ServerSide Drawing Tools 
===
 - setting up FabricJS for NodeJS 
 - JSON -> SVG (for PDF documents)
 - JSON -> PNG (for thumbnails)
 - SVG -> JSON (for documents uploading) 
 - CMYK colors support.
 
Documents Writer 
===
 - using ServerSide Drawing Tools to generate SVG from JSON data.
 - using PDFKit/PDFLib to create PDF documents from SVG images.
 
Documents Converter
===  
 - setting up ImageMagick for resizing images
 - setting up ImageMagick for PDF/PSD -> SVG conversion
 - setting up uniconverter for AI -> SVG conversion
 - (setting up inkScape for PDF -> SVG conversion)
 
Images server (Amazon S3) ** 1 day**
===
 - setting up AWS Lambda Serverless Image Handler for resizing images
 
Server API
===
 - saving/loading designs
 - retreive PDF document
 - generate thumbnails
 - uploading PDF/PSD/AI and other graphics documents. 
 
- FabricJS with Extensions - 2 weeks
- GUI (React) - 1-3 weeks
- ServerSide Drawing Tools (JSON -> SVG, SVG -> JSON, JSON -> PNG) - 1-2 weeks
- Documents Writer (JSON -> PDF)   - 3 days
- Documents Converter (PDF/PSD/AI -> SVG)  - 3 days
- Images server (AWS S3/AWS Lambda)
- Server API


I have built a list of features: This that we are interested in including are
1 .Text objects.
  a. Add text box.
  b. Interactively edit text box in editor. Select and change indivudal text font/size/color. (https://www.screencast.com/t/7pPGkiF9LS)
     1. Text alignment per text row: Left, Center, Right
     2. Text alingment of text box: Top, Middle, Bottom
     3. Text line spacing (possible?)
     4. Text letter spacing (possible?)
  c. Edit text using a basic form tool like "easy text fill"
  d. Transperncy setting
  e. Curved Text option (https://www.screencast.com/t/xquqPs98Z6)
  f. Linked text frames. Text flow over (https://www.screencast.com/t/bTJ99aDL2O)

2. Image objects
  a. Add image objects
     1. Upload supported formats: png, jpeg, bmp, psd (imagemagic conversion?), eps, tiff, pdf, ai, svg
  b. Image has crop box to allow media to be cropped based on crop box area https://www.screencast.com/t/Mvx7AUbt
  c. Image has stroke line option: line width and color
  d. Set crop box as custom svg shape (possible?) (https://www.screencast.com/t/iA9KC8Hqky3U)
  e. Text wrap around bounding box (https://www.screencast.com/t/xGk6tpku936)

3. Vector shape objects
  a. A list of predefined shapes
  b. Pen tool to draw custom shapes  (https://www.screencast.com/t/gLlDzqq5wL)

4. Qr barcode objects


5. Visual guides, aids and functionality
  a. Show outlines for text area, On/Off
     Display a box around the text area even when it is not selected.
  b. Show grid (https://www.screencast.com/t/Wby0LLdZ)
  c. Ability to select with pointer tool one or more objects as a selection
  d. Objects list (Layers) (https://www.screencast.com/t/dqFjJdjIt)
     1. Arrange object Z order
     2. Lock objects editibity and selectabilty
     3. Delete Object
  f. Custom document view shape (https://www.screencast.com/t/RlHWtxVu)
     1. Ability to define a out and inline shape offset by a speciifc distance to represent margin and trim area
  g. Flip document view option. Rotate view 90deg. https://www.screencast.com/t/Nu4dxGuRLzsV
  h. Full screen editor mode (https://www.screencast.com/t/kczzcicM)
  i. Spell checker option on text edit (https://www.screencast.com/t/1Rbau8PPT)
  j. Object options.
     1. Cut, Copy, Paste, Delete
     2. Arange object z index (Send Backward, Send Forward, Send to Back, Send to Front).
     3  Align object (Center vertically, Center horzontially, Center in view)
     4. Scale and scew of objects
       a. lock aspect ratio option
     5. Rotate objects
     6. Set width, height (locked aspect ratio applies)
     7. Set x, y cordinate based on object reference point top left, top center, top right etc (https://www.screencast.com/t/xkVGGzFno).
     8. Move by arrow key press
  k. Document zoom
     1. fit to srceen option
  l. Undo and redo operaitons

6. Elements
  a. Client side UI
  b. Server side rendering

# fiera

Фиера - конструктор презентаций и графических редакторов, позволяющий с помощью небольшого конфига ( самый большой проект имеет конфигурацию около 500 строк) сконфигурировать встрвиваемый графический редактор соответствующий нуждам заказчиков с любыми требованиями.  Начал работу над ним больше полугода назад и использовал уже в несколких проектах.

Так как требования разных заказчиков разные, то большиснство возможностей библиотеки используются как "плагины". Их можно подключить к проекту или нет, в зависимости оттребований.
Основные расширения, использованные в библиотеке:

  - История(undo, redo)
  - Панели инструментов
  - Работа со множеством слайдов
  - Дополнительные фигуры (Кривые безье, Фоторамки, 3D трансформации, ВидеоЭлементы итд)
  - Инстурменты редактирования изображений (Инстурменты выделения и рисования)
  - Дополнительные Фильтры Изображений, вебшрифты, DragDrop итд

Используется библиотека **FabricJS**, и множество плагинов

Библиотека работает как в браузере так и с **NodeJS**. для запуска неупаковонной версии скрипты, используется **fiera.node.js**

Клиентская версия скрипта собирается с поощью **webpack**.

Для разных проектов необходимо подключать разные модули и плагины, поэтому сборка использует файл конфигурации **fiera.json**

точка старта - файл **fiera.js**



Основные модули

|  Module  |Description  | 
|:--------:|:------------|
Base | Новые Set/Get функции
Project | Работа со множеством слайдов 
Application | Конфигуратор FabricJS приложения. 
Debug | Отладка основных классов программы через консоль
Demo | Конфигурация Демо-приложения
Events | dblclick ,dragenter, dragmove, dragleave events
Object | основные методы для всех объектов fabricJS
Observe | модифицированные методы fabric.Observable
Prototypes | инициализация свойств объектов по умолчанию и производных пользовательских классов
StaticCanvas | расширения для статичекого канваса 
Slide | расширения для интерактивного канваса 

Дополнительные модули

|  Module  |Description  | 
|:--------:|:------------|
Activate | различное отображение выделенных объектов 
Areas | Создание объектов внутри рамок
Bind | Связывание объектов. Задание координат относительно другого объекта
BorderImage | рисование красивых рамок у изображение. по аналогии с СSS3 Border Image
ClipTo | Задание области видимости для объекта
Controls | Дополнительные элементы управления 
CornerStyle | Способы отображения элементов отображения.
Cursors | Дополнительные курсоры и метод cursorLines
Deativation | метод deactivationDisabled делает объекты всегда активными. незавивимо от того выделен объект или нет
Droppable | Добавляет возможности drag/drop
Editor |
EventListeners |
Filters |
Fonts |
FrmoURL |
Grid |
Groups |
History |
ImageTools |
InteractiveMode |
Layers |
MovementLimits |
Pathfinder |
Render |
Resizable |
Ruler |
SaveAs |
Styles |
Thumb |
Toolbar | Панели инструментов
Upload |
Zoom |







- controls.js               extended object control frames appearance
- droppable.js              implementation of drag/drop from filesystem or toolbar panels
- fonts.js                  support of google fonts and some more.
- gallery.js                gallery with objects for dragndrop to canvas.
- grid.js                   grid on canvas.
- masking.js                masking
- movementLimits.js         limited movement of for objects
- outerCanvas.js            draw object control frames out of the canvas.
- ruler.js                  rulers 
- snap.js                   snapping to grid/other objects
- toolbars.js               toolbars for fabricJS objects
- undo.js                   undo/redo implementation
- zoom.js                   zooming canvas

- CamanFilter.js            image filters from caman.js library
- RemoveWhite.js            make transparent backround filter
- PDF.js                    export as PDF

- barcode.js                barcode
- bezierText.js             curved editable text
- bubble.js                 bubbles with addition control points
- image.photoshop-tools.js  editing images. some basic tools including fuzzy selection
- polyline.js               drawing polygons with curved and straight lines on canvas
- transformedImage.js       3D trnsformation for images
- video.js                  embedded video objects
- textbox.list.js           textbox list style


actions.js
activate.js
alignment.js  
canvas.background.js
canvas.collection.js
canvas.copyPaste.js
canvas.events.js
colorNameMap.js
cursors.js
deactivation.js
editor.debug.js
export.js
fabric.tabbable.js
facebook.js
files.handledrop.js
fonts.ranges.js
fonts.registry.js
fromURL.js
groups.js
groups.nestedObjects.js
image.crop.js
image.deco.js
image.filters.js
image.frame.js
image.shape.js
instagram.js
interactiveMode.js
library.js
loader.js
object.order.js
object.shape.js
overlay-objects.js
pathfinder.js
patterns.js
relative.js
resizable.js
ruler.js
save.js
shapes.js
shirt.js
slide.areas.js
slide.drawing-tools.js
slide.layers.js
slide.stretchable.js
slide.template.js
snap.js
staticBorderColor.js
styles.js
svg.js
text.rasterize.js
thumb.js
toolbars.js
undo.js
units.js
upload.js
util.border-image.js
wholeCoordinates.js
zoom.js












---
#### Модуль: Activate
  - inactiveOptions {options}
  - activeOptions {options}

#### Модуль: Controls
  - controls Возможность добавлять или изменять элементы управления объектом
    {
      controlName: {
        x: formattedText,
        y: formattedText ,
        action: actionText, 
        altAction: actionText,
        visible: formattedText,
        cursor : cursorText
      }
     
#### Модуль: CornerStyle
  - resizableEdge true|false 
  - cornerStyle arc|frame|circle|rect
  - cornerSize
  - cornerAreaSize 
     
#### Модуль: deactivation
  - deactivationDisabled 
  
#### Модуль: MovementLimits
  - movementLimits
  - wholeCoordinates
  


вот этих обязательно надо уделать 

http://fancyproductdesigner.com/woocommerce/

крутеы фичи

https://inkxe.com/live-demo/
https://demo.inksoft.com/demo/DesignStudio/Home#/layers
http://fiddlesticks.herokuapp.com/sketch/jdg6o7wol8

тоже неплохо
customink.com



Страница с демонастрацией работы программы доступна по ссылке http://fiera.hometlt.ru/

Примеры конфигурации программы в папке **"examples/"**

Примеры работы программы можно найти на сайтах(будет доступен открыто только на fotofiera.ru ,но там пока не готов)

  - http://stitchcounts.com/ Используется как конструктор дизайна для одежды и других товаров
  - http://fotofiera.ru   будет использоваться как редактора альбомов и принтов( в разработке)
  - http://microwork.io реализует функционал основных инструментов выделения. помогает сотрудникам работать с изображениями, без использования приложений , таких как Photoshop.
  - https://www.bejaboo.com/ Я участвовал в разработке в заверщающее стадии работы над редактором. За основу взят другой скрипт, но используются многие возможности из библиотеки Fiera.



http://resources.jointjs.com/demos/kitchensink

http://tshirtproject.wpengine.com/tshirtecommerce/

Joint.JS:
http://resources.jointjs.com/demos/kitchensink

To replace our current SVG editor with Joint.JS:
http://tshirtproject.wpengine.com/tshirtecommerce/



1.6.0
-----
 - усовершенствованы прототипы и eventListeners, setoptions, устарели specialproperties





Feature List / Requirement
- mobile/touch support 
- two ways to add Elements to the whitespace
  - Clicking on it (simply placed centered then)
  - Drag/Drop
-	Color picker (for text color, background color etc)
-	Add text
- Change Text size/Color/Font/bold,italics,underlined/alignment
- Delete/Rotate/Scale objects
-	Set Opacity
-	Edit Text on double click
-	Add Image
  -	Upload New Image
  - Select Image from Library
- Library with Categorys
- “bring to front”, “send to back”
-	Shapes Rectangle/Triangle/Circle
-	Set Background Color



Analyze
https://webpack.github.io/analyse/#module/199





plugin
http://codecanyon.net/item/online-product-customizer/9444532


Сайты коллег 
http://tshirtproject.wpengine.com/design/
bejaboo
http://www.promovirtuals.com/vs/WAO
technologo
http://www.technologo.com/tl/appletpages/v5?sku=lite&fwid=202419642&lang=en&fwro=true&fh=true
Sliced Web
http://www.polyvore.com/cgi/app
http://www.urbancouture.com.au/start-couture-board/

canva.com

Client: Black River Imaging (Tylor Hindery)
http://codepen.io/michaeljcalkins/pen/Imupw

Create site "like" Create Your Own T-Shirt with HTML5 Product Designer (John Bereka)
http://productsdesignercanvas.com/

http://www.productsdesigner.com/
http://html5.productsdesigner.biz/DesignYourOwn/\
http://inkxe.com/

svg draw editor (some good stuff here)
http://draw-svg.appspot.com/drawsvg.html

Seven Hats Design Studio (Tim Williams) Product Design Tool
https://projects.invisionapp.com/share/8G25LZ4CB#/screens/61861154


FabricJS & Javascript football training board
develope canvas html 5 image face crop and send to server

Редактор на кружки
http://95.168.192.184/dev2/test2.html
http://demo.web2print4u.com/small_latte_photo_mug

Denis Ponomarev: Clipping Object for FabricJS.

http://codepen.io/Ponomarev/pen/NNjwaq

Оптимизация simplify created shape
http://mourner.github.io/simplify-js/




We are building a styling and fashion application. 
We have a product catalogue which consists of clothes, shoes, bags, accessories etc.
 Now we need a Look Creation Application (LCA in short) where users can select images of 4 or more products from catalogue and create a look. 
The behaviour of the application will be inspired by the following apps:-
 1. http://www.polyvore.com/cgi/app 
 
 
 https://olioboard.com/flash/editor похож на polyvore
 
 
2. http://www.limeroad.com/ -> click on "Create Scrapebook" 


Панели на стену
http://www.canvas4life.com/

Portal for T-shirt, Canvas, banner, cap, pen etc printing
http://www.bestecanvas.nl/




еще один редактор футболок
http://www.funkytshack.com/create-your-own/
http://www.customink.com/lab

Чтото серьезное
http://market.tshirtecommerce.com/design-your-own/



https://atmospherejs.com/cfs/graphicsmagick

DEMO
====

node worker ./../data/demo-fonts.json export/y.png export/y*.svg export/y.pdf



products designers
https://demo.inksoft.com/demo/DesignStudio/Home/22744/0/0/1000539/1005822#/artLocations
Here’s another virtual sample tool
 http://misc.qti.com/SupplierVDSDemo/product2-details.html

virtual Samples . футболки редакторп
http://www.promoplace.com/promotionalproductsdenver/appareltshirts.htm
fancyproductdesigner.js 


https://www.designbold.com/design/trial/facebook-ad



install
====
``` 
npm install --global --production windows-build-tools
```


webpack --profile --json > webpack-stats.json

sudo apt-get update
sudo apt-get install nodejs npm git webpack webpack-cli
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev 
git clone git@bitbucket.org:ponomarevtlt/fiera-sources.git
cd fiera-sources
npm install
webpack -c -w

//интересная библиотека
// http://opentype.js.org/index.html

https://sketch.io/mobile/

https://preview.codecanyon.net/item/fancy-product-designer-woocommercewordpress/full_screen_preview/6318393?_ga=2.188650472.1770259674.1562765845-2135917168.1562765845&_gac=1.159671887.1562765845.CjwKCAjwmZbpBRAGEiwADrmVXvmjB-ONlhp-3BER2OsG2BP28zG3MjvM1zkZ9t7CmquTIUxbrd2wtBoCpcgQAvD_BwE

emoji text
https://coolsymbol.com/








inspiration
======


https://www.youtube.com/watch?v=OZauzTkBdmI 

https://animejs.com/

http://scrawl.rikweb.org.uk/

https://github.com/stackgl/headless-gl

https://github.com/photopea

SVG EDITOR 
---

SVG-EDIT repo

https://www.logogenie.net/logo-design?text=HomeTLT]

Create a Platform like Fotojet using Magento
---

We want to create a platform like Fotojet to create collage. The user would be able to add images, drag and drop them, add a background, add effects to images (brightness, sharpness, grayscale, sepia, add text, clipart), create a PDF and place an order. 

If the user pays, he would also be able to download a high resolution PDF otherwise a low resolution. The order would be received by the admin and he would also receive the high resolution PDF for printing and order execution.

We want to use a magento 2 store for this. There are various extensions available for collage drag and drop feature, though I do not think it's very difficult to build either. You can check

https://www.fmeextensions.com/magento-photo-painting-custom-size.html

You can also use several git solutions available like:

https://redgoose-dev.github.io/react-photo-layout-editor/

For adding effects to images we would integrate a photo editing script in the web platform:

https://codecanyon.net/item/pixie-image-editor/10721475

We would need the option of adjusting the brightness, color and saturation level as in Fotojet
