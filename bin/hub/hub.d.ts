import { iEventHandler } from '../constants/i';
import { iHub } from './i';
declare class EventHub implements iHub {
    root: HTMLElement;
    eventMap: WeakMap<HTMLElement, Map<string, Set<iEventHandler>>>;
    ifEventManagedMap: Map<HTMLElement, Map<string, boolean>>;
    constructor(root: HTMLElement);
    listen(target: HTMLElement, eventName: string, handler: iEventHandler): any;
    remove(target: HTMLElement, eventName: string, handler: iEventHandler): any;
    bubble(target: HTMLElement, event: Event): any;
}
export default EventHub;
