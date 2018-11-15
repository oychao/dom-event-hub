import { IEventHandler } from '../constants/t';
import { iDomHub, iSyntheticHub } from './t';
import { TAG_DOCUMENT } from '../constants/tags';

import getNonBubbleEventRelativeTags from './nonBubbleEventsTagMap';
import { queryAncestors } from '../constants/domUtil';

class EventHub implements iDomHub {
  root: HTMLElement;
  eventMap: WeakMap<HTMLElement, Map<string, Set<IEventHandler>>>;
  ifEventManagedMap: WeakMap<HTMLElement, Map<string, boolean>>;

  constructor(root: HTMLElement) {
    this.root = <HTMLElement>root;
    this.eventMap = new WeakMap<HTMLElement, Map<string, Set<IEventHandler>>>();
    this.ifEventManagedMap = new WeakMap<HTMLElement, Map<string, boolean>>();
  }

  listen(
    target: HTMLElement,
    eventName: string,
    handler: IEventHandler
  ): any {
    const nonBubbleTagNames: Array<string> = getNonBubbleEventRelativeTags(
      eventName
    );
    let mountTargets: Array<Node> = [document];
    if (nonBubbleTagNames) {
      const ancestors: Array<HTMLElement> = queryAncestors(
        target);
      mountTargets = ancestors.filter(
        (ele: HTMLElement): boolean =>
          ele.tagName && nonBubbleTagNames.includes(ele.tagName.toLowerCase())
      );
      nonBubbleTagNames.forEach(
        (tag: string): void => {
          if (tag === TAG_DOCUMENT) {
            mountTargets.push(document);
          } else {
            mountTargets = mountTargets.concat(
              Array.from(target.querySelectorAll(tag))
            );
          }
        }
      );
    }
    mountTargets.forEach(
      (mountTarget: HTMLElement): void => {
        let ifSubnodeEventManagedMap: Map<string, boolean>
          = this.ifEventManagedMap.get(mountTarget);
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
            },
            true
          );
          ifSubnodeEventManagedMap.set(eventName, true);
        }
      }
    );
    let handlerMap: Map<string, Set<IEventHandler>> = this.eventMap.get(<HTMLElement>target);
    if (!handlerMap) {
      this.eventMap.set(
        <HTMLElement>target,
        (handlerMap = new Map<string, Set<IEventHandler>>())
      );
    }
    let handlerSet: Set<IEventHandler> = handlerMap.get(eventName);
    if (!handlerSet) {
      handlerMap.set(eventName, (handlerSet = new Set<IEventHandler>()));
    }
    handlerSet.add(handler);
  }

  remove(
    target: HTMLElement,
    eventName: string,
    handler: IEventHandler
  ): any {
    const handlerMap: Map<string, Set<IEventHandler>> = this.eventMap.get(<HTMLElement>target);
    let handlerSet: Set<IEventHandler> = handlerMap.get(eventName);
    if (handlerSet) {
      handlerSet.delete(handler);
    }
  }

  bubble(target: HTMLElement, event: Event): any {
    let shouldNotPropagate: boolean = false;
    let eventSet: Set<IEventHandler>;
    const ancestors: Array<HTMLElement> = queryAncestors(target);
    while (ancestors.length && !shouldNotPropagate) {
      const curTarget: Node = ancestors.shift();
      const handlerMap: Map<string, Set<IEventHandler>> = this.eventMap.get(<HTMLElement>curTarget);
      if (!handlerMap) {
        continue;
      }
      eventSet = handlerMap.get(event.type);
      if (!eventSet) {
        continue;
      }
      eventSet.forEach((handler: IEventHandler) => {
        shouldNotPropagate = shouldNotPropagate ||
          handler.call(undefined, event) === false;
      });
    }
  }
}

export default EventHub;
