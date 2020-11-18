/* Copyright 2012 Mozilla Foundation
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
/* eslint-disable no-var */

import { Dict, isDict } from "./primitives.js";
import { CCITTFaxDecoder } from "./ccitt.js";
import { DecodeStream } from "./stream.js";

var CCITTFaxStream = (function CCITTFaxStreamClosure() {
  // eslint-disable-next-line no-shadow
  function CCITTFaxStream(str, maybeLength, params) {
    this.str = str;
    this.dict = str.dict;

    if (!isDict(params)) {
      params = Dict.empty;
    }

    const source = {
      next() {
        return str.getByte();
      },
    };
    this.ccittFaxDecoder = new CCITTFaxDecoder(source, {
      K: params.get("K"),
      EndOfLine: params.get("EndOfLine"),
      EncodedByteAlign: params.get("EncodedByteAlign"),
      Columns: params.get("Columns"),
      Rows: params.get("Rows"),
      EndOfBlock: params.get("EndOfBlock"),
      BlackIs1: params.get("BlackIs1"),
    });

    DecodeStream.call(this, maybeLength);
  }

  CCITTFaxStream.prototype = Object.create(DecodeStream.prototype);

  CCITTFaxStream.prototype.readBlock = function () {
    while (!this.eof) {
      const c = this.ccittFaxDecoder.readNextChar();
      if (c === -1) {
        this.eof = true;
        return;
      }
      this.ensureBuffer(this.bufferLength + 1);
      this.buffer[this.bufferLength++] = c;
    }
  };

  return CCITTFaxStream;
})();

export { CCITTFaxStream };
