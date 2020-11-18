import loadImage from "./loadimage/index.js";
import X2JS from "./xml2json.js";
import {readMetadata} from "./png-metadata.js";
import {bufferToArrayBuffer} from "../blob-buffers-utils.js";

export function readAdobeXmp(json,metadata){


    let restructured = {};
    for(let attributeName in json.RDF.Description) {
        let attribute = json.RDF.Description[attributeName];

        //check all description content fields
        if (attribute.constructor === Object) {
            if (attribute.__prefix === "dc") {
                let list = null;
                let text = null;
                for (let container in attribute) {
                    if (container === "Seq" || container === "Bag" || container === "Alt") {
                        if (attribute[container].li.length) {
                            if (!list) {
                                list = []
                            }
                            list.push(...attribute[container].li.map(li => li.__text))
                        } else {
                            if (list) {
                                list.push(attribute[container].li.__text)
                            } else if (text) {
                                list = [text, attribute[container].li.__text]
                            } else {
                                text = attribute[container].li.__text;
                            }
                        }
                    }
                }

                restructured[attributeName] = list || text;
            }
        } else {
            restructured[attributeName] = attribute;
        }
    }

    for(let attributeName in restructured) {
        let attribute = restructured[attributeName]
        switch(attributeName){
            case "title":
                metadata['title'] = attribute
                break;
            case "subject":
                metadata['keywords'] = attribute
                break;
            case "_photoshop:AuthorsPosition":
                metadata["authorsPosition"] = attribute
                break;
            case "_photoshop:CaptionWriter":
                metadata["captionWriter"] = attribute
                break;
            case "_xmpRights:WebStatement":
                metadata["webStatement"] = attribute
                break;
        }
    }
}

export function collectPngMetaData(buffer){
    let pngMetadata = readMetadata(new Uint8Array(buffer));
    let metadata = {};
    if(pngMetadata.iTXt){
        for(let item of pngMetadata.iTXt){
            if(item.keyword ===  "XML:com.adobe.xmp"){
                let xmlData = X2JS.toJson(item.text, {object: true})
                readAdobeXmp(xmlData,metadata)
            }
            else{
                metadata[item.keyword] = attribute;
            }
        }
    }
    if(pngMetadata.tEXt) {
        for (let item of pngMetadata.tEXt) {
            metadata[item.keyword] = item.text;
        }
    }
    if(pngMetadata.zTXt) {
        for (let item of pngMetadata.zTXt) {
            metadata[item.keyword] = item.text;
        }
    }
    return metadata
}

export function collectJpgMetaDataF(file){
    return new Promise((resolve, reject) => {
        loadImage.parseMetaData(file, function(data) {
            let metadata = {};
            let result = {};
            if(data.iptc){
                let iptc = data.iptc.getAll()

                if(iptc.Keywords){
                    metadata["keywords"] = iptc.Keywords.split(",")
                }
                if(iptc.ObjectName){
                    metadata["title"] = iptc.ObjectName
                }

            }
            if(data.exif){
                // result["exif"] = data.exif.getAll();
                metadata["orientation"] = data.exif.get("Orientation");
            }

            resolve(metadata)
        }, { meta: true });
    });
}
export function collectJpgMetaData(buffer){
    let data = loadImage.parseMetaDataFromArrayBuffer(buffer)

    let metadata = {};
    if(data.iptc){
        let iptc = data.iptc.getAll()

        if(iptc.Keywords){
            metadata["keywords"] = iptc.Keywords.split(",")
        }
        if(iptc.ObjectName){
            metadata["title"] = iptc.ObjectName
        }

    }
    if(data.exif){
        // result["exif"] = data.exif.getAll();
        metadata["orientation"] = data.exif.get("Orientation");
    }

    return metadata
}