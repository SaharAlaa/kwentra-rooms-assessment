# Questionnaire

Fill in your answers below each question. We are looking for structured
thinking, not a single "correct" answer. Explain your reasoning.

---

## Section 1 — Scenario Analysis

**Q1.** Looking at the cancellation policy (three fee tiers + the grace window),
list every distinct test scenario you would cover. For each one, briefly explain
why it is worth testing independently.

> Your answer:

---

**Q2.** The pricing engine takes four inputs that interact with each other:
room type, date range (which nights are weekends?), promo code, and group
booking flag. You cannot realistically test every combination.

How would you decide which combinations to prioritise? Describe your approach.

> Your answer:

---

**Q3.** Pick the three flows you would prioritise for automated regression and
rank them by risk (highest first). Justify each ranking in one or two sentences.

> Your answer:

---

## Section 2 — Test Design

**Q4.** Define the equivalence partitions and boundary values for the
**guest count** field on the booking form. Consider each room type separately
where relevant.

> Your answer:

---

**Q5.** Draw (or describe in text) a decision table for the cancellation fee
calculation. Your table should cover all combinations of:
- Hours since booking (≤24 h / >24 h)
- Hours until check-in (≤24 h / 24–72 h / >72 h)

> Your answer:

---

**Q6.** The SUMMER20 promo code requires a minimum stay of 3 nights.
List all boundary and edge cases you would test around this rule.

> Your answer:

---

## Section 3 — Technical Judgment

**Q7.** After you push your tests to CI, the booking availability-conflict test
fails intermittently — it passes 7 out of 10 runs. The test books room 101,
then tries to book the same dates again and expects a conflict error.

List at least three possible root causes and describe how you would investigate
each one.

> Your answer:

---

**Q8.** The cancellation fee tests depend on "current time" relative to
check-in. Describe two different technical approaches to controlling time in
these tests, and explain the trade-offs of each.

> Your answer:

---

**Q9.** You need to verify that the pricing grand total displayed in the UI
exactly matches the value calculated by the server. How would you structure
this test to make it robust and maintainable as business rules change?

> Your answer:

---

## Section 4 — Strategy

**Q10.** You have 2 hours left in the sprint and your test suite for this
application is only 30% complete. How do you decide which scenarios to
implement first? Walk through your decision-making process.

> Your answer:

---

**Q11.** A developer tells you they refactored the pricing engine and "nothing
changed, just cleaner code." What would you do before accepting that claim?

> Your answer:

---

**Q12.** How would you structure the test data and test isolation strategy so
that all three feature suites (booking, pricing, cancellation) can run safely
in parallel without interfering with each other?

> Your answer:

---
