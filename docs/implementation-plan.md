# Waddle v2 - Updated Implementation Plan

> Last Updated: December 3rd, 2025

## Overview

Waddle is a platform connecting developers with expert consultants for real-time technical help. Users submit problems, admins match them with suitable consultants, and consultations happen via video call.

---

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Redux Toolkit + TailwindCSS + ShadCN UI |
| Backend | Laravel 11 + Laravel Sanctum + MySQL |
| Admin Panel | Filament (Laravel-native) |
| Real-time | Laravel WebSockets (Pusher-compatible) |
| Video | Zoom Video SDK |
| Payments | Stripe |
| File Storage | AWS S3 |

---

## User Types

| Type | Description |
|------|-------------|
| **Guest** | Can browse public pages, pricing, how it works |
| **User** | Registered user who can submit problems and attend consultations |
| **Consultant** | Flagged by admin, can accept work invitations and conduct consultations |
| **Admin** | Full CMS access, manages users, consultants, and problem matching |

> **Note:** Consultants cannot use the platform as users. They would need a separate account to submit problems.

---

## User Flows

### 1. User Registration

**Fields Required:**
- Full name (first_name, last_name)
- Username (unique)
- Date of birth
- Email address
- Password + Confirm password

**Post-Registration:**
1. User is directed to "Complete Your Profile" page
2. Required fields:
   - Profile photo (selfie upload)
   - Short bio
   - Development competency level (dropdown):
     - Beginner
     - Intermediate
     - Advanced
     - Senior

**Future Enhancement (Not MVP):**
- Email verification link before accessing platform

---

### 2. Problem Submission

**Page Elements:**

| Field | Description |
|-------|-------------|
| Problem Statement | Short description of the problem (required) |
| Error Description | Detailed area for: error messages, AI output, or written explanation |
| File Attachments | Images and files for additional context |
| Technology Pills | Selectable tech stack pills (seeded in DB) |

**Technology Pills:**
- Display 10 common technologies initially
- "Load More" button loads additional 10
- Custom input field for unlisted technologies
- Technologies are seeded in database for admin management

**Submission Fee:**
- Base fee: **5 tokens**
- Scales based on context provided:
  - More characters typed
  - Images/files uploaded
- Maximum fee: **10 tokens**
- Fee charged once per submission (not re-charged if passed to another consultant)

---

### 3. Token Check on Submit

**Flow:**
1. User clicks Submit
2. System checks token balance
3. If sufficient → Submit problem, proceed to next page
4. If insufficient → Show purchase modal

