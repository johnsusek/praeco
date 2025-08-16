import format from 'string-format';

export function htmlToConfigFormat(text) {
  let el = document.createElement('html');
  el.innerHTML = text;

  let alertText = '';
  let alertArgs = [];
  let nodes = el.querySelector('body').childNodes;

  nodes.forEach(node => {
    if (node.nodeType === 3) {
      // node is text, just add it to the output string
      alertText += node.nodeValue;
    } else if (node.nodeType === 1) {
      // node is an element
      if (node.tagName === 'SPAN') {
        alertText += `{${alertArgs.length}}`;
        alertArgs.push(`${node.querySelector('[data-term]').dataset.term}`);
      } else if (node.tagName === 'DIV') {
        if (node.childNodes[0].tagName !== 'BR') {
          // since we are working with a div, it breaks the line
          alertText += '\n';
        }
        // editor will wrap some lines in a div for line breaks
        node.childNodes.forEach(innerNode => {
          if (innerNode.nodeType === 3) {
            // node is text, just add it to the output string
            alertText += innerNode.nodeValue;
          } else if (innerNode.tagName === 'SPAN') {
            // span might be inside here too, add args for it
            alertText += `{${alertArgs.length}}`;
            alertArgs.push(`${node.querySelector('[data-term]').dataset.term}`);
          } else if (innerNode.tagName === 'BR') {
            alertText += '\n';
          } else {
            /* istanbul ignore next */
            console.log('unknown inner tag', innerNode.innerHTML);
          }
        });
      } else if (node.tagName === 'BR') {
        alertText += '\n';
      } else {
        /* istanbul ignore next */
        console.log('unknown tag', node.innerHTML);
      }
    } else {
      /* istanbul ignore next */
      console.log('unknown node type', node);
    }
  });

  return { alertText, alertArgs };
}

export function configFormatToHtml(text, args) {
  if (!text) text = '';
  if (!args) args = [];

  // found a newline, place next line into a div...
  text = text.replace(/\n/g, '<br>');

  /*eslint-disable */
  let formattedArgs = args.map(
    a =>
      `<span data-at-embedded="" contenteditable="false"> <span class="el-tag el-tag--info el-tag--mini" data-term="${a}">${a}<!----></span> </span>`
  );
  /* eslint-enable */

  return format(text, ...formattedArgs);
}
