describe('App test', () => {
  it('Renders nav tree', () => {
    cy.visit('/');
    cy.contains('.vue-treeselect__option[data-id="_rules"]', 'Rules');
    cy.contains('.vue-treeselect__option[data-id="_templates"]', 'Templates');
    cy.contains('.vue-treeselect__option[data-id="_errors"]', 'Errors');

    cy.get('.vue-treeselect__option[data-id="_errors"]').click();
    cy.contains('.cell', '2018');

    let selector =
      '.vue-treeselect__option[data-id="_templates"] .vue-treeselect__option-arrow-container';

    cy.get(selector).click();
    cy.contains('.vue-treeselect__label', 'Default');

    cy.get('.vue-treeselect__option[data-id="Default"]').click();
    cy.contains('.el-card__body', 'Default');

    cy.contains('Duplicate').click();
    cy.contains('h1', 'Default (1)');

    cy.contains('Delete...').click({ force: true });
    cy.contains('.el-button', 'Confirm').click();

    cy.contains('h1', 'Templates');

    cy.contains('Add folder').click();
    cy.get('.el-message-box__wrapper .el-input')
      .find('input')
      .click()
      .type('Automated test folder');

    cy.get('.el-message-box__wrapper')
      .contains('OK')
      .click();

    cy.get('[data-id="Automated test folder/"]');
    cy.contains('Delete folder...').click({ force: true });
  });
});
