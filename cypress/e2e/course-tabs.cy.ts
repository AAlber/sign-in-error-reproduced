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
      cy.intercept("/api/courses/get-content-block-user-status*").as(
        "learning-journey",
      );
      cy.intercept("/api/peer-feedback/get-all-for-layer/*").as(
        "peer-feedback",
      );
      cy.intercept("/api/courses/get-all-course-members*").as("courses");
      cy.intercept("/api/users/get-by-layer/*").as("course-users");
      cy.intercept("/api/course-goals/*").as("course-settings");
    });
    it("navigate to the dashboard", () => {
      //
    });
    it("navigate to learning journey", () => {
      cy.get(".w-auto > :nth-child(2)").click();
      /*cy.wait("@learning-journey")
        .its("response.statusCode")
        .should("be.within", 200, 399);*/
    });
    it("navigate to course member", () => {
      cy.get(".w-auto > :nth-child(3)").click();
      cy.wait("@courses")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@course-users")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("navigate to course settings", () => {
      cy.get(".w-auto > :nth-child(4)").click();
      cy.wait("@course-settings")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
  },
);
