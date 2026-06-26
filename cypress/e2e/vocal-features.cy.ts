describe('Vocal Features E2E Test', () => {
  beforeEach(() => {
    // Visita a página inicial
    cy.visit('http://localhost:9000/');
    // Realiza o bypass ou login se necessário. 
    // No home.cy.ts, vemos: cy.get('button.badge-base').click(); que provavelmente simula login/sessão.
    cy.get('body').then(($body) => {
      if ($body.find('button.badge-base').length > 0) {
        cy.get('button.badge-base').click();
      }
    });
  });

  it('deve abrir as configurações e permitir selecionar o naipe vocal', () => {
    // Clica no botão de configurações (engrenagem) no canto superior direito
    cy.get('.absolute-top-right.q-btn').click();
    
    // Verifica se o diálogo de configurações abriu
    cy.contains('Classificação Vocal').should('be.visible');

    // Seleciona o naipe vocal
    cy.get('.q-select').contains('Seu Naipe Vocal').parent().click();
    cy.get('.q-manual-focusable').contains('Soprano').click();

    // Verifica se a tessitura correspondente é exibida
    cy.contains('Voz feminina aguda').should('be.visible');
  });

  it('deve abrir o teclado de referência flutuante e interagir', () => {
    // Verifica se o botão flutuante com ícone de piano está visível e clica
    cy.get('.fixed-bottom-right .q-btn').first().click();

    // O popover do teclado de referência deve ser exibido
    cy.contains('Teclado de Referência').should('be.visible');

    // Clica nas notas rápidas
    cy.contains('Dó (C4)').click();
    cy.contains('Mi (E4)').click();

    // Interage com as teclas brancas do teclado visual
    cy.get('.white-key').first().click();
  });
});
