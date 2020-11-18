/* Copyright 2020 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* globals __non_webpack_require__ */

import { BaseCanvasFactory, BaseCMapReaderFactory } from "./display_utils.js";
import { isNodeJS } from "../shared/is_node.js";
import { unreachable } from "../shared/util.js";

let NodeCanvasFactory = class {
  constructor() {
    unreachable("Not implemented: NodeCanvasFactory");
  }
};

let NodeCMapReaderFactory = class {
  constructor() {
    unreachable("Not implemented: NodeCMapReaderFactory");
  }
};

if ((typeof PDFJSDev === "undefined" || PDFJSDev.test("GENERIC")) && isNodeJS) {
  NodeCanvasFactory = class extends BaseCanvasFactory {
    create(width, height) {
      if (width <= 0 || height <= 0) {
        throw new Error("Invalid canvas size");
      }
      const Canvas = __non_webpack_require__("canvas");
      const canvas = Canvas.createCanvas(width, height);
      return {
        canvas,
        context: canvas.getContext("2d"),
      };
    }
  };

  NodeCMapReaderFactory = class extends BaseCMapReaderFactory {
    _fetchData(url, compressionType) {
      return new Promise((resolve, reject) => {
        const fs = __non_webpack_require__("fs");
        fs.readFile(url, (error, data) => {
          if (error || !data) {
            reject(new Error(error));
            return;
          }
          resolve({ cMapData: new Uint8Array(data), compressionType });
        });
      });
    }
  };
}

export { NodeCanvasFactory, NodeCMapReaderFactory };
