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
