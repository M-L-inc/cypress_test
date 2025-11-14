describe('Simple test', () => {
  it('should visit the page and check the title', () => {
    cy.visit('http://127.0.0.1:3000/');
    cy.title().should('eq', 'Vite + React');
  });
});
