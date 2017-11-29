/**
 * This interface describes the flow of information
 * between the popover and user components
 */

//agreed event data description
export interface PopOverTargetEvent {
  targetDataSet?:Object;
  isDisabled?:boolean;
  id:string;
}

interface ActionFunction {
  (config:PopOverTargetEvent):any;
}

//describes the constituents of the popover config
export interface PopOverConfig {
  targetDataSet?:Object;
  popoverClass?:string;
  scrollContainerSelector?:string;
  isDisabled?:boolean;
  action:ActionFunction;
  id:string;
}
