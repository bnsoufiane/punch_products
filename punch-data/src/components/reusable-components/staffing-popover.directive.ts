import {Directive, ElementRef, OnDestroy, Renderer, Input} from 'angular2/core';
import {PopOverTargetEvent} from '../../common/interfaces/interfaces';
import {PopOverConfig} from '../../common/interfaces/inter-component-contracts/staffing-popover-contract.interface';


@Directive({
  selector: 'staffing-popover-content',
  providers: [ElementRef, Renderer]
})
export class StaffingPopoverContent {
  private static contentAreas = {};
  @Input('id') id:string;


  constructor(private el:ElementRef) {
  }

  getContentArea(id) {
    return StaffingPopoverContent.contentAreas[id];
  }

  removeContentArea(id) {
    if (StaffingPopoverContent.contentAreas[id]) {
      delete StaffingPopoverContent.contentAreas[id];
    }
  }

  ngOnInit() {
    StaffingPopoverContent.contentAreas[this.id] = this.el;
  }
}

/* tslint:disable */
//reason is scoping staffingPopoverTarget is needed, therefore we use this inputs style
@Directive({
  selector: '[staffingPopoverTarget]',
  providers: [ElementRef, Renderer, StaffingPopoverContent],
  inputs: ['popoverConfig: staffingPopoverTarget']
})
/* tslint:enable */

//StaffingPopoverDirective -> popover target attribute directive.
// Usage staffing-popover-target='config'
//mandatory is config. Which i described in the interface
//If no popoverContent, then events will bind but popup will not open
export class StaffingPopoverDirective implements OnDestroy {
  public popoverConfig = <PopOverConfig>{};
  private contentTarget;
  private popoverClasses = {
    hovered: 'staffing-popover-container display',
    hidden: 'staffing-popover-container hidden',
    arrowLeft: 'staffing-popover-Arrow left',
    arrowRight: 'staffing-popover-Arrow right',
    arrowTop: 'staffing-popover-Arrow top',
    arrowBottom: 'staffing-popover-Arrow bottom'
  };
  private listeners = {};//circumvents the issue caused with bind;

  private popoverBounds;
  private isOpen;

  constructor(private el:ElementRef, private renderer:Renderer, private staffingPopoverAreas:StaffingPopoverContent) {
  }

  //sets event listeners
  ngOnInit() {
    if (!this.popoverConfig) {
      console.info('Staffing popover needs a config. Popovers disabled for' + this.el);
      return;
    }

    this.contentTarget = this.staffingPopoverAreas.getContentArea(this.popoverConfig.id);
    //prep container, add arrow and event listeners
    if (this.contentTarget) {
      this.contentTarget.nativeElement.className = this.popoverClasses.hidden + ' ' + this.popoverConfig.popoverClass;

      if (this.contentTarget.staffingPopoverArrow) {
        this.contentTarget.staffingPopoverArrow.className = this.popoverClasses.arrowLeft;
      }

      if (!this.popoverConfig.scrollContainerSelector.match(/body|document/gi)) {
        this.popoverConfig.scrollContainerSelector = '.' + this.popoverConfig.scrollContainerSelector;
      }

      //setup listeners so we can remove them
      this.listeners['mouseenter'] = this.onHover.bind(this);
      this.listeners['mouseleave'] = this.onBlur.bind(this);
      this.listeners['mousemove'] = this.onMouseMove.bind(this);

      this.el.nativeElement.addEventListener('mouseenter', this.listeners['mouseenter']);
      this.el.nativeElement.addEventListener('mouseleave', this.listeners['mouseleave']);
    }
  }

