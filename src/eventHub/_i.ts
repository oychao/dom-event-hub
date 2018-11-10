import { tEventHandler } from '../constants/_i';

export interface iHub {
  listen: (
    target: HTMLElement,
    eventName: string,
    handler: tEventHandler
  ) => any;
  remove: (
    target: HTMLElement,
    eventName: string,
    handler: tEventHandler
  ) => any;
  bubble: (target: HTMLElement, event: Event) => any;
  [key: string]: any;
}
