# Waddle v2 - Comprehensive Testing Sheets

> Browser-based testing checklist for the complete flow
> Generated: December 9th, 2025

---

## 🔧 Pre-Test Setup

### Environment Requirements
- [ ] Backend server running (Laravel)
- [ ] Frontend server running (React)
- [ ] Database seeded with technologies
- [ ] Admin user exists in database
- [ ] At least one consultant user flagged in database

### Test Data to Prepare
```
Admin Account:
- Email: admin@waddle.test
- Password: [your password]

Test User Account (to create):
- Email: testuser@example.com
- Username: testuser123
- DOB: 2000-01-15

Consultant Account (needs admin to flag):
- Email: consultant@example.com
- Username: consultant123
```

---

## 📋 TEST SUITE 1: User Registration

### Test 1.1: Basic Registration Flow
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/register` | Registration form displays | | |
| 2 | Leave all fields empty, click Register | Validation errors shown | | |
| 3 | Enter invalid email format | Email validation error | | |
| 4 | Enter password without uppercase | Password validation error | | |
| 5 | Enter password without number | Password validation error | | |
| 6 | Enter password without symbol | Password validation error | | |
| 7 | Enter mismatched passwords | Passwords must match error | | |
| 8 | Enter DOB making user < 13 years | Age validation error | | |
| 9 | Fill all fields correctly | Registration succeeds | | |
| 10 | Check user has token balance of 0 | Balance shows 0 | | |

### Test 1.2: Username Uniqueness
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Try registering with same username | Duplicate username error | | |
| 2 | Try username with special chars (spaces) | Validation error | | |
| 3 | Register with valid unique username | Success | | |

### Test 1.3: Post-Registration Redirect
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Complete registration | Redirected to complete profile OR dashboard | | |
| 2 | Check `profile_completed_at` is null | Field is null in DB | | |

---

## 📋 TEST SUITE 2: Profile Completion

### Test 2.1: Profile Completion Form
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/complete-profile` | Form displays | | |
| 2 | Check competency dropdown options | Shows: Beginner, Intermediate, Advanced, Senior | | |
| 3 | Leave bio empty, try to submit | Validation error | | |
| 4 | Leave competency unselected, try to submit | Validation error | | |
| 5 | Fill bio (< min chars if any) | Appropriate validation | | |
| 6 | Select competency level | Selection works | | |
| 7 | Upload profile photo (if implemented) | Upload succeeds | | |
| 8 | Submit complete profile | Success, redirected to dashboard | | |
| 9 | Check `profile_completed_at` is set | Timestamp in DB | | |

### Test 2.2: Profile Completion Enforcement
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create new user (profile not complete) | User created | | |
| 2 | Try to navigate to `/submit-problem` | Should redirect to complete profile OR show error | | |
| 3 | Complete profile | Success | | |
| 4 | Now navigate to `/submit-problem` | Access granted | | |

---

## 📋 TEST SUITE 3: Problem Submission

### Test 3.1: Problem Form Display
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/submit-problem` | Form displays | | |
| 2 | Check technology pills load | At least 10 technologies shown | | |
| 3 | Click "Load More" | Additional technologies load | | |
| 4 | Search for a technology | Filter works | | |
| 5 | Check submission fee shows | Base fee of 5 tokens displayed | | |
| 6 | Check user balance shows | Current balance displayed | | |

### Test 3.2: Technology Selection
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click a technology pill | Pill becomes selected (highlighted) | | |
| 2 | Click selected pill again | Pill deselects | | |
| 3 | Select multiple technologies | All selections persist | | |
| 4 | Type custom technology name | Custom input works | | |
| 5 | Add custom technology | Appears in selected list | | |
| 6 | Remove custom technology | Removes from list | | |

### Test 3.3: File Attachments
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click file upload area | File picker opens | | |
| 2 | Select valid file (< 10MB) | File added to list | | |
| 3 | Try uploading file > 10MB | Error message shown | | |
| 4 | Add multiple files | All files listed | | |
| 5 | Remove a file | File removed from list | | |
| 6 | Check fee increases with files | Fee goes up (max 2 extra) | | |

### Test 3.4: Fee Calculation
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Start with empty form | Fee shows 5 tokens | | |
| 2 | Add > 500 chars to problem statement | Fee increases | | |
| 3 | Add > 1000 chars to problem statement | Fee increases more | | |
| 4 | Add > 500 chars to error description | Fee increases | | |
| 5 | Add attachments | Fee increases | | |
| 6 | Check fee never exceeds 10 | Maximum is 10 tokens | | |

### Test 3.5: Save Draft
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Fill out partial form | Data entered | | |
| 2 | Click "Save Draft" | Success message | | |
| 3 | Refresh page | Draft NOT auto-loaded (or check drafts list) | | |
| 4 | Check draft in database | `status = draft`, `draft_expires_at` set | | |
| 5 | Check expiry is 2 weeks out | Correct timestamp | | |

### Test 3.6: Token Check - Insufficient Balance
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Ensure user has < 5 tokens | Balance is low | | |
| 2 | Fill out valid problem form | Form ready | | |
| 3 | Click Submit | Token purchase modal appears | | |
| 4 | Close modal | Form data still present (not lost) | | |
| 5 | Check problem NOT submitted | Still draft/not created | | |

### Test 3.7: Token Check - Sufficient Balance
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Give user 10+ tokens (via DB) | Balance updated | | |
| 2 | Fill out valid problem form | Form ready | | |
| 3 | Click Submit | Success, redirected | | |
| 4 | Check tokens deducted | Balance reduced by fee amount | | |
| 5 | Check problem status = `submitted` | Status in DB | | |
| 6 | Check `submitted_at` timestamp | Set in DB | | |

---

## 📋 TEST SUITE 4: Admin Matching (Filament Panel)

### Test 4.1: Admin Panel Access
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/admin` | Login page or dashboard | | |
| 2 | Login as admin | Access granted | | |
| 3 | Check Problem Submissions in nav | Badge shows count | | |

