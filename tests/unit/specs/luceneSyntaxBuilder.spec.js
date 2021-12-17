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
        operator: 'contains',
        operand: 'message',
        value: 'error'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_message',
        operator: 'contains',
        operand: 'syslog_message',
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
              operator: 'contains',
              operand: 'message',
              value: 'new'
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: 'message',
              operator: 'contains',
              operand: 'message',
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
        operator: 'does not contain',
        operand: '084d87f):_remoteMoRef',
        value: '^'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        operator: 'is empty',
        operand: '255',
        value: null
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        operator: 'is not empty',
        operand: '255',
        value: null
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: '255',
        operator: 'regex',
        operand: '255',
        value: '.*'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_severity_code',
        operator: 'less than',
        operand: 'syslog_severity_code',
        value: '111'
      }
    },
    {
      type: 'query-builder-rule',
      query: {
        rule: 'syslog_severity_code',
        operator: 'greater than',
        operand: 'syslog_severity_code',
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
              operator: 'contains',
              operand: ' actualProtected',
              value: null
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: ' appHB',
              operator: 'contains',
              operand: ' appHB',
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
                    operator: 'contains',
                    operand: 'location',
                    value: null
                  }
                },
                {
                  type: 'query-builder-rule',
                  query: {
                    rule: 'location',
                    operator: 'contains',
                    operand: 'location',
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
              operator: 'contains',
              operand: ' (7febabbf-1f22-477b-b486-c8c1dc5ce3ac):_remoteMoRef',
              value: null
            }
          },
          {
            type: 'query-builder-rule',
            query: {
              rule: ' Priority',
              operator: 'contains',
              operand: ' Priority',
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
