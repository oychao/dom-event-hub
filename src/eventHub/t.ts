import { IEventHandler } from '../constants/t';

export interface iDomHub {
  listen: (
    target: HTMLElement,
    eventName: string,
    handler: IEventHandler
  ) => any;
  remove: (
    target: HTMLElement,
    eventName: string,
    handler: IEventHandler
  ) => any;
  bubble: (target: HTMLElement, e: Event) => any;
  [key: string]: any;
}

export interface iSyntheticHub {
  listenComp: () => any;
}