**Purchase Modal:**
- Token package options
- Subscription options
- Close button (doesn't lose context)

**Save Draft:**
- Available if user doesn't purchase
- Stored in database
- **Drafts expire after 2 weeks**

---

### 4. After Submission

**Consultant Response Window:**
- Consultants have **24 hours** to respond to invitations
- If no consultant accepts within 24 hours:
  - User receives **full submission fee refund**
  - User is notified

---

### 5. Admin Matching Flow

1. User submits problem
2. Admin receives notification
3. Admin views CMS page showing:
   - User info (name, email)
   - Problem description
   - Technologies used
   - File attachments
   - **Algorithm-suggested consultants** (ranked by match score)
4. Admin can:
   - Invite specific consultant
   - Mass invite all suitable consultants (first-come-first-serve)

> The matching algorithm provides suggestions, but **admin makes final decision**.

---

### 6. Consultant Account

**Creation:**
1. User signs up normally
2. Admin flags user as consultant via CMS
3. Next login → Prompted to complete consultant profile

**Consultant Profile (Additional Fields):**
- Professional experience
- Tech stacks they're competent with (multi-select from seeded technologies)
- Availability hours (notification preferences)

**My Work Area:**
- Work invitations (accept/reject)
- Session history
- Calendar view for scheduled consultations
- Notification hour settings

**Notification Hours:**
- Consultants set their "active hours" (e.g., 9am-5pm)
- Problems submitted outside these hours won't send immediate notifications
- Consultants can opt-in to surge pricing notifications

---

### 7. Surge Pricing

**Concept:**
When no suitable consultants are available during business hours, offer work to consultants outside their scheduled hours.

**Implementation:**
- Consultant toggles "Available for surge work"
- If enabled, they can be notified outside their active hours
- Consultant receives **1.2x pay** for surge work
- **Waddle absorbs the extra cost** (user pays normal rate)

---

## Database Changes Required

### New/Modified Tables

**users table additions:**
- `username` (string, unique)
- `date_of_birth` (date)
- `bio` (text, nullable)
- `profile_photo_path` (string, nullable)
- `development_competency` (enum: beginner, intermediate, advanced, senior)

**New: technologies table:**
- `id`
- `name`
- `slug`
- `icon_url` (nullable)
- `is_active` (boolean)
- `display_order` (integer)
- `created_at`, `updated_at`

**New: problem_submissions table:**
- `id`
- `user_id` (foreign key)
- `problem_statement` (text)
- `error_description` (text, nullable)
- `status` (enum: draft, submitted, matched, in_progress, completed, refunded)
- `submission_fee` (integer, tokens)
- `draft_expires_at` (timestamp, nullable)
- `submitted_at` (timestamp, nullable)
- `refunded_at` (timestamp, nullable) - tracks when refund occurred, prevents duplicate refunds
- `created_at`, `updated_at`

**New: problem_technologies table (pivot):**
- `problem_submission_id`
- `technology_id`
- `is_custom` (boolean)
- `custom_name` (string, nullable - for unlisted tech)

**New: problem_attachments table:**
- `id`
- `problem_submission_id`
- `file_path`
- `file_name`
- `file_type`
- `file_size`
- `created_at`

**New: consultant_invitations table:**
- `id`
- `problem_submission_id`
- `consultant_id`
- `invited_by` (admin user_id)
- `status` (enum: pending, accepted, declined, expired)
- `is_surge` (boolean)
- `invited_at`
- `responded_at` (nullable)
- `expires_at`

**consultants table additions:**
- `is_surge_available` (boolean, default false)
- `notification_start_time` (time)
- `notification_end_time` (time)

**New: consultant_technologies table (pivot):**
- `consultant_id`
- `technology_id`

---

## Seeded Data

### Technologies (Initial Seed)

**Tier 1 (Most Common - Show First):**
1. JavaScript
2. TypeScript
3. React
4. Python
5. Node.js
6. Laravel
7. PHP
8. Flutter
9. Swift
10. Kotlin

**Tier 2 (Load More):**
11. Vue.js
12. Angular
13. Next.js
14. Django
15. Ruby on Rails
16. Go
17. Rust
18. Java
19. C#
20. .NET

**Tier 3+:** (Continue with popular frameworks/languages)

---

## API Endpoints (New/Modified)

### Problem Submissions
- `POST /api/v1/problems` - Create/submit problem
- `GET /api/v1/problems` - List user's problems
- `GET /api/v1/problems/{id}` - Get problem details
- `PUT /api/v1/problems/{id}` - Update draft
- `DELETE /api/v1/problems/{id}` - Delete draft
- `POST /api/v1/problems/{id}/submit` - Submit draft
- `POST /api/v1/problems/{id}/attachments` - Upload attachment

### Technologies
- `GET /api/v1/technologies` - List technologies (paginated, 10 per page)
- `GET /api/v1/technologies/search` - Search technologies

### Consultant Work
- `GET /api/v1/consultant/invitations` - List work invitations
- `POST /api/v1/consultant/invitations/{id}/accept` - Accept invitation
- `POST /api/v1/consultant/invitations/{id}/decline` - Decline invitation
- `GET /api/v1/consultant/calendar` - Get scheduled consultations
- `PUT /api/v1/consultant/availability` - Update notification hours

### Admin (Filament)
- Problem submissions management
- Consultant invitation management
- Technology management
- Manual matching interface

---

## Implementation Phases

### Phase A: Database & Models (Priority: High)
- [ ] Add new fields to users table migration
- [ ] Create technologies table + seeder
- [ ] Create problem_submissions table
- [ ] Create problem_technologies pivot table
- [ ] Create problem_attachments table
- [ ] Create consultant_invitations table
- [ ] Update consultants table
- [ ] Create consultant_technologies pivot table
- [ ] Create all Eloquent models with relationships

### Phase B: Profile Completion Flow (Priority: High)
- [ ] Backend: Profile completion endpoint
- [ ] Backend: Profile photo upload
- [ ] Frontend: Profile completion page
- [ ] Frontend: Development competency dropdown
- [ ] Frontend: Bio input
- [ ] Redirect logic after registration

### Phase C: Problem Submission (Priority: High)
- [ ] Backend: Problem CRUD endpoints
- [ ] Backend: Submission fee calculation logic
- [ ] Backend: Draft save/expire logic
- [ ] Backend: File attachment upload
- [ ] Frontend: Problem submission page
- [ ] Frontend: Technology pills component
- [ ] Frontend: Error description with file uploads
- [ ] Frontend: Token check modal
- [ ] Frontend: Save draft functionality

### Phase D: Admin Matching (Priority: High)
- [ ] Filament: Problem submissions resource
- [ ] Filament: View problem with user info
- [ ] Filament: Algorithm-suggested consultants list
- [ ] Filament: Invite single consultant action
- [ ] Filament: Mass invite action
- [ ] Backend: Invitation creation logic
- [ ] Backend: 24-hour expiry job
- [ ] Backend: Refund logic if no acceptance

### Phase E: Consultant Work Area (Priority: Medium)
- [ ] Frontend: "My Work" navigation item
- [ ] Frontend: Invitations list (accept/reject)
- [ ] Frontend: Session history
- [ ] Frontend: Calendar view
- [ ] Frontend: Notification hours settings
- [ ] Backend: Invitation accept/decline endpoints
- [ ] Backend: Calendar data endpoint

### Phase F: Surge Pricing (Priority: Low)
- [ ] Backend: Surge availability toggle
- [ ] Backend: Surge notification logic
- [ ] Backend: 1.2x pay calculation
- [ ] Frontend: Surge toggle in consultant settings
- [ ] Admin: Surge pricing reporting

---

## Success Criteria

- [ ] Users can register with username and DOB
- [ ] Users must complete profile before submitting problems
- [ ] Problems can be submitted with tech stack selection
- [ ] Submission fee scales 5-10 tokens based on content
- [ ] Drafts auto-expire after 2 weeks
- [ ] Admins see algorithm suggestions when matching
- [ ] Consultants have 24 hours to respond
- [ ] Users refunded if no consultant accepts
- [ ] Consultants can manage their work and calendar
- [ ] Surge pricing available for off-hours work

