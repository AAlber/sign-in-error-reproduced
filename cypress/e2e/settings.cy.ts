/// <reference types="cypress" />

describe(
  "Click through settings page",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(6) > .relative").click(); // settings

      cy.intercept("/api/role/get-admins-of-institution*").as("general");

      cy.intercept("/api/rating-schema/get-rating-schemas*").as("rating");

      cy.intercept(
        "/api/institution-user-group/user-groups-of-institution*",
      ).as("user-data");
      cy.intercept(
        "/api/institution-user-data-field/get-institution-user-data-fields*",
      ).as("user-data-field");

      cy.intercept(
        "/api/institution-settings/get-institution-storage-status*",
      ).as("institution-storage");

      cy.intercept("/api/institution-settings/get-institution-settings*").as(
        "addons",
      );

      cy.intercept("/api/stripe/get-customer-and-tax-id*").as(
        "customer-tax-id",
      );
      cy.intercept("/api/stripe/get-invoices*").as("invoices");
      cy.intercept("/api/stripe/get-payment-methods*").as("payment-methods");

      cy.intercept("/api/stripe/paid-access-passes/get-account*").as(
        "access-pass",
      );
      cy.intercept(
        "/api/stripe/access-passes/get-access-pass-status-infos*",
      ).as("pass-status-info");
    });

    context("General Page", () => {
      it("navigate to general page", () => {
        //cy.get(':nth-child(7) > .relative').click();
        cy.wait("@general")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("LMS Page", () => {
      it("navigate to LMS page", () => {
        cy.get("#cards > :nth-child(2) > .flex").click();
        cy.wait("@rating")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("User Data Page", () => {
      it("navigate to user data page", () => {
        cy.get("#cards > :nth-child(3) > .flex").click();
        cy.wait("@user-data")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@user-data-field")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("Schedule Page", () => {
      it("navigate to schedule page", () => {
        cy.get("#cards > :nth-child(4) > .flex").click();
      });
    });
    context("Communication Page", () => {
      it("navigate to communication page", () => {
        cy.get("#cards > :nth-child(5) > .flex").click();
      });
    });
    context("Storage&Privacy Page", () => {
      it("navigate to storage&privacy page", () => {
        cy.get("#cards > :nth-child(6) > .flex").click();
        cy.wait("@institution-storage")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("Addons Page", () => {
      it("navigate to addons page", () => {
        cy.get("#cards > :nth-child(8) > .flex").click();
        cy.wait("@addons")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("Integrations Page", () => {
      it("navigate to integrations page", () => {
        cy.get("#cards > :nth-child(9) > .flex").click();
      });
    });
    context("Billing Page", () => {
      it("navigate to billing page", () => {
        cy.get(":nth-child(11) > .flex").click();
        cy.wait("@customer-tax-id")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@invoices")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@payment-methods")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
    context("Access Pass Page", () => {
      it("navigate to access pass page", () => {
        cy.get(":nth-child(12) > .flex").click();
        cy.wait("@access-pass")
          .its("response.statusCode")
          .should("be.within", 200, 399);
        cy.wait("@pass-status-info")
          .its("response.statusCode")
          .should("be.within", 200, 399);
      });
    });
  },
);
