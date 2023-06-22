///////////////////////////////////
chai.use(function (chai, utils) {
  chai.Assertion.addMethod('ascendingOrder', function () {
    const obj = utils.flag(this, 'object');
    new chai.Assertion(obj).to.be.an('array');

    for (let i = 0; i < obj.length - 1; i++) {
      new chai.Assertion(obj[i]).to.be.at.most(obj[i + 1]);
    }
  });
});
//////////////////////////////////////////////////
describe("Ascending Demo", () =>{
  it("RandomTest", () => {
  cy.visit("site/index.html")
  cy.get(':nth-child(2) > .nav-link').click()
  cy.wait(100)
  cy.get('#flight-from').then(($fromDropdown) => {
      const fromOptions = $fromDropdown.find('option');
      const fromRandomIndex = Cypress._.random(1, fromOptions.length - 1); // excluding the first option
      const fromValue = fromOptions[fromRandomIndex].value;
    
      cy.get('#flight-from').select(fromValue);
  cy.wait(800)
      cy.get('#flight-to').then(($toDropdown) => {
        const toOptions = $toDropdown.find('option');
        const filteredOptions = toOptions.filter((_, el) => el.value !== fromValue);
        const toRandomIndex = Cypress._.random(0, filteredOptions.length - 1); // index for filtered options
        const toValue = filteredOptions[toRandomIndex].value;
    
        cy.get('#flight-to').select(toValue);
      });
  });

  cy.get('#departing').click().type("2023-06-23")

  const startDate = new Date('2023-06-24');
  const endDate = new Date('2023-10-15');

  const randomTimestamp = Cypress._.random(startDate.getTime(), endDate.getTime());
  const randomDate = new Date(randomTimestamp);

  const formattedDate = randomDate.toISOString().slice(0, 10);

  cy.get('#returning').click().clear().type(formattedDate);

  cy.get('.btn').click()
  cy.wait(3500)
  cy.get('#sort').select("Price ascending")
  
  var prices = [];
  cy.get('.col-md-2 > .price').each(($price, index, $list) => {
      const priceText = $price.text().replace('USD $', '');
      prices.push(parseFloat(priceText));
    }).then(() => {
      expect(prices).to.be.ascendingOrder();
    });
  })
})