import { iEventHandler } from '../constants/_i';
export interface iHub {
    listen: (target: HTMLElement, eventName: string, handler: iEventHandler) => any;
    remove: (target: HTMLElement, eventName: string, handler: iEventHandler) => any;
    bubble: (target: HTMLElement, event: Event) => any;
    [key: string]: any;
}
