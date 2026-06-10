Feature: Room Booking

  # ─── How to read this file ────────────────────────────────────────────────────
  # Two example scenarios are provided below to show you the expected style and
  # level of detail. Read them, then add your own scenarios underneath.
  #

  Background:
    Given the app is in a clean state

  # ── Example scenario 1: happy path ────────────────────────────────────────────
  Scenario: Successfully book a standard room for two weeknight stays
    Given I navigate to the booking form for room "101" with check-in "2026-09-01" and check-out "2026-09-03"
    When I fill in guest details with name "Jane Smith", email "jane@example.com" and "2" guests
    And I click Preview Price
    Then the price preview shows "2" nights at "$120.00" per night
    And the preview grand total is "$276.00"
    When I confirm the booking
    Then I am on the reservation detail page
    And the reservation status is "Confirmed"
    And the guest name shown is "Jane Smith"
    And the grand total shown is "$276.00"

  # ── Example scenario 2: booking form intercept ────────────────────────────────
  # This scenario demonstrates cy.intercept() — the preview API call is
  # intercepted and its response body is verified before the form is submitted.
  Scenario: Booking form calls the pricing API with correct parameters
    Given I navigate to the booking form for room "201" with check-in "2026-09-05" and check-out "2026-09-08"
    When I fill in guest details with name "Bob Allen", email "bob@example.com" and "2" guests
    And I intercept the pricing API call
    And I click Preview Price
    Then the intercepted pricing request body contains roomId "201", checkIn "2026-09-05", checkOut "2026-09-08"
    And the API response nights count is "3"

  # ════════════════════════════════════════════════════════════════════════════
  # ADD YOUR SCENARIOS BELOW
  # ════════════════════════════════════════════════════════════════════════════
