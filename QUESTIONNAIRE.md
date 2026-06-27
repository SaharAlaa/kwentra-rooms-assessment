# Questionnaire

Fill in your answers below each question. We are looking for structured
thinking, not a single "correct" answer. Explain your reasoning.

---

## Section 1 — Scenario Analysis

**Q1.** Looking at the cancellation policy (three fee tiers + the grace window),
list every distinct test scenario you would cover. For each one, briefly explain
why it is worth testing independently.

Scenario 1 : Cancelling  before check-in is free — Normal case.
Scenario 2 : Cancelling at exactly 72 hours before check-in costs 50% — Checks which side of the 72-hour line the exact value falls on.
Scenario 3 : Cancelling just under 72 hours before check-in costs 50% — Confirms 50% applies a minute inside the line, not just on it.
Scenario 4 : Cancelling at exactly 24 hours before check-in costs 100% — Checks which side of the 24-hour line the exact value falls on.
Scenario 5 : Cancelling just over 24 hours before check-in costs 50% — Confirms 50% still applies a minute outside the 24-hour line.
Scenario 6 : Cancelling just under 24 hours before check-in costs 100% — Confirms the highest fee kicks in right after crossing the line.
Scenario 7 : Cancelling far in advance is free — Simple sanity check for the free tier.
Scenario 8 : Cancelling shortly before check-in costs the full first night — Simple sanity check for the 100% tier.

Grace window scenarios (based on time since booking)

Scenario 1 : Cancelling soon after booking is free, if check-in is still far away — Both conditions true at once, grace window should apply.
Scenario 2 : Booking recently does NOT help if check-in is only 24-72 hours away — Negative check: recent booking alone shouldn't waive the fee.
Scenario 3 : Booking recently does NOT help if check-in is less than 24 hours away — Same idea, against the worst-case fee.
Scenario 4 : Grace window edge — booked exactly 24 hours ago — Checks whether "within the last 24 hours" includes the exact mark.
Scenario 4 : Free cancellation still works for old bookings — Confirms the normal free rule works without the grace window.



**Q2.** The pricing engine takes four inputs that interact with each other:
room type, date range (which nights are weekends?), promo code, and group
booking flag. You cannot realistically test every combination.

How would you decide which combinations to prioritise? Describe your approach.

> Your answer:
1. Partition each input first
Room type: Standard / Deluxe / Suite (  price and min-stay and guest number are differ)
Date range: all-weekday / all-weekend / mixed 
Promo: none / valid / valid-but-below-minimum stay / invalid 
Group flag: on / off 
2. Add risk-based combinations on top 
Test pairs of inputs together, not all four at once. Most bugs happen when two rules clash with each other,like promo+group (order matters: group applies after promo), Suite+min-stay, promo at its exact minimum stay .So I'd cover every pair of values at least once, instead of every possible four-way combination.

---

**Q3.** Pick the three flows you would prioritise for automated regression and
rank them by risk (highest first). Justify each ranking in one or two sentences.

> Your answer:

1. Pricing calculation (highest risk)
Justify: The pricing formula is the core business logic and combines surcharge, promo, group discount, and tax order. A mistake here directly affects revenue and customer trust, so it should be guarded first.

2. Booking validation (double-booking, guest limits, min-stay)
Justify: Validation stops invalid reservations from being created. If this fails, the system can accept bad bookings or allow conflicting room assignments, causing data corruption and customer disruption.

3. Cancellation fee + state transitions
Justify: Cancellation behaviour depends on time and reservation state, so it is both complex and sensitive. Errors here can lead to incorrect fees or invalid state flows like cancelling checked-in reservations.

## Section 2 — Test Design

**Q4.** Define the equivalence partitions and boundary values for the
**guest count** field on the booking form. Consider each room type separately
where relevant.

