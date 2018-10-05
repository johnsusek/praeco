describe('App test', () => {
  it('Renders nav tree', () => {
    cy.visit('/');
    let selector =
      '.vue-treeselect__option[data-id="_templates"] .vue-treeselect__option-arrow-container';
    cy.get(selector).click();
    cy.contains('.vue-treeselect__label', 'Default');

    cy.get('.vue-treeselect__option[data-id="Default"]').click();
    cy.contains('.el-card__body', 'Default');

    cy.contains('Create rule from template').click({ force: true });

    cy.get('.el-form-item__label')
      .contains('Name')
      .next()
      .find('input')
      .clear()
      .click()
      .type('Automated test rule');

    cy.contains('Next').click({ force: true });

    cy.contains('Next').click({ force: true });

    cy.contains('Next').click({ force: true });

    cy.contains('Next').click({ force: true });

    cy.wait(5000);

    cy.get('.praeco-config-save').click({ force: true });

    cy.contains('Delete...').click({ force: true });
    cy.contains('.el-button', 'Confirm').click();
  });
});
