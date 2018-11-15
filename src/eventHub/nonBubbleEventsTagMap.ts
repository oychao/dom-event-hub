import {
  EVENT_TOGGLE,
  EVENT_BLUR,
  EVENT_FOCUS,
  EVENT_CHANGE
} from '../constants/events';
import {
  TAG_DOCUMENT,
  TAG_DETAILS,
  TAG_INPUT,
  TAG_TEXTAREA,
  TAG_SELECT
} from '../constants/tags';

const nonBubbleEventsTagMap: Map<string, Array<string>> = new Map<
  string,
  Array<string>
>();

// map events don't bubble with corresponding tags
nonBubbleEventsTagMap.set(EVENT_TOGGLE, [TAG_DOCUMENT]);
nonBubbleEventsTagMap.set(EVENT_BLUR, [TAG_DOCUMENT]);
nonBubbleEventsTagMap.set(EVENT_FOCUS, [TAG_DOCUMENT]);
nonBubbleEventsTagMap.set(EVENT_CHANGE, [TAG_DOCUMENT]);

const getNonBubbleEventRelativeTags = (
  eventName: string
): null | Array<string> => nonBubbleEventsTagMap.get(eventName);

export default getNonBubbleEventRelativeTags;