> Your answer:
```
| Room Type | Max Guests | Partition                | Value   | Expected Result                  |
|-----------|------------|---------------------------|---------|---------------------------------|
| Standard  | 2          | Invalid — too low         | 0       | Rejected                        |
| Standard  | 2          | Invalid — too low         | -1      | Rejected                        |
| Standard  | 2          | Valid — lower edge        | 1       | Accepted                        |
| Standard  | 2          | Valid — upper edge        | 2       | Accepted                        |
| Standard  | 2          | Invalid — just over max   | 3       | Rejected                        |
| Standard  | 2          | Invalid — well over max   | 10      | Rejected                        |
| Deluxe    | 3          | Invalid — too low         | 0       | Rejected                        |
| Deluxe    | 3          | Valid — lower edge        | 1       | Accepted                        |
| Deluxe    | 3          | Valid — interior          | 2       | Accepted                        |
| Deluxe    | 3          | Valid — upper edge        | 3       | Accepted                        |
| Deluxe    | 3          | Invalid — just over max   | 4       | Rejected                        |
| Deluxe    | 3          | Invalid — well over max   | 10      | Rejected                        |
| Suite     | 4          | Invalid — too low         | 0       | Rejected                        |
| Suite     | 4          | Valid — lower edge        | 1       | Accepted                        |
| Suite     | 4          | Valid — interior          | 2-3     | Accepted                        |
| Suite     | 4          | Valid — upper edge        | 4       | Accepted                        |
| Suite     | 4          | Invalid — just over max   | 5       | Rejected                        |
| Suite     | 4          | Invalid — well over max   | 10      | Rejected                        |



**Q5.** Draw (or describe in text) a decision table for the cancellation fee
calculation. Your table should cover all combinations of:
- Hours since booking (≤24 h / >24 h)
- Hours until check-in (≤24 h / 24–72 h / >72 h)

> Your answer:
## Q5 Answer: Cancellation Fee Decision Table
+---+-----------+------------+------------+--------------------------------------------+
| # | Booked    | Check-in   | Fee        | Summary                                    |
+---+-----------+------------+------------+--------------------------------------------+
| 1 | ≤24h      | ≤24h       | 100% Night | Too close to check-in; no grace window     |
+---+-----------+------------+------------+--------------------------------------------+
| 2 | ≤24h      | 24-72h     | 50% Night  | Under 72h to check-in; no grace window     |
+---+-----------+------------+------------+--------------------------------------------+
| 3 | ≤24h      | >72h       | Free       | Grace window: booked recently & far away   |
+---+-----------+------------+------------+--------------------------------------------+
| 4 | >24h      | ≤24h       | 100% Night | Standard peak fee for late cancellation    |
+---+-----------+------------+------------+--------------------------------------------+
| 5 | >24h      | 24-72h     | 50% Night  | Standard mid fee for mid-term cancellation |
+---+-----------+------------+------------+--------------------------------------------+
| 6 | >24h      | >72h       | Free       | Standard free cancellation (early notice)  |
+---+-----------+------------+------------+--------------------------------------------+
---

**Q6.** The SUMMER20 promo code requires a minimum stay of 3 nights.
List all boundary and edge cases you would test around this rule.

> Your answer:
```text
+----+----------------------------+-------+--------------------+-------------------------------------------+
| #  | Case                       |Nights | Code               | Expected Result                           |
+----+----------------------------+-------+--------------------+-------------------------------------------+
| 1  | Below minimum              | 1     | SUMMER20           | Rejected — error shown, no discount       |
| 2  | Just below minimum         | 2     | SUMMER20           | Rejected — error shown, no discount       |
| 3  | Exactly at minimum         | 3     | SUMMER20           | Accepted — 20% discount applied           |
| 4  | Just above minimum         | 4     | SUMMER20           | Accepted — 20% discount applied           |
| 5  | Well above minimum         | 10    | SUMMER20           | Accepted — 20% discount applied           |
| 6  | Case-insensitive boundary  | 3     | summer20           | Accepted — 20% discount applied           |
| 7  | Case-insensitive below     | 2     | summer20           | Rejected — error shown                    |
| 8  | Wrong code, valid nights   | 3     | INVALIDCODE        | Rejected — invalid code error             |
| 9  | Valid code, wrong promo    | 1     | SUMMER20           | Rejected — SUMMER20's minimum enforced    |
| 10 | Code minimum < Room minimum| 2     | SUMMER20 on Suite  | Rejected for SUMMER20 (needs 3 nights)    |
| 11 | Both minimums satisfied    | 3     | SUMMER20 on Suite  | Accepted — both rules satisfied           |
+----+----------------------------+-------+--------------------+-------------------------------------------+

