// file: cypress/e2e/step_definitions/login_test.js

import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

Given("the user is on the login page", () => {
  cy.visit("/login");
});

When("they enter the username {string}", (email) => {
  cy.get('input[name="email"]').type(email);
});

When("they enter the password {string}", (password) => {
  cy.get('input[name="password"]').type(password);
});

When("they click the login button", () => {
  cy.get('button[type="submit"]').click();
});

Then("they are redirected to the home page", () => {
  cy.url().should("include", "/home");
});

Then("the message {string} is displayed", (message) => {
  cy.contains(message).should("be.visible");
});

Then("an error message {string} is displayed", (message) => {
  cy.get(".error-message").should("contain.text", message);
});
