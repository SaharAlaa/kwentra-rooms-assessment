import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { HomePage }        from '../../pages/home.page';
import { BookingFormPage } from '../../pages/booking-form.page';
import { ReservationDetailPage } from '../../pages/reservation-detail.page';

const home    = HomePage.Instance;
const form    = BookingFormPage.Instance;
const detail  = ReservationDetailPage.Instance;

// ── Background ─────────────────────────────────────────────────────────────────

Given('the app is in a clean state', () => {
  cy.resetApp();
});

// ── Navigation ─────────────────────────────────────────────────────────────────

Given('I navigate to the booking form for room {string} with check-in {string} and check-out {string}',
  (roomId: string, checkIn: string, checkOut: string) => {
    form.visit(roomId, checkIn, checkOut);
  });

// ── Form interaction ───────────────────────────────────────────────────────────

When('I fill in guest details with name {string}, email {string} and {string} guests',
  (name: string, email: string, count: string) => {
    form.fillGuestName(name);
    form.fillGuestEmail(email);
    form.fillGuestCount(parseInt(count));
  });

When('I click Preview Price', () => {
  form.clickPreview();
});

When('I confirm the booking', () => {
  form.submit();
});

// ── Intercept (example scenario 2) ────────────────────────────────────────────

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
