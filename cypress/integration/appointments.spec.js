import { isTSAnyKeyword } from "@babel/types"

describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("li","Monday");
  })

  it("should book an interview", () => {
    cy.get("[alt='Add']").first().click();
    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    cy.get(".appointment__card--show").should("have","Lydia Miller-Jones").should("have","Sylvia Palmer");

  });

  it("should edit an interview", () => {
    cy.contains("main","Archie Cohen")
      .get("[alt='Edit']").click({force: true})
      .get("[alt='Tori Malcolm']").click()
      .get("[data-testid=student-name-input]").clear().type("Jackuo Lantarn");

    cy.contains("main","Save").first().contains("Save").click();

    cy.contains("Jackuo Lantarn");
  });

  it("should cancel an interview", () => {
    cy.contains("main","Archie Cohen")
      .get("[alt='Delete']").click({force: true});
    cy.contains("Confirm").click();
    cy.get(".schedule").should("have","Deleting...");
    cy.get(".schedule").should("not.have","Deleting...");
    cy.get(".schedule").find("[alt='Add']").should("have.length", 2);
    cy.contains(".appointment__card--show", "Archie Cohen")
    .should("not.exist");
  });
})