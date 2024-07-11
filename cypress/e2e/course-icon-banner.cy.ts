/// <reference types="cypress" />

describe(
  "Change course icon and banner",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      //
    });

    it("change course icon", () => {
      cy.get(".h-24").click();
      cy.contains("Emoji").click();
      cy.contains("button", "😊").click();
      cy.contains("button", "😎").click();
    });
    /*it.skip("change course icon", () => {
      cy.get(".-mt-2 > :nth-child(1) > .group").trigger("mouseover");
      cy.get("#trigger-button").invoke("show");
      cy.get("#trigger-button").should("be.visible").click({ force: true });
    });*/
  },
);
