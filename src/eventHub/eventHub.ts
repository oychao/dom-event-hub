import { iEventHandler } from '../constants/_i';
import { iHub } from './_i';

import getNonBubbleEventRelativeTags from './nonBubbleEventsTagMap';

class EventHub implements iHub {
  root: HTMLElement;
  eventMap: WeakMap<HTMLElement, Map<string, Set<iEventHandler>>>;
  ifEventManagedMap: Map<HTMLElement, Map<string, boolean>>;
  constructor(root: HTMLElement) {
    this.root = root;
    this.eventMap = new WeakMap<HTMLElement, Map<string, Set<iEventHandler>>>();
    this.ifEventManagedMap = new Map<HTMLElement, Map<string, boolean>>();
  }
  listen(target: HTMLElement, eventName: string, handler: iEventHandler): any {
    const nonBubbleTagNames: Array<string> = getNonBubbleEventRelativeTags(
      eventName
    );
    let mountTargets: Array<HTMLElement> = [];
    if (nonBubbleTagNames) {
      nonBubbleTagNames.forEach(
        (tag: string): void => {
          mountTargets = mountTargets.concat(
            Array.from(this.root.querySelectorAll(tag))
          );
        }
      );
    } else {
      mountTargets = [this.root];
    }
    mountTargets.forEach(
      (mountTarget: HTMLElement): void => {
        let ifSubnodeEventManagedMap: Map<
          string,
          boolean
        > = this.ifEventManagedMap.get(mountTarget);
        if (!ifSubnodeEventManagedMap) {
          this.ifEventManagedMap.set(
            mountTarget,
            (ifSubnodeEventManagedMap = new Map<string, boolean>())
          );
        }
        if (!ifSubnodeEventManagedMap.get(eventName)) {
          mountTarget.addEventListener(
            eventName,
            (e: Event): any => {
              this.bubble(<HTMLElement>e.target, e);
            }
          );
          ifSubnodeEventManagedMap.set(eventName, true);
        }
      }
    );
    let handlerMap: Map<string, Set<iEventHandler>> = this.eventMap.get(target);
    if (!handlerMap) {
      this.eventMap.set(
        target,
        (handlerMap = new Map<string, Set<iEventHandler>>())
      );
    }
    let handlerSet: Set<iEventHandler> = handlerMap.get(eventName);
    if (!handlerSet) {
      handlerMap.set(eventName, (handlerSet = new Set<iEventHandler>()));
    }
    handlerSet.add(handler);
  }
  remove(target: HTMLElement, eventName: string, handler: iEventHandler): any {
    const handlerMap: Map<string, Set<iEventHandler>> = this.eventMap.get(
      target
    );
    let handlerSet: Set<iEventHandler> = handlerMap.get(eventName);
    if (handlerSet) {
      handlerSet.delete(handler);
    }
  }
  bubble(target: HTMLElement, event: Event): any {
    let curTarget: Node = <Node>target;
    let shouldPropagate: boolean = true;
    let eventSet: Set<iEventHandler>;
    while (curTarget && shouldPropagate) {
      const handlerMap: Map<string, Set<iEventHandler>> = this.eventMap.get(<
        HTMLElement
      >curTarget);
      curTarget = curTarget.parentNode;
      if (!handlerMap) {
        continue;
      }
      eventSet = handlerMap.get(event.type);
      if (!eventSet) {
        continue;
      }
      eventSet.forEach((handler: iEventHandler) => {
        shouldPropagate = shouldPropagate && handler.call(undefined, event);
      });
    }
  }
}

export default EventHub;
