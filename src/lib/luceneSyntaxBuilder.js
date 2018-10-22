function escapeLuceneSyntax(str) {
  return [].map
    .call(str, char => {
      if (
        char === '/' ||
        char === '+' ||
        char === '-' ||
        char === '&' ||
        char === '|' ||
        char === '!' ||
        char === '(' ||
        char === ')' ||
        char === '{' ||
        char === '}' ||
        char === '[' ||
        char === ']' ||
        char === '^' ||
        char === '"' ||
        char === '~' ||
        char === '*' ||
        char === '?' ||
        char === ':' ||
        char === '\\'
      ) {
        return `\\${char}`;
      }
      return char;
    })
    .join('');
}

function luceneSyntaxFromQueryBuilderRule(qbRule) {
  // A rule looks like this:
  //
  // {
  //   type: "query-builder-rule",
  //   query: {
  //     rule: "message",
  //     selectedOperator: "contains",
  //     selectedOperand: "message",
  //     value: "ahci"
  //   }
  // }

  // And the lucene syntax for it looks like:
  // message:"ahci"

  let syntax = '';

  let rule = escapeLuceneSyntax(qbRule.query.rule); // like 'message'
  let value = qbRule.query.value || '*'; // like 'ahci'
  let operator = qbRule.query.selectedOperator; // like 'contains'

  if (operator === 'contains') {
    syntax += `${rule}:${value}`; // 'message:"ahci"`
  } else if (operator === 'does not contain') {
    syntax += `NOT ${rule}:${value}`; // 'NOT message:"ahci"`
  } else if (operator === 'is empty') {
    syntax += `NOT ${rule}:*`; // 'NOT message:*`
  } else if (operator === 'is not empty') {
    syntax += `${rule}:*`; // 'message:*`
  } else if (operator === 'less than') {
    syntax += `${rule}:<${value}`; // 'message:<10`
  } else if (operator === 'greater than') {
    syntax += `${rule}:>${value}`; // 'message:>10`
  } else if (operator === 'regex') {
    syntax += `${rule}:/${value}/`; // 'message:/ahci/`
  } else {
    /* istanbul ignore next */
    console.warn(`Unknown operator selected for field ${rule}:`, operator);
  }

  return syntax;
}

function luceneSyntaxFromQueryBuilderGroup(group) {
  // A group looks like this:
  //
  // {
  //   type: "query-builder-group",
  //   query: {
  //     logicalOperator: "all",
  //     children: [
  //       {
  //         type: "query-builder-rule",
  //         query: {
  //           rule: "message",
  //           selectedOperator: "contains",
  //           selectedOperand: "message",
  //           value: "error"
  //         }
  //       }
  //     ]
  //   }
  // }

  // Every time we see a group, add a paren to the main string before outputting rules
  let mainString = '(';

  // then loop through group's children and call group/rule func to get string for them
  let childRules = [];
  group.query.children.forEach(child => {
    if (child.type === 'query-builder-rule') {
      childRules.push(luceneSyntaxFromQueryBuilderRule(child, group.query.logicalOperator));
    } else if (child.type === 'query-builder-group') {
      childRules.push(luceneSyntaxFromQueryBuilderGroup(child, group.query.logicalOperator));
    }
  });

  // and add AND or OR after each rule string
  if (group.query.logicalOperator === 'all') {
    mainString += childRules.join(' AND ');
  } else {
    mainString += childRules.join(' OR ');
  }

  mainString += ')';

  return mainString;
}

export function luceneSyntaxFromQueryBuilder(query) {
  let queryString = '';
  let queryStrings = [];

  if (query.children) {
    query.children.forEach(child => {
      if (child.type === 'query-builder-group') {
        queryStrings.push(luceneSyntaxFromQueryBuilderGroup(child));
      } else if (child.type === 'query-builder-rule') {
        queryStrings.push(luceneSyntaxFromQueryBuilderRule(child));
      }
    });
  }

  if (query.logicalOperator === 'all') {
    queryString += queryStrings.join(' AND ');
  } else {
    queryString += queryStrings.join(' OR ');
  }

  return queryString;
}