### Test 4.2: View Problem Submissions
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click Problem Submissions | List displays | | |
| 2 | Find submitted problem | Shows in list with status `submitted` | | |
| 3 | Click to view details | Details page shows | | |
| 4 | Check user info displays | Name, email, competency | | |
| 5 | Check problem statement displays | Full text visible | | |
| 6 | Check technologies display | Pills/badges shown | | |
| 7 | Check attachments display (if any) | Files listed | | |

### Test 4.3: Match Problem (Single Invite)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Match" button | Match page opens | | |
| 2 | Check suggested consultants | List with match scores | | |
| 3 | Select one consultant | Checkbox selected | | |
| 4 | Click "Invite Selected" | Success notification | | |
| 5 | Check problem status → `matching` | Status updated | | |
| 6 | Check invitation created | `ConsultantInvitation` in DB | | |
| 7 | Check `expires_at` is 24 hours | Correct timestamp | | |

### Test 4.4: Match Problem (Mass Invite)
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Submit another problem | New problem ready | | |
| 2 | Go to Match page | Shows suggested consultants | | |
| 3 | Click "Invite All" | Success with count | | |
| 4 | Check multiple invitations created | All suggested consultants invited | | |

### Test 4.5: Surge Pricing Invite
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Ensure consultant has `is_surge_available = true` | Via DB | | |
| 2 | Go to Match page for a problem | Page loads | | |
| 3 | Click surge invite for that consultant | Invitation sent | | |
| 4 | Check `is_surge = true` on invitation | Flag set | | |
| 5 | Check `surge_multiplier = 1.2` | Multiplier set | | |

---

## 📋 TEST SUITE 5: Consultant Invitation Flow

### Test 5.1: Consultant Sees Invitations
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Login as consultant | Access granted | | |
| 2 | Navigate to "My Work" (`/consultant/work`) | Page loads | | |
| 3 | Check pending invitations count | Shows badge/count | | |
| 4 | See invitation in list | Invitation displayed | | |
| 5 | Check time remaining shows | "Expires in X hours" | | |
| 6 | Check problem statement visible | Summary shown | | |
| 7 | Check technologies visible | Tech pills shown | | |
| 8 | Check user info visible | Name, competency | | |

### Test 5.2: View Invitation Details
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "View Details" | Detail page opens | | |
| 2 | Check full problem statement | Complete text | | |
| 3 | Check full error description | Complete text | | |
| 4 | Check attachments listed | Files shown with download | | |
| 5 | Check user bio visible | Bio displayed | | |

### Test 5.3: Accept Invitation
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Click "Accept Job" | Processing indicator | | |
| 2 | Check success message | Confirmation shown | | |
| 3 | Check invitation status → `accepted` | Status in DB | | |
| 4 | Check problem status → `matched` | Status in DB | | |
| 5 | Check `responded_at` timestamp | Set in DB | | |
| 6 | Invitation moves to "Active Jobs" tab | UI updated | | |

### Test 5.4: Decline Invitation
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create another invitation | New invite exists | | |
| 2 | Click "Decline" | Confirmation dialog | | |
| 3 | Confirm decline | Processing | | |
| 4 | Check invitation status → `declined` | Status in DB | | |
| 5 | Invitation moves to "History" tab | UI updated | | |

### Test 5.5: Multiple Consultants - First Accept Wins
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create problem, mass invite 2+ consultants | Multiple invites | | |
| 2 | Login as Consultant A, accept | Success | | |
| 3 | Check Consultant B's invitation → `declined` | Auto-declined | | |
| 4 | Only one consultant matched | Single match | | |

### Test 5.6: Expired Invitation
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create invitation with past `expires_at` (via DB) | Expired invite | | |
| 2 | View invitation as consultant | Shows "Expired" status | | |
| 3 | Try to accept | Error: invitation expired | | |

