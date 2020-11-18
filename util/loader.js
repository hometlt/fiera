import Observable from '../plugins/observable.js'

export default class LoaderQueue {
  constructor(options) {
    this.completeCB = options.complete;
    this.progressCB = options.progress;
    this.addedCB = options.added;
    this.evented = !!options.complete;
    if(options.elements){
      if(options.elements.constructor === Array){
        this.togo = options.elements.slice();
        this.done = [];
      }
      else{
        this.total = options.elements;
      }
    }else{
      this.togo = [];
      this.done = [];
    }

    this.active = options.active !== undefined ? options.active : !!this.getTotal();
    this.loaded = 0;
  }

  getTotal (){
    return this.total || (this.togo.length + this.done.length);
  }

  activate (){
    this.active = true;
    if (this.done.length === this.getTotal() ) {
      this.completeCB && this.completeCB();
      this.evented && this.fire("loaded");
    }
  }

  shift (el){
    if(this.togo){
      this.togo.splice(this.togo.indexOf(el),1);
      this.done.push(el);
    }
    if(!this.active)return;
    this.progressCB && this.progressCB(this.done.length, this.getTotal(), el, this.done, this.togo);
    this.evented && this.fire("progress",{current: el});
    if (this.done.length === this.getTotal() ) {
      this.completeCB && this.completeCB();
      this.evented && this.fire("loaded");
    }
  }

  push (el){
    if(el){
      this.togo.push(el);
    }else{
      this.total ++;
    }
    if(!this.active)return;
    this.evented && this.fire("added",{current: el});
    this.addedCB && this.addedCB(this.loaded.length, this.getTotal(), el, this.loaded);
  }
}
Object.assign(LoaderQueue.prototype, Observable);

/**
 * call completeCallback when ll elements were loaded
 * @param elementsArray
 * @param completeCB
 * @param progressCB
 * @returns {loader}
 *
 * @example
 *
 * let files = [file1,file2,file3]
 *
 *    let loader = fabric.util.loader(files,onLoaded,(total, current, loadedFile) => console.log(`${loadedFile} is loaded. progress ${current}/${total}`);
 *    files.forEach((file) => {file.onload = function(){loader(file)} }
 *
 */
// export function LoaderQueue(elementsArray, completeCB, progressCB, addedCB) {
//   return new loaderQueue({
//     elements: elementsArray,
//     complete: completeCB,
//     progress: progressCB,
//     added: addedCB
//   });
// }
