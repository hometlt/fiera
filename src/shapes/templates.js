export const FmTemplates = {
	name: "templates",
	prototypes: {
		PhotoImage: {
			prototype: "image",
			eventListeners: {
				"mousedblclick": "cropPhotoStart"
			}
		},
		Template: {
			type: "template",
			subTargetCheck: true,
			prototype: "group"
		},
		TemplatePath: {
			prototype: "path",
			evented: false,
			selectable: false
		},
		TemplateTextbox: {
			draggable: false,
			prototype: "Textbox",
			easyEdit: true,
			tabbable: true,
			lockMovementX: true,
			lockMovementY: true,
			lockScalingX: true,
			lockScalingY: true,
			lockRotation: true
		},
		TemplateIText: {
			draggable: false,
			prototype: "IText",
			hasControls: false,
			easyEdit: true,
			tabbable: true,
			lockMovementX: true,
			lockMovementY: true,
			lockScalingX: true,
			lockScalingY: true,
			lockRotation: true
		},
		TemplateImage: {
			prototype: "image",
			evented: false,
			selectable: false
		},
		TemplatePhotoImage: {
			prototype: "photo-image",
			hasControls: false,
			lockScalingX: true,
			lockScalingY: true,
			lockMovementX: true,
			lockMovementY: true,
			lockRotation: true
		}
	}
}
