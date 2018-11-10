export const queryAncestors = function(ele: HTMLElement): Array<HTMLElement> {
  const result: Array<HTMLElement> = [];
  let curEle: Node = ele;
  while (curEle) {
    result.push(<HTMLElement>curEle);
    curEle = curEle.parentNode;
  }
  return result;
};
