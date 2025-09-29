/// <reference types="cypress" />

// Custom commands for the e-commerce dashboard

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      logout(): Chainable<void>
    }
  }
}

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('logout', () => {
  cy.contains('Sign out').click()
})

export {}


