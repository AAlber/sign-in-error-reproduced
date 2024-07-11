/// <reference types="cypress" />

describe(
  "Click all pages",
  {
    retries: {
      runMode: 2,
      openMode: 2,
    },
  },
  () => {
    beforeEach(() => {
      cy.intercept("/api/kv-cached/user-data*").as("course");

      cy.intercept("/api/schedule/filter/get-custom-filter*").as(
        "calendar-filter",
      );
      cy.intercept("/api/schedule/get-all-upcoming-appointments*").as(
        "calendar-all",
      );
      cy.intercept("/api/schedule/get-appointments-of-week/*").as(
        "calendar-week",
      );

      cy.intercept("/api/administration/get-layer-tree/*").as("structure");

      cy.intercept("/api/role/get-users-of-institution*").as("user-management");

      cy.intercept("/api/institution-settings/get-institution-settings*").as(
        "institution-settings",
      );
      cy.intercept("/api/invite/count-pending-invites/*").as("pending-invites");
      cy.intercept("/api/role/get-admins-of-institution*").as(
        "admins-institution",
      );
    });
    it("navigate to course page", () => {
      cy.wait("@course")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("navigate to chat page", () => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(2) > .relative").click();
    });
    it("navigate to calendar page", () => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(3) > .relative").click();
      cy.wait("@calendar-filter")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@calendar-all")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@calendar-week")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("navigate to structure page", () => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(4) > .relative").click();
      cy.wait("@structure")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("navigate to user management page", () => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(5) > .relative").click();
      cy.wait("@user-management")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
    it("navigate to settings page", () => {
      cy.get("ul.flex > :nth-child(1) > :nth-child(6) > .relative").click();
      cy.wait("@institution-settings")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@pending-invites")
        .its("response.statusCode")
        .should("be.within", 200, 399);
      cy.wait("@admins-institution")
        .its("response.statusCode")
        .should("be.within", 200, 399);
    });
  },
);
