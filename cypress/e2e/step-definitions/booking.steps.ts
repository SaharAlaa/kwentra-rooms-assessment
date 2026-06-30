import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { HomePage }        from '../../pages/home.page';
import { BookingFormPage } from '../../pages/booking-form.page';
import { ReservationDetailPage } from '../../pages/reservation-detail.page';
import { PricingCalculatorPage } from '../../pages/pricing-calculator.page';

const home    = HomePage.Instance;
const form    = BookingFormPage.Instance;
const detail  = ReservationDetailPage.Instance;
const calc     = PricingCalculatorPage.Instance

// ── Background ─────────────────────────────────────────────────────────────────

Given('the app is in a clean state', () => {
  cy.resetApp();
});

// ── Navigation ─────────────────────────────────────────────────────────────────

Given('I navigate to the booking form for room {string} with check-in {string} and check-out {string}',
  (roomId: string, checkIn: string, checkOut: string) => {
    form.visit(roomId, checkIn, checkOut);
  });
//test parrallel

// ── Form interaction ───────────────────────────────────────────────────────────

When('I fill in guest details with name {string}, email {string} and {string} guests',
  (name: string, email: string, count: string) => {
    form.fillGuestName(name);
    form.fillGuestEmail(email);
    form.fillGuestCount(parseInt(count));
  });

When('I fill in guest details from fixture {string}', (fixtureKey: string) => {
  cy.fixture('guests').then((guests: Record<string, { name: string; email: string; count: number }>) => {
    const guest = guests[fixtureKey];
    expect(guest, `Guest fixture "${fixtureKey}"`).to.exist;
    form.fillGuestName(guest.name);
    form.fillGuestEmail(guest.email);
    form.fillGuestCount(guest.count);
  });
});

When('I insert guest details from fixture {string} only', (fixtureKey: string) => {
  cy.fixture('guests').then((guests: Record<string, { name: string; email: string; count: number }>) => {
    const guest = guests[fixtureKey];
    expect(guest, `Guest fixture "${fixtureKey}"`).to.exist;
    form.fillGuestName(guest.name);
    form.fillGuestEmail(guest.email);
  });
});

When('I click Preview Price', () => {
  form.clickPreview();
});

When('I confirm the booking', () => {
  form.submit();
});

// ── Intercept (example scenario 2) ────────────────────────────────────────────
//listens to the pricing API call triggered by the Preview button, so we can assert on its payload and response in later steps. You can add more intercepts like this for other API calls as needed.
When('I intercept the pricing API call', () => {
  cy.intercept('POST', '/api/pricing/calculate').as('pricingCall');
});

// ── Price preview assertions ───────────────────────────────────────────────────

Then('the price preview shows {string} nights at {string} per night',
  (nights: string, _rate: string) => {
    form.getPreviewNights().should('contain', nights);
  });

Then('the preview grand total is {string}', (total: string) => {
  form.getPreviewGrandTotal().should('have.text', total);
});

// ── Intercept assertions (example scenario 2) ────────────────────────────────

Then('the intercepted pricing request body contains roomId {string}, checkIn {string}, checkOut {string}',
  (roomId: string, checkIn: string, checkOut: string) => {
    cy.get('@pricingCall').its('request.body').should('deep.include', { roomId, checkIn, checkOut });
  });

Then('the API response nights count is {string}', (nights: string) => {
  cy.get('@pricingCall').its('response.body.nights').should('eq', parseInt(nights));
});

// ── Post-submit assertions ─────────────────────────────────────────────────────

Then('I am on the reservation detail page', () => {
  cy.url().should('match', /\/reservations\/RES-/);
});

Then('the reservation status is {string}', (status: string) => {
  detail.getStatus().should('contain.text', status);
});

Then('the guest name shown is {string}', (name: string) => {
  cy.get('[data-cy=guest-name]').should('have.text', name);
});

Then('the guest name shown matches fixture {string}', (fixtureKey: string) => {
  cy.fixture('guests').then((guests: Record<string, { name: string; email: string; count: number }>) => {
    const guest = guests[fixtureKey];
    expect(guest, `Guest fixture "${fixtureKey}"`).to.exist;
    cy.get('[data-cy=guest-name]').should('have.text', guest.name);
  });
});

Then('the grand total shown is {string}', (total: string) => {
  detail.getGrandTotal().should('have.text', total);
});

// ════════════════════════════════════════════════════════════════════════════════
// STEP STUBS — implement these as you add your own scenarios
// ════════════════════════════════════════════════════════════════════════════════