  //removes event listeners
  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('mouseenter', this.listeners['mouseenter']);
    this.el.nativeElement.removeEventListener('mouseleave', this.listeners['mouseleave']);
    this.staffingPopoverAreas.removeContentArea(this.popoverConfig.id);
  }

  //----------Event handlers-----------------
  //triggers the config action onhover
  private onHover():void {
    if (this.popoverConfig.isDisabled) {
      return;
    }
    (function () {
      setTimeout(function () {
        if (this.isOpen || !this.contentTarget) {//ignore further hover events.
          return;
        }
        //call external component action with event config (allows content change first)
        this.popoverConfig.action(<PopOverTargetEvent>{
          targetDataSet: this.popoverConfig.targetDataSet,
          isDisabled: this.popoverConfig.isDisabled,
          id: this.popoverConfig.id
        });

        //then open popover
        this.setPopoverPosition();
        this.contentTarget.nativeElement.className = this.popoverClasses.hovered;
        this.isOpen = true;
        //save popover Dimensions to prevent false close signal
        this.popoverBounds = this.contentTarget.nativeElement.getBoundingClientRect();//left, top, height, width
        document.addEventListener('mousemove', this.listeners['mousemove']);
      }.bind(this), 300);
    }.bind(this))();
  }

  //closes the popover if mouse leaves element AND popover
  private onBlur(event):void {
    if (!this.detectWithin(event) && event.target !== this.el.nativeElement) {
      this.contentTarget.nativeElement.className = this.popoverClasses.hidden;
      document.removeEventListener('mousemove', this.listeners['mousemove']);
      this.isOpen = false;
    }
  }

  //move handler to detect when to close the popover
  private onMouseMove(event):void {
    this.onBlur(event);
  }

  //-----------------Position calcs-------------------
  /* tslint:disable */
  private setPopoverPosition():void {
    let pos = this.el.nativeElement.getBoundingClientRect();
    let scrollTop = 0;
    if (this.popoverConfig.scrollContainerSelector) {
      scrollTop = document.querySelector(this.popoverConfig.scrollContainerSelector).scrollTop;
    }
    this.renderer.setElementStyle(this.contentTarget.nativeElement, 'position', 'absolute');
    this.renderer
      .setElementStyle(this.contentTarget.nativeElement, 'top', (pos.top + (pos.height / 2) - 30 + scrollTop) + 'px');
    this.renderer.setElementStyle(this.contentTarget.nativeElement, 'left', (pos.left + pos.width) + 'px');
  }

  /* tslint:enable */

  //checks if mousePointer is inside popover
  private detectWithin(event):boolean {
    if (!event || !this.popoverBounds) {
      return false;
    }

    let mousePos = this.getMousePosition(event);
    let horizontalMatch;
    let verticalMatch;

    horizontalMatch = this.comparePositions([mousePos.left, mousePos.left + 1],
      [this.popoverBounds.left, this.popoverBounds.left + this.popoverBounds.width]);

    verticalMatch = this.comparePositions([mousePos.top, mousePos.top + 1],
      [this.popoverBounds.top, this.popoverBounds.top + this.popoverBounds.height]);

    return (horizontalMatch && verticalMatch);
  }

  //if needed the using component can describe a container to correctly render mouse positions
  private getMousePosition(e:any):{ left:number, top:number } {
    if (((<any>window).TouchEvent && e instanceof TouchEvent) || (e.touches || e.changedTouches)) {
      e = e.touches.length > 0 ? e.touches[0] : e.changedTouches[0];
    }
    let refPos;
    let refPosTop;
    let left;
    let top;

    if (this.popoverConfig.scrollContainerSelector) {
      let node = document.querySelector(this.popoverConfig.scrollContainerSelector);
      refPos = node.getBoundingClientRect();
      if (this.popoverConfig.scrollContainerSelector.match(/body|document/gi)) {//body has no real scrollTop
        refPosTop = 0;
      } else {
        refPosTop = node.scrollTop - refPos.top;
      }

      left = e.clientX - refPos.left;
      top = e.clientY + refPosTop;
      node = null;
    } else {
      left = e.clientX;
      top = e.clientY;
    }

    return {
      left: left,
      top: top
    };
  }

  //checks one 2d dimension is inside another
  private comparePositions(p1, p2):boolean {
    var x1 = p1[0] < p2[0] ? p1 : p2;
    var x2 = p1[0] < p2[0] ? p2 : p1;
    return x1[1] > x2[0] || x1[0] === x2[0] ? true : false;
  }
}
