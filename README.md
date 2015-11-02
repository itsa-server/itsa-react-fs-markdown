# itsa-react-fs-markdown

Read markdownfiles and return a dangerouslySetInnerHTML object as a Promise.

### usage:
```js
const fsMD = require('itsa-react-fs-markdown')(__dirname); // <-- always invoke with the current __dirname
const pagecontentPromise = fsMD.readFile('./markdown_files/index.MD');

/*
 * pagecontentPromise is a promise that gets fulfilled with an object like this:
 * {__html: 'the <b>content</b> of the file'}
 */

```

Code-blocks will get markedup as well, though you need to take care of the right css yourselve. Get the css from [Highlight.js](https://highlightjs.org).