// TODO: Add step definitions for your new scenarios below.
// Tips:
//   · Use cy.seedReservation() to create reservations via API before UI tests
//   · Use cy.intercept() to assert on request payloads and response bodies
//   · For conflict testing, seed a reservation first, then try to book the same dates
//   · For group discount, check the GROUP_MIN_ROOMS constant in src/pricing.js


//Example scenario 4: Prevent Duplicated Booking 
Given('an existing reservation exists for room {string} checking in {string} and checking out {string}',
  (roomId: string, checkIn: string, checkOut: string) => {
    cy.seedReservation({
      roomId,
      checkIn,
      checkOut,
      guestName: 'Seeded Guest',
      guestEmail: 'seed@example.com'
    }).then(response => {
      expect(response.status).to.eq(201);
    });
  });


 When('I navigate to Rooms Page and select checking in {string} and checking out {string}',
  (checkIn: string, checkOut: string) => {
   home.visit();
   home.setCheckIn(checkIn);
   home.setCheckOut(checkOut);
});

When('I click Check Availability Button', () => {
  home.ClickCheckAvailability();
});

Then('an error flash containing {string} is shown', (text: string) => {
  home.GetUnavailableMessage().should('contain.text', text);
});




// Example Scenario 5 : Preview price requires mandatory reservation inputs
Given('I am on an uncompleted booking form', () => {
  form.visit();
 });
 When('I Insert Gest name {string} and Gest Email {string} only', (name: string, email: string) => {
  form.fillGuestName(name);
  form.fillGuestEmail(email);
 });
 When('I attempt to preview the price', () => {
  form.ClickPreviewPrice();
 });
 Then('a validation error {string} is displayed', (text: string) => {
  form.getPreviewPriceError().should('contain.text', text);
 }); 

// Example Scenario 6 : Book room 201 (Deluxe) for 3 guests — exactly at capacity
Then('the guest count is reset to be {string}', (value: string) => {
  form.getguestCount().should('have.value', value);
});

Then('the guest count is reset to the fixture count for {string}', (fixtureKey: string) => {
    cy.fixture('guests').then((guests: Record<string, { name: string; email: string; count: number }>) => {
    const guest = guests[fixtureKey];
    // Assert that the guest fixture exists before accessing its properties
    expect(guest, `Guest fixture "${fixtureKey}"`).to.exist;
    form.getguestCount().should('have.value', guest.count.toString());
  });
});

//Example Scenario 7 : Apply WELCOME10 to 2-night Standard stay

When('I fill Promo Code with {string}', (code: string) => {
  form.fillPromoCode(code);
});

When('I fill guest Number {string}', (guestNum: string) => {
  form.fillGuestCount(parseInt(guestNum));
});

Then('I See discount Name {string}', (discountName: string) => {
  form.getdiscountName().should('contain.text', discountName);
});

Then('I  see discount value is {string}', (discountAmount: string) => {
  calc.getPromoDiscount().should('contain.text', discountAmount);
});

//CONFIRMED Reservation shows Cancel + Check In buttons only 

Then('the cancel button is shown in the page', () => {
 detail.getCancelBtn().should("be.visible");
});

Then('the checkIn button is shown in the page', () => {
 detail.getCheckInBtn().should("be.visible");
});

Then('the checkout button should not be shown in the page', () => {
 detail.getCheckOutBtn().should('not.exist');
});


// Example scenario 8:  CHECKED-IN Reservation shows Check Out button only 

When('I checked In the reservation', () => {
  detail.clickCheckIn();
});

Then('the checkOut button should be shown in the page', () => {
  detail.getCheckOutBtn().should('be.visible');
});

Then('the cancel button should not be shown in the page', () => {
 detail.getCancelBtn().should("not.exist");
});

Then('the checkIn button should not be shown in the page', () => {
 detail.getCheckInBtn().should("not.exist");
});

// Example scenario 9: CHECKED-OUT Reservation shows no action buttons

When('I checked Out the reservation', () => {
  detail.clickCheckOut();
});

Then('no action buttons should be shown in the page', () => {
 detail.getCancelBtn().should("not.exist");
 detail.getCheckInBtn().should("not.exist");
 detail.getCheckOutBtn().should('not.exist');
});

//# ── Example scenario 9: Suites require a minimum stay of 3 nights

Then('No reservation is done and the Guest name and Guest Email are reset', () => {
  form.getGuestName().should('contain.text', '');
  form.getGuestEmail().should('contain.text', '');
});

