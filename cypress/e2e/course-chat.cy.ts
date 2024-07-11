/// <reference types="cypress" />

describe(
  "Course",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(2) > .relative").click();
      cy.get(
        ":nth-child(1) > :nth-child(1) > .overflow-y-scroll > :nth-child(1)",
      ).click();
    });

    context("Chat", () => {
      it("send message", () => {
        cy.get(".overflow-y-scroll > p").click();
        cy.get(".overflow-y-scroll > p").type("Test");
        cy.get(".hidden > .w-full > .inline-flex").click();
      });
      it("send gif", () => {
        cy.wait(3000);
        cy.get(".w-full > .relative > .flex > .text-muted-contrast").click();
        cy.wait(3000);
        cy.get(":nth-child(3) > .h-full").click();
      });
    });
  },
);
