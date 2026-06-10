Feature: Reservation Cancellation

  # ─── How to read this file ────────────────────────────────────────────────────
  # Two example scenarios are provided. Add your own underneath.
  #
  # The cancellation policy has three fee tiers based on how many hours remain
  # before check-in at the time of cancellation:
  #
  #   > 72 h  →  free cancellation
  #   24–72 h →  50% of the first night's base rate
  #   < 24 h  →  100% of the first night's base rate
  #
  # There is also a grace window:
  #   Booked within the last 24 h AND check-in is still > 72 h away → free
  #
  # Key technique: the server accepts an X-Current-Time header that overrides
  # "now" for all time-based calculations. Use cy.intercept() to inject this
  # header into the cancel request so you can test each fee tier without
  # waiting for real time to pass.

  Background:
    Given the app is in a clean state

  # ── Example scenario 1: free cancellation via API ────────────────────────────
  # Seeds a reservation with check-in 10 days from now, then cancels it
  # more than 72 h before check-in → expects $0 fee.
  #
  # Note: this test uses cy.seedReservation() (API) + cy.cancelReservationViaAPI()
  # with an X-Current-Time header — no UI interaction needed for the cancel itself.
  Scenario: Cancelling more than 72 hours before check-in incurs no fee
    Given a confirmed reservation exists for room "101" checking in "2026-10-20" and checking out "2026-10-22"
    When the reservation is cancelled at "2026-10-17T10:00:00Z"
    Then the cancellation fee returned is "$0.00"
    And the cancellation policy mentions "Free cancellation"
    And the reservation status is now "cancelled"

  # ── Example scenario 2: UI cancel panel shows correct fee ────────────────────
  # Verifies the UI shows the right fee in the confirmation panel before
  # the user clicks "Yes, Cancel". The cancel POST is intercepted to inject
  # X-Current-Time so the server sees the correct window.
  #
  # Room 101: $120/night. 50% of first night = $60.00
  Scenario: Cancel panel displays the 50% fee when cancelling 24–72 hours before check-in
    Given a confirmed reservation exists for room "101" checking in "2026-10-20" and checking out "2026-10-22"
    And the cancel request will use current time "2026-10-19T10:00:00Z"
    When I visit the reservation detail page
    And I click Cancel Reservation
    Then the cancellation confirmation panel is visible
    And the cancellation fee displayed is "$60.00"
    And the policy text mentions "50%"

  # ════════════════════════════════════════════════════════════════════════════
  # ADD YOUR SCENARIOS BELOW
  # ════════════════════════════════════════════════════════════════════════════