```

---

## Section 3 — Technical Judgment

**Q7.** After you push your tests to CI, the booking availability-conflict test
fails intermittently — it passes 7 out of 10 runs. The test books room 101,
then tries to book the same dates again and expects a conflict error.

List at least three possible root causes and describe how you would investigate
each one.

> Your answer:
Cause 1: Race condition between the two booking requests
If the test fires the second booking request before the first one has actually been persisted , the second request might hit the server before the first reservation exists in the database — so no conflict is detected.
Investigation: Check whether the test explicitly waits for the first booking's response (cy.wait('@createReservation') or asserting on the response status) before firing the second request. 

Cause 2: Leftover data from a previous test run
If cy.resetApp() or the per-test seed/cleanup isn't fully reliable, room 101 might already have an existing reservation from a previous test (in the same run or a previous CI run) with dates that don't quite line up — making the "conflict" check pass or fail depending on what's already in the database when this test starts.
Investigation: Run the test in isolation, repeatedly, with explicit reset before each run, and check whether the flake disappears.


Cause 3: Test execution order / parallel CI workers
If CI runs spec files in parallel and another suite (e.g.cancellation tests) also touches room 101 around the same time, that external reservation could get cancelled/deleted mid-test by the other suite, removing the conflict this test expects to find.
Investigation: Makeing sure Thread Isolations is implemented right 
###################
#Explaination
If you tried to run tests in parallel right now:
Say you had 3 test runners going at once, all hitting http://localhost:3000. They'd all be reading and writing to the exact same in-memory data at the exact same time. One test resetting the app, seeding a reservation, or cancelling something would instantly affect what every other test sees — because there's no real separation between them. It's the same server, same memory, same data, just multiple tests pulling and pushing on it simultaneously.
The fix, conceptually:
Instead of having one server that everyone shares, you start up several independent copies of the same server — same code, same behavior, just multiple separate running instances. Each one gets its own address (like localhost:3000, localhost:3001, localhost:3002), and crucially, each one has its own separate memory — completely disconnected from the others.

---

**Q8.** The cancellation fee tests depend on "current time" relative to
check-in. Describe two different technical approaches to controlling time in
these tests, and explain the trade-offs of each.

> Your answer:
Approach 1: Server-side time override via the X-Current-Time header (controls "now" at cancellation)
Approach 2: Controlling booking time via createdAt on reservation creation
The reservation API accepts a createdAt field to override the booking timestamp at creation time, instead of using the real moment the API call was made.so I Can create records with past dates then trying to Cancelling with diff cancelations dates.

---

**Q9.** You need to verify that the pricing grand total displayed in the UI
exactly matches the value calculated by the server. How would you structure
this test to make it robust and maintainable as business rules change?

> Your answer:
I will use API interception to see the response of the API wheather matches the UI values or not 
---

## Section 4 — Strategy

**Q10.** You have 2 hours left in the sprint and your test suite for this
application is only 30% complete. How do you decide which scenarios to
implement first? Walk through your decision-making process.

> Your answer:
With 2 hours left, I'd stop thinking about "what's left on the list" and start thinking purely in terms of risk × likelihood of breakage, since that's what actually protects the release.
Step 1 — Triage by business impact, not by feature list order
Highest priority --> money correctness. Pricing calculation (surcharge → promo → group → tax order) gets tested first. 
Second -->  data integrity. Booking validation (double-booking, guest limits) — this prevents bad data from existing at all
Third --> state correctness. Cancellation fee tiers and the state machine (can't cancel a checked-in reservation, etc.) 

---

**Q11.** A developer tells you they refactored the pricing engine and "nothing
changed, just cleaner code." What would you do before accepting that claim?

> Your answer:
I wouldn't take the claim at face value — refactors are exactly where silent behavior changes happen, especially in an order-sensitive formula like this.So will do the following

1. Runing the existing regression suite as-is against the refactored code first. Green is a good sign, but only proves the tested paths are unchanged.
2. Diff actual output, not code. Run the same inputs through old and new versions and compare the numbers directly — code that "looks equivalent" can still produce different results due to rounding or reordering.
3. Specifically re-check what refactors tend to break silently:
   - Order of operations (surcharge → promo → group → tax)
   - Boundary conditions (> accidentally becoming >=)
4. Only sign off once tests pass on the new code AND I've confirmed the suite actually covers the formula's edge cases — not just the happy path.

**Q12.** How would you structure the test data and test isolation strategy so
that all three feature suites (booking, pricing, cancellation) can run safely
in parallel without interfering with each other?

> Your answer:

1. Use strong isolation for every spec
- Each test should start with a clean backend state via cy.resetApp() or equivalent.
2. Each scenario must be independent 
- Do not depend on any reservation created by a previous scenario or spec.
3. Making Sure Thread isolation works properly btween the threads to aviod shared resources issues may happens 


