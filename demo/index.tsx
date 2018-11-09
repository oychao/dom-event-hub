import React from 'jsx-dom-render';

import EventHub from '../bin';

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
    <input type="text"/>
    <select ref={(_: HTMLElement) => (tag = _)} name="s" id="s">
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
  </div>
);

const ehub = new EventHub(root);

// event will bubble
Array.from(ul.children).forEach((li: HTMLElement) => {
  ehub.listen(
    li,
    'click',
    (e: Event): any => {
      console.log('hello click', e.target);
    }
  );
});

// event won't bubble
ehub.listen(
  root,
  'toggle',
  (e: Event): any => {
    console.log('hello toggle', e.target);
  }
);
ehub.listen(
  root,
  'focus',
  (e: Event): any => {
    console.log('hello focus', e.target);
  }
);
ehub.listen(
  root,
  'blur',
  (e: Event): any => {
    console.log('hello blur', e.target);
  }
);
ehub.listen(
  root,
  'change',
  (e: Event): any => {
    console.log('hello change', e.target);
  }
);
