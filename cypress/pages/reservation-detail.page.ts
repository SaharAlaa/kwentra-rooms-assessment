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
    throw new Error('Not implemented');
  }

  // TODO: implement getStatus()
  // Returns the Cypress chainable for the status badge element
  getStatus() {
    throw new Error('Not implemented');
  }

  // TODO: implement getGrandTotal()
  // Returns the Cypress chainable for the grand total element
  getGrandTotal() {
    throw new Error('Not implemented');
  }

  // TODO: implement getCancellationFee()
  // Returns the Cypress chainable for the cancellation fee element inside the confirm panel
  getCancellationFee() {
    throw new Error('Not implemented');
  }

  // TODO: implement getCancellationPolicy()
  getCancellationPolicy() {
    throw new Error('Not implemented');
  }

  // TODO: implement openCancelPanel()
  // Clicks "Cancel Reservation" and waits for the confirmation panel to appear
  openCancelPanel() {
    throw new Error('Not implemented');
  }

  // TODO: implement confirmCancel()
  // Clicks "Yes, Cancel" inside the confirmation panel
  confirmCancel() {
    throw new Error('Not implemented');
  }

  // TODO: implement abortCancel()
  // Clicks "Keep Reservation" — panel should hide and cancel-btn should reappear
  abortCancel() {
    throw new Error('Not implemented');
  }

  // TODO: implement clickCheckIn()
  clickCheckIn() {
    throw new Error('Not implemented');
  }

  // TODO: implement clickCheckOut()
  clickCheckOut() {
    throw new Error('Not implemented');
  }

  // TODO: implement getFlashMessage()
  getFlashMessage() {
    throw new Error('Not implemented');
  }

  // TODO: add any additional helper methods you find useful
}
