describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:9000/')
    cy.get('button.badge-base').click()
    cy.get('[data-test="start-study-btn"]').click();
    cy.url().should('include', '/treino');
    cy.get('[data-test="start-study-btn"]').should('not.exist');
    cy.contains('🎧 Hora de Soltar a Voz! 🎶').should('exist');
  })
})
