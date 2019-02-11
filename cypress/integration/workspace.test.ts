context("Test the overall app", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders with text", () => {
      cy.get("#app")
        .should("exist");
    });
  });

  describe("Test UI functionalities", () => {
    it("renders a simulation placeholder", () => {
      cy.get(".simulation").should("be.visible");
    });
    it("renders a container for energy diagrams", () => {
      cy.get(".energy-diagram-container").should("be.visible");
    });
  });
});
