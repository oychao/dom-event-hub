import React from 'jsx-dom-render';

// import EventHub from 'dom-event-hub';
import EventHub from '../bin';

import './index.less';

let root: HTMLElement;
let ul: HTMLElement;
let tag: HTMLElement;

document.body.appendChild(
  <div ref={(_: HTMLElement) => (root = _)}>
    <ul ref={(_: HTMLElement) => (ul = _)}>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
    </ul>
    <details>
      <summary>email</summary>
      <p>chao@ouyang.io</p>
    </details>
    <input type="text" />
    <select ref={(_: HTMLElement) => (tag = _)} name="s" id="s">
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
  </div>
);

const ehub = new EventHub(root);

// event will bubble
Array.from(ul.children).forEach((li: HTMLElement) => {
  ehub.listen(li, 'click', (e1: Event): any => {
    console.log('click', e1.target);
  });
});

// event won't bubble
ehub.listen(root, 'toggle', (e: Event): any => {
  console.log('toggle', e.target);
});
ehub.listen(root, 'focus', (e: Event): any => {
  console.log('focus', e.target);
});
ehub.listen(root, 'blur',(e: Event): any => {
  console.log('blur', e.target);
});
ehub.listen(tag, 'change', (e: Event): any => {
  console.log('change', e.target);
});
ehub.listen(ul, 'mouseover', (e: Event): any => {
  console.log('mouseover', e.target);
});

ehub.listen(tag, 'change', (e: Event): any => {});

console.log(ehub);