---

## 📋 TEST SUITE 6: Expiry & Refund Flow

### Test 6.1: Invitation Expiry Job
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create invitation, set `expires_at` to past | Expired state | | |
| 2 | Run `ExpireInvitationsJob` manually | Job completes | | |
| 3 | Check invitation status → `expired` | Status updated | | |

### Test 6.2: Refund Processing
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Create problem, invite consultant | Invitation pending | | |
| 2 | Set invitation to `declined` or `expired` | No pending invites | | |
| 3 | Ensure problem status = `matching` | Ready for refund | | |
| 4 | Run `ExpireInvitationsJob` | Job processes refund | | |
| 5 | Check user tokens restored | Balance increased | | |
| 6 | Check problem status → `refunded` | Status updated | | |
| 7 | Check `refunded_at` timestamp | Set in DB | | |
| 8 | Check `TokenTransaction` created | Refund record exists | | |

---

## 📋 TEST SUITE 7: Consultant Features

### Test 7.1: Consultant Dashboard
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/consultant/dashboard` | Dashboard loads | | |
| 2 | Check pending requests count | Accurate count | | |
| 3 | Check active consultations count | Accurate count | | |
| 4 | Check earnings summary | Data displays | | |

### Test 7.2: Availability Settings
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to availability settings | Form loads | | |
| 2 | Set availability hours | Times saved | | |
| 3 | Toggle overall availability on/off | Status changes | | |

### Test 7.3: Surge Pricing Settings
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to surge settings | Form loads | | |
| 2 | Toggle surge opt-in ON | Setting saved | | |
| 3 | Verify `is_surge_available = true` | DB updated | | |
| 4 | Toggle surge opt-in OFF | Setting saved | | |
| 5 | Verify `is_surge_available = false` | DB updated | | |

### Test 7.4: Calendar View
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Navigate to `/consultant/schedule` | Calendar loads | | |
| 2 | Check accepted jobs display | Events shown | | |
| 3 | Navigate between months | Works correctly | | |

---

## 📋 TEST SUITE 8: Edge Cases & Error Handling

### Test 8.1: Duplicate Operations
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Try to accept already accepted invitation | Error: already accepted | | |
| 2 | Try to decline already declined invitation | Error: already declined | | |
| 3 | Try to invite already invited consultant | Skip/warning | | |

### Test 8.2: Unauthorized Access
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Access admin panel as regular user | Access denied | | |
| 2 | Access consultant work page as regular user | Access denied or empty | | |
| 3 | Try to accept another consultant's invitation | Forbidden error | | |

### Test 8.3: Invalid Data
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Submit problem with < 20 char statement | Validation error | | |
| 2 | Submit problem with no technologies | Validation error | | |
| 3 | Upload file > 10MB | Size error | | |

---

## 📋 TEST SUITE 9: End-to-End Flow

### Test 9.1: Complete Happy Path
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Register new user | Account created | | |
| 2 | Complete profile | Profile saved | | |
| 3 | Purchase/add tokens (10+) | Balance updated | | |
| 4 | Submit problem | Problem created, tokens deducted | | |
| 5 | Login as admin | Access admin panel | | |
| 6 | View problem, invite consultant | Invitation sent | | |
| 7 | Login as consultant | Access consultant area | | |
| 8 | View invitation details | Full details shown | | |
| 9 | Accept invitation | Status updated | | |
| 10 | Verify problem status = `matched` | Ready for consultation | | |

### Test 9.2: Refund Path
| Step | Action | Expected Result | Pass/Fail | Notes |
|------|--------|-----------------|-----------|-------|
| 1 | Submit problem (user has exact tokens for fee) | Tokens at 0 | | |
| 2 | Admin invites consultant | Invitation pending | | |
| 3 | Wait for expiry / manually expire | Invitation expired | | |
| 4 | Run expiry job | Refund processed | | |
| 5 | Verify user tokens restored | Full refund | | |
| 6 | Verify problem status = `refunded` | Status correct | | |

---

## 📊 Test Summary Template

### Session Info
- **Date:** _______________
- **Tester:** _______________
- **Environment:** _______________
- **Browser:** _______________

### Results Summary
| Suite | Total Tests | Passed | Failed | Blocked |
|-------|-------------|--------|--------|---------|
| 1. Registration | | | | |
| 2. Profile Completion | | | | |
| 3. Problem Submission | | | | |
| 4. Admin Matching | | | | |
| 5. Consultant Invitations | | | | |
| 6. Expiry & Refund | | | | |
| 7. Consultant Features | | | | |
| 8. Edge Cases | | | | |
| 9. End-to-End | | | | |
| **TOTAL** | | | | |

### Bugs Found
| ID | Suite | Description | Severity | Status |
|----|-------|-------------|----------|--------|
| | | | | |

### Notes
_______________________________________________
_______________________________________________
_______________________________________________

