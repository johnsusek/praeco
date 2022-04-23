import { expect } from 'chai';
import { luceneSyntaxFromQueryBuilder } from '@/lib/luceneSyntaxBuilder.js';

let emptyTree = {
  logicalOperator: 'all',
  children: []
};

let filledTree = {
  logicalOperator: 'all',
  children: [
    {
      type: 'query-builder-rule',
      query: {
        rule: 'message',
        selectedOperator: 'contains',
        selectedOperand: 'message',
        value: 'error'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_message',
        selectedOperator: 'contains',
        selectedOperand: 'syslog_message',
        value: null
      }
    },
    {
      type: 'query-builder-group',
      query: {
        logicalOperator: 'any',
        children: [
          {
            type: 'query-builder-rule',
            query: {
              rule: 'message',
              selectedOperator: 'contains',
              selectedOperand: 'message',
              value: 'new'
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: 'message',
              selectedOperator: 'contains',
              selectedOperand: 'message',
              value: 'info'
            }
          }
        ]
      }
    }
  ]
};

let completelyFilledTree = {
  logicalOperator: 'any',
  children: [
    {
      type: 'query-builder-rule',
      query: {
        rule: '084d87f):_remoteMoRef',
        selectedOperator: 'does not contain',
        selectedOperand: '084d87f):_remoteMoRef',
        value: '^'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        selectedOperator: 'is empty',
        selectedOperand: '255',
        value: null
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        selectedOperator: 'is not empty',
        selectedOperand: '255',
        value: null
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        selectedOperator: 'regex',
        selectedOperand: '255',
        value: '.*'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_severity_code',
        selectedOperator: 'less than',
        selectedOperand: 'syslog_severity_code',
        value: '111'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_severity_code',
        selectedOperator: 'greater than',
        selectedOperand: 'syslog_severity_code',
        value: '33'
      }
    },
    {
      type: 'query-builder-group',
      query: {
        logicalOperator: 'all',
        children: [
          {
            type: 'query-builder-rule',
            query: {
              rule: ' actualProtected',
              selectedOperator: 'contains',
              selectedOperand: ' actualProtected',
              value: null
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: ' appHB',
              selectedOperator: 'contains',
              selectedOperand: ' appHB',
              value: null
            }
          },
          {
            type: 'query-builder-group',
            query: {
              logicalOperator: 'any',
              children: [
                {
                  type: 'query-builder-rule',
                  query: {
                    rule: 'location',
                    selectedOperator: 'contains',
                    selectedOperand: 'location',
                    value: null
                  }
                },
                {
                  type: 'query-builder-rule',
                  query: {
                    rule: 'location',
                    selectedOperator: 'contains',
                    selectedOperand: 'location',
                    value: null
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      type: 'query-builder-group',
      query: {
        logicalOperator: 'any',
        children: [
          {
            type: 'query-builder-rule',
            query: {
              rule: ' (7febabbf-1f22-477b-b486-c8c1dc5ce3ac):_remoteMoRef',
              selectedOperator: 'contains',
              selectedOperand: ' (7febabbf-1f22-477b-b486-c8c1dc5ce3ac):_remoteMoRef',
              value: null
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: ' Priority',
              selectedOperator: 'contains',
              selectedOperand: ' Priority',
              value: null
            }
          }
        ]
      }
    }
  ]
};

describe('luceneSyntaxBuilder', () => {
  it('returns correct query string given empty querybuilder tree', () => {
    let qs = luceneSyntaxFromQueryBuilder(emptyTree);
    expect(qs).to.equal('');
  });

  it('returns correct query string given filled querybuilder tree', () => {
    let qs = luceneSyntaxFromQueryBuilder(filledTree);
    expect(qs).to.equal('message:error AND syslog_message:* AND (message:new OR message:info)');
  });

  it('returns correct query string given completely filled querybuilder tree', () => {
    let qs = luceneSyntaxFromQueryBuilder(completelyFilledTree);
    expect(qs).to.equal('NOT 084d87f\\)\\:_remoteMoRef:^ OR NOT 255:* OR 255:* OR 255:/.*/ OR syslog_severity_code:<111 OR syslog_severity_code:>33 OR ( actualProtected:* AND  appHB:* AND (location:* OR location:*)) OR ( \\(7febabbf\\-1f22\\-477b\\-b486\\-c8c1dc5ce3ac\\)\\:_remoteMoRef:* OR  Priority:*)');
  });
});
