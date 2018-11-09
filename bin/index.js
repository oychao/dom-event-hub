'use strict';

const EVENT_TOGGLE = 'toggle';
const EVENT_FOCUS = 'focus';
const EVENT_BLUR = 'blur';
const EVENT_CHANGE = 'change';

const TAG_DETAILS = 'details';
const TAG_INPUT = 'input';
const TAG_SELECT = 'select';
const TAG_TEXTAREA = 'textarea';

const nonBubbleEventsTagMap = new Map();
nonBubbleEventsTagMap.set(EVENT_TOGGLE, [TAG_DETAILS]);
nonBubbleEventsTagMap.set(EVENT_BLUR, [TAG_INPUT, TAG_TEXTAREA, TAG_SELECT]);
nonBubbleEventsTagMap.set(EVENT_FOCUS, [TAG_INPUT, TAG_TEXTAREA, TAG_SELECT]);
nonBubbleEventsTagMap.set(EVENT_CHANGE, [TAG_INPUT, TAG_TEXTAREA, TAG_SELECT]);
const getNonBubbleEventRelativeTags = (eventName) => nonBubbleEventsTagMap.get(eventName);

class EventHub {
    constructor(root) {
        this.root = root;
        this.eventMap = new WeakMap();
        this.ifEventManagedMap = new Map();
    }
    listen(target, eventName, handler) {
        const nonBubbleTagNames = getNonBubbleEventRelativeTags(eventName);
        let mountTargets = [];
        if (nonBubbleTagNames) {
            nonBubbleTagNames.forEach((tag) => {
                mountTargets = mountTargets.concat(Array.from(this.root.querySelectorAll(tag)));
            });
        }
        else {
            mountTargets = [this.root];
        }
        mountTargets.forEach((mountTarget) => {
            let ifSubnodeEventManagedMap = this.ifEventManagedMap.get(mountTarget);
            if (!ifSubnodeEventManagedMap) {
                this.ifEventManagedMap.set(mountTarget, (ifSubnodeEventManagedMap = new Map()));
            }
            if (!ifSubnodeEventManagedMap.get(eventName)) {
                mountTarget.addEventListener(eventName, (e) => {
                    this.bubble(e.target, e);
                });
                ifSubnodeEventManagedMap.set(eventName, true);
            }
        });
        let handlerMap = this.eventMap.get(target);
        if (!handlerMap) {
            this.eventMap.set(target, (handlerMap = new Map()));
        }
        let handlerSet = handlerMap.get(eventName);
        if (!handlerSet) {
            handlerMap.set(eventName, (handlerSet = new Set()));
        }
        handlerSet.add(handler);
    }
    remove(target, eventName, handler) {
        const handlerMap = this.eventMap.get(target);
        let handlerSet = handlerMap.get(eventName);
        if (handlerSet) {
            handlerSet.delete(handler);
        }
    }
    bubble(target, event) {
        let curTarget = target;
        let shouldPropagate = true;
        let eventSet;
        while (curTarget && shouldPropagate) {
            const handlerMap = this.eventMap.get(curTarget);
            curTarget = curTarget.parentNode;
            if (!handlerMap) {
                continue;
            }
            eventSet = handlerMap.get(event.type);
            if (!eventSet) {
                continue;
            }
            eventSet.forEach((handler) => {
                shouldPropagate = shouldPropagate && handler.call(undefined, event);
            });
        }
    }
}

module.exports = EventHub;
