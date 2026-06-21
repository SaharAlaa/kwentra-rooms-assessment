Feature: Pricing Rules

  # ─── How to read this file ────────────────────────────────────────────────────
  # Two example scenarios are provided. Add your own underneath.

  Background:
    Given I am on the pricing calculator page

  # ── Example scenario 1: simple weeknight rate ─────────────────────────────────
  # Monday 2026-09-07 to Wednesday 2026-09-09 = 2 weeknights, no surcharge
  # Room 101: $120 × 2 = $240 base
  # VAT (10%): $24.00  City tax (5%): $12.00  Grand total: $276.00
  Scenario: Two weeknight stays show correct base rate and tax breakdown
    When I calculate the price for room "101" from "2026-09-07" to "2026-09-09"
    Then the base total is "$240.00"
    And no weekend surcharge is shown
    And the VAT is "$24.00"
    And the city tax is "$12.00"
    And the grand total is "$276.00"

  # ── Example scenario 2: Scenario Outline — rate per room type ────────────────
  # Verifies base rates across all room types for a 1-night weeknight stay.
  # Taxes: VAT 10% + city tax 5% = 15% on top of base rate.
  Scenario Outline: Base rate is correct for each room type
    When I calculate the price for room "<roomId>" from "2026-09-08" to "2026-09-09"
    Then the base total is "<baseTotal>"
    And the grand total is "<grandTotal>"

    Examples:
      | roomId | baseTotal | grandTotal |
      | 101    | $120.00   | $138.00    |
      | 201    | $180.00   | $207.00    |
      | 301    | $300.00   | $345.00    |

  # ════════════════════════════════════════════════════════════════════════════
  # ADD YOUR SCENARIOS BELOW
  # ════════════════════════════════════════════════════════════════════════════


#- Example scenario 3: Weekend surcharge is applied for Friday+Saturday nights
     Scenario: Weekend surcharge is applied for Friday+Saturday nights
     Given I am on the pricing calculator page
     When  I Select Room "101" and Select Dates From "2026-09-26" to "2026-09-28"
     And   I Click on calculate Button
     Then  the weekend surcharge is "+$72.00"
     And   the grand total is "$358.80"

#- Example scenario 4: WELCOME10 promo and  groupBooking together verify correct pricing calculations
              Scenario: WELCOME10 promo and  groupBooking together verify correct pricing calculations
              Given I am on the pricing calculator page
              When  I Select Room "101" and Select Dates From "2026-09-07" to "2026-09-09"
              And   I apply promo code "WELCOME10" 
              And   I enable group booking discount
              When  I Click on calculate Button
              Then  the group discount is "-$32.40"
              And   the promo discount is "-$24.00"
              And   the grand total is "$219.60"

            
#- Example scenario 5: Try Full Options and verify correct pricing calculations
              Scenario: Suite ($300) × 2 nights, Friday+Saturday, WELCOME10, groupBooking
              Given I am on the pricing calculator page
              When  I Select Room "301" and Select Dates From "2026-09-26" to "2026-09-28"
              And   I apply promo code "WELCOME10" 
              And   I enable group booking discount
              When  I Click on calculate Button
              Then  the base total is "$600.00"
              And   the weekend surcharge is "+$180.00"
              And   the group discount is "-$105.30"
              And   the promo discount is "-$78.00"
              And   the room subtotal is "$596.70"
              And   the VAT is "$78.00"
              And   the city tax is "$39.00"
              And   the grand total is "$713.70"

#__________________________________Negative______________________

#- Example scenario 6: SUMMER20 promo requires minimum stay (fails when too short)
            Scenario: SUMMER20 promo requires minimum stay (fails when too short)
            Given I am on the pricing calculator page   
            When  I apply promo code "SUMMER20" and calculate for room "101" from "2026-09-07" to "2026-09-09"
            And   I Click on calculate Button
            Then a promo error is shown containing "Code SUMMER20 requires a minimum stay of 3 nights"

#- Example scenario 7 : Apply Invalid Promo Code 
              Scenario: Verify that the system does't accept Invalid Promo Code
              Given I am on the pricing calculator page
              When  I Select Room "301" and Select Dates From "2026-09-22" to "2026-09-23"
              And   I apply promo code 'INVALID99'
              When  I Click on calculate Button
              Then  a promo error is shown containing "Invalid promo code"     

#- Example scenario 8: Apply Invalid Dates
              Scenario: Verify that the system doesn't accept checkIn date after checkOut date
              Given I am on the pricing calculator page
              When  I Select Room "101" and Select Dates From "2026-08-04" to "2026-08-01"
              And   I Click on calculate Button
              Then  an validation error is shows containing "Invalid date range"
                           

#this Scnario has a bug -- the system accept Case Sensitive Promo Code
#- Example scenario 9  : Promo codes are case-insensitive on the server (try lowercase)
              Scenario: verify that Promo codes are case-insensitive
              Given I am on the pricing calculator page
              When  I Select Room "301" and Select Dates From "2026-09-22" to "2026-09-23"
              And   I apply promo code "welcome10" 
              When  I Click on calculate Button
              Then  no promo discount is applied
              And   the base total is "$300.00"  
              

