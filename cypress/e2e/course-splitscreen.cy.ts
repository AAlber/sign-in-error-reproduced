/// <reference types="cypress" />

describe(
  "Click on all course tabs",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      cy.intercept("/api/kv-cached/get-course-content-blocks*").as("info");
      cy.intercept("/api/cloudflare/list-files-in-directory*").as("drive");
    });
    it("navigate to info", () => {
      cy.wait("@info").its("response.statusCode").should("be.within", 200, 399);
    });
    it("navigate to chat", () => {
      cy.contains("Chat").click();
    });
    it("navigate to drive", () => {
      cy.contains(/Drive|Dateien/).click();
      cy.wait("@drive")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
  },
);
