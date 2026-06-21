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
    Given a confirmed reservation exists for room "101" checking in "2026-06-22" and checking out "2026-06-24"
    And the cancel request will use current time "2026-10-19T10:00:00Z"
    When I visit the reservation detail page
    And I click Cancel Reservation
    Then the cancellation confirmation panel is visible
    And the cancellation fee displayed is "$60.00"
    And the policy text mentions "50%"
    When I confirm the cancellation
   
    
    

  # ════════════════════════════════════════════════════════════════════════════
  # ADD YOUR SCENARIOS BELOW
  # ════════════════════════════════════════════════════════════════════════════

#Positive
Scenario: Cancelling 24 h before check-in incurs Fee = 50% of first night's base rate
    Given a confirmed reservation exists for room "102" checking in "2026-09-01" and checking out "2026-09-03"
    When the reservation is cancelled at "2026-08-31T10:00:00Z"
    Then the cancellation fee returned is "$60.00"
    And the cancellation policy mentions "50% of first-night rate (24–72 h before check-in)"
    And the reservation status is now "cancelled"

Scenario: Cancelling <24 h before check-in incurs Fee = 100% of first night's base rate
    Given a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03" 
    When the reservation is cancelled at "2026-09-01T10:00:00Z"
    Then the cancellation fee returned is "$180.00"
    And the cancellation policy mentions "Full first-night rate (<24 h before check-in)"
    And the reservation status is now "cancelled"

Scenario: Cancel within 24 h of booking AND check-in is > 72 h away (grace window)
    Given a confirmed reservation exists for room "202" checking in "2026-06-30" and checking out "2026-07-02" and createdAt "2026-06-25T08:00:00Z"
    When the reservation is cancelled at "2026-06-25T12:00:00Z"
    Then the cancellation fee returned is "$0.00"
    And the cancellation policy mentions "Free cancellation (booked within 24 h, check-in >72 h away)"
    And the reservation status is now "cancelled"


#Negative

Scenario: Attempt to cancel a checkedIn reservation
    Given a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03"
    When I navigate to the reservation detail page for the Confirmed reservation
    And  I click on checkIn Button
    And the reservation is cancelled at "2026-09-01T10:00:00Z"
    Then An Error Message "Cannot cancel status \"checked-in\"" is returned in Cancel API response
     
Scenario: Attempt to cancel a checkedOut reservation
    Given a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03"
    When I navigate to the reservation detail page for the Confirmed reservation
    And  I click on checkIn Button
    And  I click on checkOut Button
    And the reservation is cancelled at "2026-09-01T10:00:00Z"
    Then An Error Message "Cannot cancel status \"checked-out\"" is returned in Cancel API response

Scenario: Attempt to cancel an already-cancelled res
    Given a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03"
    When the reservation is cancelled at "2026-08-31T10:00:00Z"
    And  the reservation is cancelled at "2026-09-01T10:00:00Z"
    Then An Error Message "Cannot cancel status \"cancelled\"" is returned in Cancel API response

Scenario: A cancelled reservation frees the dates — the same room can be re-booked
    Given a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03"
    When the reservation is cancelled at "2026-08-31T10:00:00Z"
    And a confirmed reservation exists for room "202" checking in "2026-09-01" and checking out "2026-09-03"
    When I visit the reservation detail page
    Then the reservation status on the page is "Confirmed"
    And the guest name shown is "Test Guest"
    And the guest email shown is "test@example.com"
    And the guest count shown is "1"
    And the room name shown is "Room 202"
    And the checkIn is shown "2026-09-01"
    And the checkOut is shown "2026-09-03"
  