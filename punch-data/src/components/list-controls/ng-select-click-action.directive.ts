import {Directive, ElementRef, OnDestroy, AfterViewInit} from 'angular2/core';

@Directive({
  selector: '[ng2-select-click-action]'
})
//ng2-select only opens the drop on a direct click on the input. This allows the button to open it.
//and close it.
export class Ng2SelectClickAction implements OnDestroy, AfterViewInit {
  private isOpen:boolean = false;
  private hide = {
    'true': 'hidden',
    'false': ''
  };
  private elements = {
    selectContainer: () => this.element.nativeElement.querySelector('#ngMultiSelectListControlId'),
    button: () => this.element.nativeElement.querySelector('#ngMultiSelectListControlButton'),
    closeButton: () => this.element.nativeElement.querySelector('#ngMultiSelectListControlCloseButton'),
    selectInput: () => this.element.nativeElement.querySelector('.ui-select-search'),
    matchItem: /ui-select-match-close/gi
  };
  private elClasses = {
    button: 'btn btn-plain dropdown-toggle',
    closeButton: 'multi-select-close-button  ion'
  };

  constructor(private element:ElementRef) {
    this.element.nativeElement.addEventListener('click', this.onClick.bind(this));
  }

  ngAfterViewInit() {
    this.elements.closeButton().addEventListener('click', this.onCloseClick.bind(this));
    document.addEventListener('click', this.outsideClick.bind(this));
  }

  ngOnDestroy() {
    this.element.nativeElement.removeEventListener('click', this.onClick);
    this.elements.closeButton().removeEventListener('click', this.onCloseClick);
    document.removeEventListener('click', this.outsideClick);
  }

  //Behavior is to hide the button, show the drop down, and the close button
  onClick(event:any):void {
    if (this.elements.matchItem.test(event.target.className)) {
      return;//click on remove item
    }
    event.stopPropagation();
    this.elements.selectContainer().className = this.hide.false;
    this.elements.closeButton().className = this.elClasses.closeButton;
    this.elements.button().className = this.hide.true;
    let el = this.elements.selectInput();
    el.click();
    el = null;
    this.isOpen = true;
  }

  //behavior is to hide the dropDown and show the open button
  onCloseClick(event:any):void {
    event.stopPropagation();
    this.elements.selectContainer().className = this.hide.true;
    this.elements.closeButton().className = this.hide.true;
    this.elements.button().className = this.elClasses.button;
    this.isOpen = false;
  }

  //this element is the only one that will false trigger outSide click.
  //Behavior is to close menu on click outside menu
  outsideClick(event:any):void {
    if (!this.elements.matchItem.test(event.target.className)) {
      this.onCloseClick(event);
    }
  }
}
