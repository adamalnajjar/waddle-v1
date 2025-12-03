# Waddle v2 - Q&A Log

> Project-specific questions and answers for future reference.

---

## December 3rd, 2025 - Scope Update

### Registration & Profile

**Q: Should I add username and date_of_birth fields to the user model?**
> A: Yes

**Q: Is the selfie upload a profile photo or identity verification (KYC)?**
> A: Profile photo

**Q: Should development competency be a dropdown or free text?**
> A: Dropdown (Beginner/Intermediate/Advanced/Senior)

---

### Problem Submission

**Q: Does the new problem submission flow replace the existing questionnaire?**
> A: Yes, it replaces it for now. We might circle back to the full AI implementation in the future.

**Q: Should technologies be seeded in the database or hardcoded?**
> A: Seed them in the database. This allows updating them on the backend.

**Q: What is the submission fee structure?**
> A: Fixed base of 5 tokens, scaling up to 10 tokens maximum based on context provided (character count, images uploaded, etc.)

**Q: What happens if no consultant accepts within the response window?**
> A: Consultants have 24 hours to respond. If no one accepts, the user gets a full refund of the submission fee.

---

### Admin Matching

**Q: Does the new admin-driven flow replace or supplement the automated matching algorithm?**
> A: The algorithm provides suggestions, but the admin makes the final decision.

---

### Consultant Work

**Q: How do consultants arrange calls after accepting work?**
> A: Built-in calendar/scheduling system.

**Q: Who pays for surge pricing - user or Waddle?**
> A: Waddle absorbs the extra cost. User pays normal rate.

---

### Scope

**Q: Can consultants also be users (submit their own problems)?**
> A: No, they would have to create another user account to do this.

**Q: Do saved drafts expire?**
> A: Yes, drafts expire after 2 weeks.

---

## Previous Decisions

### UI/Design (December 3rd, 2025)

**Q: What logo should be used?**
> A: Custom duck logo provided by user (waddle-logo.svg)

**Q: What color scheme?**
> A: Light blue/yellow/orange range with dark blue night theme for dark mode

**Q: Should we show consultants on the homepage?**
> A: Not at this point. This could change in the future.

---

## Technical Clarifications

### Zoom Integration

**Q: Is Zoom a blocker for deploying the UI?**
> A: No. Zoom is only needed when users actually start video calls. The UI can be deployed without Zoom configured.

---

*Add new Q&A entries as decisions are made throughout development.*

