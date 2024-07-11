/* eslint-disable @typescript-eslint/no-namespace */
/// <reference types="cypress" />

// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Commands.add(`signIn`, () => {
  cy.log(`Signing in.`);
  cy.visit("/sign-in", { failOnStatusCode: false });

  cy.window()
    .should((window) => {
      expect(window).to.not.have.property(`Clerk`, undefined);
      expect(window.Clerk.isReady()).to.eq(true);
    })
    .then(async (window) => {
      cy.clearCookies({ domain: window.location["domain"] });
      const res = await window.Clerk.client.signIn.create({
        identifier: Cypress.env(`test_email`),
        password: Cypress.env(`test_password`),
      });

      await window.Clerk.setActive({
        session: res.createdSessionId,
      });

      cy.log(`Finished Signing in.`);
      cy.visit("/onboarding?trial=true", {
        failOnStatusCode: false,
      });
    });
});

let onboardingDone = false;

beforeEach(() => {
  cy.intercept("https://api-iam.intercom.io/messenger/web/ping", {
    statusCode: 200,
    body: "",
  });

  cy.session("signingIn", cy.signIn);

  if (!onboardingDone) {
    cy.visit("/onboarding?trial=true", { failOnStatusCode: false });
    cy.get(".mt-4 > .inline-flex").click();
    cy.get("#first-name").type(`test_cypress_orga_dev_${Date.now()}`);
    cy.get(".col-span-3 > .inline-flex").click();

    cy.intercept("/api/institutions/create-trial-subscription").as(
      "createTrialSubscription",
    );
    cy.intercept("/api/administration/create-layer*").as("create-course");

    cy.wait("@createTrialSubscription").then(() => {
      onboardingDone = true;
      cy.visit("/");

      cy.intercept("/api/users/get-layer-ids*").as("load-layers");
      cy.wait("@load-layers");

      cy.get(".gap-2 > .inline-flex").click();
      cy.wait(3000);
      //cy.intercept("/api/administration/get-layer-tree/*").as("load-admin-layer");
      //cy.wait("@load-admin-layer");

      cy.contains(/Course|Kurs/).click();
      cy.get(".gap-2 > .flex").click();
      cy.get(".gap-2 > .flex").type("test-course");
      cy.get(".gap-2 > .inline-flex").click();

      cy.wait("@create-course")
        .its("response.statusCode")
        .should("be.within", 200, 399);

      cy.intercept("/api/administration/get-layer-tree/*").as("course-tree");
      cy.wait("@course-tree");

      cy.get("ul.flex > :nth-child(1) > :nth-child(1) > .relative").click();
    });
  } //else {
  cy.visit("/", { failOnStatusCode: false });
  //}
});

after(() => {
  cy.log("Deleting all test institutions");
  cy.request("/api/institutions/delete-all-test-institutions");
});
