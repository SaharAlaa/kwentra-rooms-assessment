// ─────────────────────────────────────────────────────────────────────────────
// ReservationDetailPage  ·  PAGE OBJECT TO IMPLEMENT
// ─────────────────────────────────────────────────────────────────────────────
//
// This is the only page object you need to complete.
// The other three (HomePage, BookingFormPage, PricingCalculatorPage) are
// already implemented as reference examples.
//
// This page represents /reservations/:id — the reservation detail view.
// It is the most state-driven page in the app:
//
//   ┌──────────────────────────────────────────────────────────┐
//   │  CONFIRMED   →  shows Cancel + Check In buttons          │
//   │  CHECKED-IN  →  shows Check Out button only              │
//   │  CANCELLED   →  no action buttons                        │
//   │  CHECKED-OUT →  no action buttons                        │
//   └──────────────────────────────────────────────────────────┘
//
// When the tester clicks "Cancel Reservation", a confirmation panel slides in
// showing the cancellation fee and policy. The tester must click "Yes, Cancel"
// to confirm — or "Keep Reservation" to abort.
//
// Available data-cy selectors on this page:
//
//   [data-cy=res-id-heading]       — reservation ID text (e.g. "RES-AB12CD34")
//   [data-cy=res-status]           — status badge text
//   [data-cy=guest-name]           — guest's full name
//   [data-cy=guest-email]          — guest's email
//   [data-cy=guest-count]          — number of guests (numeric string)
//   [data-cy=room-name]            — room name (e.g. "Room 101")
//   [data-cy=room-type]            — room type (e.g. "Standard")
//   [data-cy=check-in-date]        — check-in date string (YYYY-MM-DD)
//   [data-cy=check-out-date]       — check-out date string
//   [data-cy=nights-count]         — number of nights (numeric string)
//   [data-cy=grand-total]          — grand total with $ prefix (e.g. "$276.00")
//   [data-cy=applied-promo]        — promo code applied (only present when used)
//   [data-cy=pricing-base-total]
//   [data-cy=pricing-weekend-surcharge]
//   [data-cy=pricing-promo-discount]
//   [data-cy=pricing-group-discount]
//   [data-cy=pricing-room-subtotal]
//   [data-cy=pricing-vat]
//   [data-cy=pricing-city-tax]
//
//   [data-cy=cancel-btn]           — "Cancel Reservation" button (confirmed only)
//   [data-cy=cancel-confirm-section] — confirmation panel (hidden until cancel-btn clicked)
//   [data-cy=cancellation-policy]  — policy text inside the panel
//   [data-cy=cancellation-fee]     — fee amount inside the panel (e.g. "$60.00")
//   [data-cy=confirm-cancel-btn]   — "Yes, Cancel" inside the panel
//   [data-cy=abort-cancel-btn]     — "Keep Reservation" inside the panel
//   [data-cy=checkin-btn]          — "Check In" button (confirmed only)
//   [data-cy=checkout-btn]         — "Check Out" button (checked-in only)
//   [data-cy=flash-message]        — success/error flash after an action
//
// ─────────────────────────────────────────────────────────────────────────────

export class ReservationDetailPage {
  private static _instance: ReservationDetailPage;
  static get Instance() { return (this._instance ??= new ReservationDetailPage()); }

  // TODO: implement visit(id)
  // Navigate to /reservations/:id
  visit(id: string) {
    cy.visit(`/reservations/${id}`);
  }

  // TODO: implement getStatus()
  // Returns the Cypress chainable for the status badge element
  getStatus() {
    return cy.get('[data-cy=res-status]');
  }

  // TODO: implement getGrandTotal()
  // Returns the Cypress chainable for the grand total element
  getGrandTotal() {
      return cy.get('[data-cy=grand-total]');
  }

  // TODO: implement getCancellationFee()
  // Returns the Cypress chainable for the cancellation fee element inside the confirm panel
  getCancellationFee() {
     return cy.get('[data-cy=cancellation-fee]');
  }

  // TODO: implement getCancellationPolicy()
  getCancellationPolicy() {
    return cy.get('[data-cy=cancellation-policy]');
  }

  // TODO: implement openCancelPanel()
  // Clicks "Cancel Reservation" and waits for the confirmation panel to appear

   openCancelPanel() {
   return cy.get('[data-cy=cancel-btn]').should('be.visible').click();
  }

  // TODO: implement confirmCancel()
  // Clicks "Yes, Cancel" inside the confirmation panel
  confirmCancel() {
    return cy.get('[data-cy=confirm-cancel-btn]').should('be.visible').click();
  }

  // TODO: implement abortCancel()
  // Clicks "Keep Reservation" — panel should hide and cancel-btn should reappear
  abortCancel() {
    return cy.get('[data-cy=abort-cancel-btn]').should('be.visible').click();
  }

  // TODO: implement clickCheckIn()
  clickCheckIn() {
     return cy.get('[data-cy=checkin-btn]').should('be.visible').click();
  }

  // TODO: implement clickCheckOut()
  clickCheckOut() {
    return cy.get('[data-cy=checkout-btn]').should('be.visible').click();
  
  }

  // TODO: implement getFlashMessage()
  getFlashMessage() {
    return cy.get('[data-cy=flash-message]');
  }


  // TODO: add any additional helper methods you find useful
  getCancelBtn(){
    return cy.get('[data-cy=cancel-btn]');
  };

  getCheckInBtn(){
    return cy.get('[data-cy=checkin-btn]');
  };
  
   getCheckOutBtn(){
    return cy.get('[data-cy=checkout-btn]');
  };
  getReservationId(){
    return cy.get('[data-cy="res-id-heading"]');
  };
  getGuestName(){
    return cy.get('[data-cy="guest-name"]');
  }
  getGuestEmail(){
    return cy.get('[data-cy="guest-email"]');
  }
  getGuestCount(){
    return cy.get('[data-cy="guest-count"]');
  }
  getRoomName(){
    return cy.get('[data-cy="room-name"]');
  }
  getRoomType(){
    return cy.get('[data-cy="room-type"]');
  }
  getCheckInDate(){
    return cy.get('[data-cy="check-in-date"]');
  }
  getCheckOutDate(){
    return cy.get('[data-cy="check-out-date"]');
  }
  
 
}


