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
  # ═══════════════════════════════════════════════════════════════════════════


#- Example Scenario 3 : Apply WELCOME10 to 2-night standard and Deluxe room types
    Scenario Outline: Applying Promo Code on room "<roomId>" and Verifies the Price calculations
    Given I navigate to the booking form for room "<roomId>" with check-in "2026-09-01" and check-out "2026-09-03"
    When  I fill in guest details with name "Jane Smith", email "jane@example.com" and "2" guests
    And   I fill Promo Code with "WELCOME10"
    When  I click Preview Price
    Then  I See discount Name "Welcome Discount (10%)" 
    And   I  see discount value is "<PromoDiscount>"
    When  I confirm the booking
    Then  I am on the reservation detail page
    And the reservation status is "Confirmed"
    And the guest name shown is "Jane Smith"
    And the grand total shown is "<grandTotal>"

    Examples:
      | roomId | PromoDiscount | grandTotal |
      | 101    | -$24.00       | $252.00    |   
      | 102    | -$24.00       | $252.00    |
      | 201    | -$36.00       | $378.00    |
      | 202    | -$36.00       | $378.00    |     


# ── Example scenario 4: Prevent Duplicated Booking 
      Scenario: Cannot double-book a room that already has a reservation
      Given an existing reservation exists for room "101" checking in "2026-09-10" and checking out "2026-09-12"
      When I navigate to Rooms Page and select checking in "2026-09-10" and checking out "2026-09-12"
      And I click Check Availability Button
      Then an error flash containing "Unavailable" is shown


# - Example Scenario 5 : Preview price requires mandatory reservation inputs
    Scenario: Preview price requires mandatory reservation inputs
    Given I am on an uncompleted booking form
    When  I Insert Gest name "MAHA" and Gest Email "maha@gmail.com" only 
    And   I attempt to preview the price
    Then  a validation error "Please select a room and dates first." is displayed


#- Example Scenario 6 : Book room 201 for 4 guests — exceeds 3-guest max
    Scenario: Dis-ability to Book room with more than it's Max Capacity
    Given I navigate to the booking form for room "201" with check-in "2026-09-01" and check-out "2026-09-03"
    When I fill in guest details with name "Jane Smith", email "jane@example.com" and "4" guests
    And I click Preview Price
    Then the price preview shows "2" nights at "$360.00" per night
    And the preview grand total is "$414.00"
    When I confirm the booking
    Then the guest count is reset to be "1"



# ── Example scenario 7: CONFIRMED Reservation shows Cancel + Check In buttons only 
    Scenario: CONFIRMED Reservation shows Cancel + Check In buttons only
    Given I navigate to the booking form for room "101" with check-in "2026-09-01" and check-out "2026-09-03"
    When I fill in guest details with name "Jane Smith", email "jane@example.com" and "2" guests
    And I click Preview Price
    Then the price preview shows "2" nights at "$120.00" per night
    And the preview grand total is "$276.00"
    When I confirm the booking
    Then I am on the reservation detail page
    And the cancel button is shown in the page 
    And the checkIn button is shown in the page
    And the checkout button should not be shown in the page


# ── Example scenario 8:  CHECKED-IN Reservation shows Check Out button only 
    Scenario: CHECKED-IN Reservation shows Check Out button only 
    Given I navigate to the booking form for room "101" with check-in "2026-09-01" and check-out "2026-09-03"
    When  I fill in guest details with name "Jane Smith", email "jane@example.com" and "2" guests
    And   I click Preview Price
    Then  the price preview shows "2" nights at "$120.00" per night
    And   the preview grand total is "$276.00"
    When  I confirm the booking
    Then  I am on the reservation detail page
    When  I checked In the reservation
    Then  the checkOut button should be shown in the page
    And   the cancel button should not be shown in the page
    And   the checkIn button should not be shown in the page


# ── Example scenario 9 : Suites require a minimum stay of 3 nights
 Scenario: Suites require a minimum stay of 3 nights - try 2 nights
    Given I navigate to the booking form for room "301" with check-in "2026-09-01" and check-out "2026-09-03"
    When  I fill in guest details with name "Jane Smith", email "jane@example.com" and "2" guests
    And   I confirm the booking
    Then  No reservation is done and the Guest name and Guest Email are reset

