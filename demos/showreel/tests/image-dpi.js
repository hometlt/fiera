import {TestApp} from '../showreel.js'
import {Relative, ImageDpi, ClipPath, ImageCrop} from '../../../src/modules.js'
fabric.installPlugins([Relative,ImageDpi, ClipPath, ImageCrop])

new TestApp({
	prototypes: {
		Object: {
			minDpi: 200,
		},
		Image: {
			eventListeners: {
				mousedblclick: "cropPhotoStart"
			}
		}
	},
	dpi: 100,
	slide: {
		objects: [
			{
				type: "group",
				top: 100,
				left: 100,
				width: 200,
				height: 200,
				scaleX: 1,
				scaleY: 1,
				objects: [
					{
						type: "image",
						src: "test/dpi/10x10in_36dpi_360x360.png",
						top: 0,
						left: 0,
						width: 200,
						height: 200,
						scaleX: 1,
						scaleY: 1
					}
				]
			},
			{
				type: "image",
				src: "test/dpi/10x10in_36dpi_360x360.png",
				top: 400,
				left: 100,
				width: 200,
				height: 200
			},
			{
				type: "image",
				src: "test/dpi/10x10in_72dpi_720x720px.png",
				top: 400,
				left: 400,
				width: 200,
				height: 200
			},
			{
				type: "image",
				src: "test/dpi/10x10in_300dpi_3000x3000px.png",
				top: 400,
				left: 700,
				width: 200,
				height: 200
			},
			{
				type: "image",
				src: "test/dpi/20x20in_36dpi_720x720px.png",
				top: 700,
				left: 100,
				width: 200,
				height: 200
			}
		]
	}
})
