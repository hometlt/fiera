/*
 * JavaScript Load Image Meta
 * https://github.com/blueimp/JavaScript-Load-Image
 *
 * Copyright 2013, Sebastian Tschan
 * https://blueimp.net
 *
 * Image metadata handling implementation
 * based on the help and contribution of
 * Achim Stöhr.
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 */

/* global define, module, require, Promise, DataView, Uint8Array, ArrayBuffer */

import loadImage from './load-image.js'

  let global = loadImage.global
  let originalTransform = loadImage.transform

  let metaDataParsers = {
    jpeg: {
      0xffe1: [], // APP1 marker
      0xffed: [] // APP13 marker
    }
  }


  function parseMetaDataFromArrayBuffer(buffer, options = {},data = {}){
      // Note on endianness:
      // Since the marker and length bytes in JPEG files are always
      // stored in big endian order, we can leave the endian parameter
      // of the DataView methods undefined, defaulting to big endian.
      let dataView = new DataView(buffer)
      // Check for the JPEG marker (0xffd8):
      if (dataView.getUint16(0) !== 0xffd8) {
          return reject(
              new Error('Invalid JPEG file: Missing JPEG marker.')
          )
      }
      let offset = 2
      let maxOffset = dataView.byteLength - 4
      let headLength = offset
      let markerBytes
      let markerLength
      let parsers
      let i
      while (offset < maxOffset) {
          markerBytes = dataView.getUint16(offset)
          // Search for APPn (0xffeN) and COM (0xfffe) markers,
          // which contain application-specific metadata like
          // Exif, ICC and IPTC data and text comments:
          if (
              (markerBytes >= 0xffe0 && markerBytes <= 0xffef) ||
              markerBytes === 0xfffe
          ) {
              // The marker bytes (2) are always followed by
              // the length bytes (2), indicating the length of the
              // marker segment, which includes the length bytes,
              // but not the marker bytes, so we add 2:
              markerLength = dataView.getUint16(offset + 2) + 2
              if (offset + markerLength > dataView.byteLength) {
                  // eslint-disable-next-line no-console
                  console.log('Invalid JPEG metadata: Invalid segment size.')
                  break
              }
              parsers = metaDataParsers.jpeg[markerBytes]
              if (parsers && !options.disableMetaDataParsers) {
                  for (i = 0; i < parsers.length; i += 1) {
                      parsers[i].call(
                          this,
                          dataView,
                          offset,
                          markerLength,
                          data,
                          options
                      )
                  }
              }
              offset += markerLength
              headLength = offset
          } else {
              // Not an APPn or COM marker, probably safe to
              // assume that this is the end of the metadata
              break
          }
      }
      // Meta length must be longer than JPEG marker (2)
      // plus APPn marker (2), followed by length bytes (2):
      if (!options.disableImageHead && headLength > 6) {
          data.imageHead = buffer.slice(headLength)
      }
      return data;
  }
  /**
   * Parses image metadata and calls the callback with an object argument
   * with the following property:
   * - imageHead: The complete image head as ArrayBuffer
   * The options argument accepts an object and supports the following
   * properties:
   * - maxMetaDataSize: Defines the maximum number of bytes to parse.
   * - disableImageHead: Disables creating the imageHead property.
   *
   * @param {Blob} file Blob object
   * @param {Function} [callback] Callback function
   * @param {object} [options] Parsing options
   * @param {object} [data] Result data object
   * @returns {Promise<object>|undefined} Returns Promise if no callback given.
   */
  function parseMetaData(file, callback, options, data) {
    /**
     * Promise executor
     *
     * @param {Function} resolve Resolution function
     * @param {Function} reject Rejection function
     * @returns {undefined} Undefined
     */
    function executor(resolve, reject) {
        if(file.constructor.name === "ArrayBuffer"){
            resolve(parseMetaDataFromArrayBuffer.call(this,file,options,data))
        }
        else{

            if (
                !(
                    global.DataView &&
                    file &&
                    file.size >= 12 &&
                    file.type === 'image/jpeg'
                )
            ) {
                // Nothing to parse
                return resolve(data)
            }
            // 256 KiB should contain all EXIF/ICC/IPTC segments:
            let maxMetaDataSize = options.maxMetaDataSize || 262144
            if (
                !loadImage.readFile(
                    file.slice( 0, maxMetaDataSize),
                    function (buffer) {
                        resolve(parseMetaDataFromArrayBuffer.call(this,buffer,options,data))
                    },
                    reject,
                    'readAsArrayBuffer'
                )
            ) {
                // No support for the FileReader interface, nothing to parse
                resolve(data)
            }
        }
    }

    options = options || {} // eslint-disable-line no-param-reassign
    if (global.Promise && typeof callback !== 'function') {
      options = callback || {} // eslint-disable-line no-param-reassign
      data = options // eslint-disable-line no-param-reassign
      return new Promise(executor)
    }
    return executor(callback, callback)
  }

  /**
   * Replaces the head of a JPEG Blob
   *
   * @param {Blob} blob Blob object
   * @param {ArrayBuffer} oldHead Old JPEG head
   * @param {ArrayBuffer} newHead New JPEG head
   * @returns {Blob} Combined Blob
   */
  function replaceJPEGHead(blob, oldHead, newHead) {
    if (!blob || !oldHead || !newHead) return null
    return new Blob([newHead, blob.slice( oldHead.byteLength)], {
      type: 'image/jpeg'
    })
  }

  /**
   * Replaces the image head of a JPEG blob with the given one.
   * Returns a Promise or calls the callback with the new Blob.
   *
   * @param {Blob} blob Blob object
   * @param {ArrayBuffer} head New JPEG head
   * @param {Function} [callback] Callback function
   * @returns {Promise<Blob|null>|undefined} Combined Blob
   */
  function replaceHead(blob, head, callback) {
    let options = { maxMetaDataSize: 256, disableMetaDataParsers: true }
    if (!callback && global.Promise) {
      return parseMetaData(blob, options).then(function (data) {
        return replaceJPEGHead(blob, data.imageHead, head)
      })
    }
    parseMetaData(
      blob,
      function (data) {
        callback(replaceJPEGHead(blob, data.imageHead, head))
      },
      options
    )
  }

  loadImage.transform = function (img, options, callback, file, data) {
    if (loadImage.requiresMetaData(options)) {
      data = data || {} // eslint-disable-line no-param-reassign
      parseMetaData(
        file,
        function (result) {
          if (result !== data) {
            // eslint-disable-next-line no-console
            if (global.console) console.log(result)
            result = data // eslint-disable-line no-param-reassign
          }
          originalTransform.call(
            loadImage,
            img,
            options,
            callback,
            file,
            result
          )
        },
        options,
        data
      )
    } else {
      originalTransform.apply(loadImage, arguments)
    }
  }

  loadImage.replaceHead = replaceHead
  loadImage.parseMetaData = parseMetaData
  loadImage.metaDataParsers = metaDataParsers
  loadImage.parseMetaDataFromArrayBuffer = parseMetaDataFromArrayBuffer