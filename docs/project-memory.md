# Waddle v2 - Project Memory

> Quick reference for critical requirements. Review before making changes.

---

## ✅ MUST DO

### Registration & Profile
- [x] Collect username (unique) during registration
- [x] Collect date of birth during registration
- [ ] Require profile completion after registration (selfie, bio, competency)
- [ ] Development competency must be a DROPDOWN (Beginner/Intermediate/Advanced/Senior)
- [ ] Profile photo upload (selfie)

### Problem Submission
- [ ] Problem statement field (required)
- [ ] Error description field (paste errors, AI output, or write details)
- [ ] File attachments support
- [ ] Technology pills from seeded database
- [ ] "Load More" for additional technologies (paginated, 10 at a time)
- [ ] Custom technology input for unlisted tech
- [ ] Submission fee: 5-10 tokens (scales with content)
- [ ] Save draft functionality
- [ ] Drafts expire after 2 weeks

### Token & Submission
- [ ] Check token balance before submit
- [ ] Show purchase modal if insufficient tokens
- [ ] Don't lose context if modal closed
- [ ] Submission fee charged ONCE per submission (not re-charged on consultant pass)

### Matching & Invitations
- [ ] Algorithm suggests consultants, admin decides
- [ ] Admin can invite single consultant OR mass invite
- [ ] Consultants have 24 hours to respond
- [ ] Full refund if no consultant accepts within 24 hours

### Consultant Features
- [ ] Admin flags users as consultants (not self-signup)
- [ ] Consultant profile completion prompt on first login after flagging
- [ ] "My Work" area with invitations, history, calendar
- [ ] Notification hours (active hours) settings
- [ ] Surge pricing opt-in toggle

### Surge Pricing
- [ ] 1.2x pay for consultants on surge work
- [ ] Waddle absorbs extra cost (user pays normal rate)
- [ ] Only notify opted-in consultants outside their hours

---

## ❌ MUST NOT DO

### User Accounts
- ❌ Never allow consultants to submit problems on their consultant account
- ❌ Never skip profile completion step for new users
- ❌ Never allow duplicate usernames

### Pricing & Tokens
- ❌ Never charge submission fee more than once per problem
- ❌ Never exceed 10 token max for submission fee
- ❌ Never go below 5 token minimum for submission fee
- ❌ Never charge user extra for surge pricing (Waddle absorbs)

### Matching
- ❌ Never auto-match without admin approval (for MVP)
- ❌ Never skip the 24-hour response window
- ❌ Never forget to refund if no consultant accepts

### Drafts
- ❌ Never keep drafts beyond 2 weeks
- ❌ Never delete draft context when token modal is shown

### Consultants
- ❌ Never notify consultants outside their active hours (unless surge opt-in)
- ❌ Never allow users to become consultants without admin approval

---

## 📋 Key Business Rules

| Rule | Value |
|------|-------|
| Submission fee (min) | 5 tokens |
| Submission fee (max) | 10 tokens |
| Consultant response window | 24 hours |
| Draft expiry | 2 weeks |
| Surge pay multiplier | 1.2x |
| Technologies per page | 10 |
| Email verification | Not MVP (future) |

---

## 🔧 Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Matching | Admin-assisted | Algorithm suggests, human decides |
| Consultant creation | Admin-only | Quality control |
| Surge cost | Platform absorbs | Better UX for users |
| Tech stack storage | Database seeded | Easy to update via admin |
| Draft storage | Database | Persistent across sessions |

---

## 📝 Future Enhancements (Not MVP)

1. Email verification on registration
2. Full AI-powered matching (no admin involvement)
3. Consultant self-application process
4. Mobile apps
5. In-app messaging before call
6. Session recordings for user review

