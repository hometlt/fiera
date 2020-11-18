## refactoring

remove png-js . use pngjs instead in pdfkit.

!IMPORTANT
---
when make "The best **TEN years of myd life**" pdf become broken
 
TextAlign Center on PDF
---
 
text aligned to center looks different on PDF. text slightly moved to the right.
test: simplysay-inlay.json
 
 

SimHei ignored on demo-fonts
---

installable fonts IE11
---

Такая вот ошибка в IE 11 (internet explorer 11) появляется при попытке загрузить шрифт с сервера:
проблема связана с тем, что используйемый .eot файл должен иметь атрибут "устанавливаемый":
installable
CSS3114: @font-face не удалось пройти проверку на разрешение внедрения шрифтов OpenType. Необходимо разрешение "Устанавливаемый".

solution
For Cross-browser compatibility use all the font formats not just ttf.

@font-face {
    font-family: 'Some Font';
    src: url('fonts/some-font.eot');
    src: url('fonts/some-font.eot?#iefix') format('eot'),
         url('fonts/some-font.woff') format('woff'),
         url('fonts/some-font.ttf') format('truetype'),
         url('fonts/some-font.svg') format('svg');
    font-weight: normal;
    font-style: normal;
}





INFO Difference in ctx.measureText
---
Problem: Different text split text lines results possible.
Words Length Measurments Comaprison:

wordWidth = this._measureWord(word, lineIndex, offset);
console.log(word,wordWidth);

NodejS:
[ 'T', 'h', 'e' ] 58.125
[ 'b', 'e', 's', 't' ] 63.824999999999996
[ 'T', 'E', 'N' ] 67.35
[ 'y', 'e', 'a', 'r', 's' ] 82.87499999999999
[ 'o', 'f' ] 30.825000000000003
[ 'm', 'y' ] 47.325
[ 'l', 'i', 'f', 'e' ] 49.875

Chrome:
["T", "h", "e"] 58.06640625
["b", "e", "s", "t"] 63.8232421875
["T", "E", "N"] 67.3388671875
["y", "e", "a", "r", "s"] 82.8662109375
["o", "f"] 30.8642578125
["m", "y"] 47.3291015625
["l", "i", "f", "e"] 49.8779296875


Edge
["T", "h", "e"] 58.066500091552726
["b", "e", "s", "t"] 63.82274894714355
["T", "E", "N"]  67.33874816894531
["y", "e", "a", "r", "s"] 82.86599693298339
["o", "f"] 30.864749908447265
["m", "y"]  47.328749084472655
["l", "i", "f", "e"]  49.87874794006348

IE 11
["T","h","e"] 58.125
["b","e","s","t"] 63.824999999999996
["T","E","N"] 67.35
["y","e","a","r","s"] 82.87499999999998
["o","f"] 30.9
["m","y"] 47.325
["l","i","f","e"] 49.95


this case is still open on FabricJS GitHub since 2013
https://github.com/Automattic/node-canvas/issues/331






