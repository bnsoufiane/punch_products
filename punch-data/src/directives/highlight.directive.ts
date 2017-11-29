import {Directive, ElementRef, Renderer} from 'angular2/core';

@Directive({
  selector: '[ar-myVideo]'
})
export class HighlightDirective {
  constructor(element:ElementRef, renderer:Renderer) {
    // simple DOM manipulation to set font size to x-large
    // `nativeElement` is the direct reference to the DOM element
    // element.nativeElement.style.fontSize = 'x-large';
    // for server/webworker support use the renderer
    // renderer.setElementClass(element.nativeElement, 'test', true);
    // renderer.setElementStyle(element.nativeElement, 'fontSize', 'x-large');
    renderer.listen(element.nativeElement, 'ended', function () {
      // element.nativeElement.paused = false;
    });
  }
}
