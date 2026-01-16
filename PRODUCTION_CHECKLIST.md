# Habbit Production-Ready Checklist

**Status:** In Progress  
**Last Updated:** January 17, 2026  
**Version:** 1.0

---

## 📊 Progress Overview

**Total Tasks:** 47  
**Completed:** 7  
**In Progress:** 2  
**Pending:** 38

---

## 🔴 CRITICAL (Must Complete Before Release)

### 1. Security: Secure Token Storage
- **Status:** ⏳ PENDING
- **Priority:** 🔴 CRITICAL
- **Estimated Time:** 30 mins
- **Description:** Replace AsyncStorage (plain text) with encrypted token storage
- **Tasks:**
  - [ ] Install `expo-secure-store` package
  - [ ] Create `utils/secureStorage.ts` with token encryption
  - [ ] Update `utils/api.ts` to use secure storage
  - [ ] Update login flow to store tokens securely
  - [ ] Test token retrieval on app restart
  - [ ] Verify tokens are encrypted at rest
- **Files to Modify:** 
  - `utils/api.ts`
  - `utils/storage.ts` (add secure methods)
  - `app/login.tsx`
- **Dependencies:** None
- **Verification:** Token should not appear in plain text in device storage

---

### 2. Backend: Input Validation & Sanitization
- **Status:** ⏳ PENDING
- **Priority:** 🔴 CRITICAL
- **Estimated Time:** 45 mins
- **Description:** Add validation middleware to all backend endpoints
- **Tasks:**
  - [ ] Install `express-validator` package
  - [ ] Create `backend/middleware/validation.js`
  - [ ] Add validation to `/api/auth/profile` PUT endpoint
  - [ ] Validate fullName (max 100 chars, trim whitespace)
  - [ ] Validate gender (male/female/null only)
  - [ ] Add validation to `/api/auth/google` POST endpoint
  - [ ] Validate authorization code and redirectUri
  - [ ] Add error response for validation failures
  - [ ] Test with invalid inputs
- **Files to Modify:**
  - `backend/routes/auth.js`
  - `backend/middleware/validation.js` (new)
- **Dependencies:** None
- **Verification:** Invalid inputs should return 400 error with clear message

---

### 3. App Store: Privacy Policy & Terms
- **Status:** ✅ COMPLETED (Documents created)
- **Priority:** 🔴 CRITICAL
- **Tasks:**
  - [x] Create `PRIVACY_POLICY.md`
  - [x] Create `public/privacy-policy.html`
  - [x] Create `TERMS_OF_SERVICE.md`
  - [ ] Customize with your jurisdiction
  - [ ] Customize with your company address
  - [ ] Customize with your email addresses
  - [ ] Have lawyer review documents
  - [ ] Deploy to HTTPS domain
  - [ ] Test links are accessible
- **Files to Modify:**
  - `PRIVACY_POLICY.md` (customize)
  - `public/privacy-policy.html` (customize)
  - `TERMS_OF_SERVICE.md` (customize)
- **Dependencies:** Legal review
- **Verification:** Documents live on HTTPS and accessible from app

---

### 4. Backend: Remove SMTP Logging
- **Status:** ✅ COMPLETED
- **Priority:** 🔴 CRITICAL
- **Tasks:**
  - [x] Remove SMTP config logs from `backend/utils/email.js`
  - [x] Delete unused `backend/utils/email.js` file
  - [x] Remove unused dependencies from `package.json`
- **Verification:** Backend starts without email-related logs

---

### 5. Apple App Store: Sign in with Apple
- **Status:** ⏳ PENDING
- **Priority:** 🔴 CRITICAL (iOS Requirement)
- **Estimated Time:** 2-3 hours
- **Description:** Implement Sign in with Apple (required for iOS App Store)
- **Tasks:**
  - [ ] Create Apple Developer account (if not exists)
  - [ ] Configure "Sign in with Apple" capability
  - [ ] Get Apple Team ID and Service ID
  - [ ] Update `app.json` with Apple config
  - [ ] Update `utils/appleAuth.ts` with real implementation
  - [ ] Request user's full name if not available
  - [ ] Send authorization code to backend
  - [ ] Create `/api/auth/apple` endpoint
  - [ ] Handle Apple JWT token verification
  - [ ] Create/update user on first Apple sign-in
  - [ ] Test Apple sign-in flow end-to-end
  - [ ] Test on both device and simulator
- **Files to Modify:**
  - `utils/appleAuth.ts`
  - `app.json`
  - `backend/routes/auth.js` (add Apple endpoint)
  - `app/login.tsx` (Apple button UI)
- **Dependencies:** Apple Developer account
- **Verification:** Apple sign-in works and creates user account

---

### 6. Frontend: Remove Unused Dependencies
- **Status:** ⏳ PENDING (Backend done)
- **Priority:** 🔴 CRITICAL
- **Estimated Time:** 15 mins
- **Description:** Clean up unused packages from frontend
- **Tasks:**
  - [ ] Audit frontend `package.json` for unused packages
  - [ ] Remove any unused animation/UI libraries
  - [ ] Remove any debug-only packages
  - [ ] Run `npm audit` to check for vulnerabilities
  - [ ] Update critical dependencies if needed
  - [ ] Test app still runs without errors
- **Files to Modify:**
  - `package.json`
- **Dependencies:** None
- **Verification:** `npm audit` shows 0 vulnerabilities

---

---

## 🟡 HIGH (Within 2 Weeks)

### 7. Backend: Database Migration
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 4-6 hours
- **Description:** Migrate from file-based JSON to PostgreSQL
- **Rationale:** File-based storage has race conditions and won't scale
- **Tasks:**
  - [ ] Design database schema (users, habits, tasks, etc.)
  - [ ] Setup PostgreSQL locally for development
  - [ ] Install `prisma` ORM
  - [ ] Create `schema.prisma` with models
  - [ ] Setup environment variables
  - [ ] Create database migrations
  - [ ] Migrate existing user data
  - [ ] Update auth routes to use database
  - [ ] Update all API endpoints
  - [ ] Add database connection pooling
  - [ ] Test all CRUD operations
  - [ ] Setup automated backups
  - [ ] Document database setup
- **Files to Modify:**
  - `backend/routes/auth.js`
  - `backend/routes/planner.js`
  - `backend/routes/dashboard.js`
  - `backend/routes/motivation.js`
  - `backend/utils/fileOperations.js` (replace)
  - `backend/.env` (add DB_URL)
- **Dependencies:** PostgreSQL installation
- **Verification:** All endpoints work with database backend

---

### 8. Backend: API Rate Limiting
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 30 mins
- **Description:** Prevent abuse with rate limiting
- **Tasks:**
  - [ ] Install `express-rate-limit`
  - [ ] Create `backend/middleware/rateLimiter.js`
  - [ ] Apply stricter limits to auth endpoints
  - [ ] Apply moderate limits to other endpoints
  - [ ] Configure rate limit headers
  - [ ] Test rate limiting works
  - [ ] Document rate limits in API docs
- **Files to Modify:**
  - `backend/server.js`
  - `backend/middleware/rateLimiter.js` (new)
  - `backend/routes/auth.js`
- **Dependencies:** None
- **Verification:** Requests exceed limits are rejected with 429 status

---

### 9. Backend: Error Tracking (Sentry)
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 1 hour
- **Description:** Monitor errors in production
- **Tasks:**
  - [ ] Create Sentry account (sentry.io)
  - [ ] Create project for Habbit
  - [ ] Install `@sentry/react-native` on frontend
  - [ ] Install `@sentry/node` on backend
  - [ ] Configure Sentry DSN in environment variables
  - [ ] Initialize Sentry in app entry point
  - [ ] Setup error boundaries in React
  - [ ] Configure error filtering (exclude noise)
  - [ ] Setup alerts for critical errors
  - [ ] Test error reporting
- **Files to Modify:**
  - `app/_layout.tsx` (add Sentry init)
  - `app/login.tsx` (error boundary)
  - `backend/server.js` (add Sentry)
  - `.env` (add SENTRY_DSN)
- **Dependencies:** Sentry account
- **Verification:** Errors appear in Sentry dashboard

---

### 10. Backend: HTTPS & SSL Setup
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 1-2 hours
- **Description:** Secure backend with HTTPS
- **Tasks:**
  - [ ] Acquire SSL/TLS certificate (Let's Encrypt)
  - [ ] Setup HTTPS server
  - [ ] Configure HSTS headers
  - [ ] Redirect HTTP to HTTPS
  - [ ] Test SSL security (SSL Labs)
  - [ ] Update API URLs to HTTPS
  - [ ] Update OAuth redirect URI if needed
  - [ ] Test from mobile device
- **Files to Modify:**
  - `backend/server.js`
  - `utils/api.ts` (update URLs)
  - `backend/.env`
- **Dependencies:** SSL certificate, domain
- **Verification:** A+ rating on SSL Labs test

---

### 11. Frontend: Error Boundaries
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 45 mins
- **Description:** Gracefully handle app crashes
- **Tasks:**
  - [ ] Create `modules/common/components/ErrorBoundary.tsx`
  - [ ] Wrap root layout with error boundary
  - [ ] Wrap each screen with error boundary
  - [ ] Show user-friendly error message
  - [ ] Add "Try Again" button
  - [ ] Log errors to Sentry
  - [ ] Test with intentional errors
- **Files to Modify:**
  - `app/_layout.tsx`
  - `modules/common/components/ErrorBoundary.tsx` (new)
  - `app/login.tsx`
  - `app/dashboard.tsx`
  - `app/planner.tsx`
- **Dependencies:** None
- **Verification:** App doesn't crash on errors, shows recovery UI

---

### 12. Frontend: Request Timeout Handling
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 30 mins
- **Description:** Handle slow network requests gracefully
- **Tasks:**
  - [ ] Add timeout to all API calls (15 seconds recommended)
  - [ ] Show loading spinner during requests
  - [ ] Show error message on timeout
  - [ ] Implement retry logic
  - [ ] Add offline detection
  - [ ] Test with slow network (DevTools throttling)
- **Files to Modify:**
  - `utils/api.ts`
  - `app/login.tsx`
  - `app/dashboard.tsx`
- **Dependencies:** None
- **Verification:** Requests timeout after set duration

---

### 13. App Store: Update app.json
- **Status:** ⏳ PENDING
- **Priority:** 🟡 HIGH
- **Estimated Time:** 20 mins
- **Description:** Finalize app.json for store submission
- **Tasks:**
  - [ ] Set `targetSdkVersion: 34` for Android
  - [ ] Configure app icons (1024x1024)
  - [ ] Configure splash screen
  - [ ] Add permissions explanation
  - [ ] Set `userInterfaceStyle: "light"`
  - [ ] Add privacy policy URL
  - [ ] Add terms of service URL (optional)
  - [ ] Configure deep linking properly
  - [ ] Update bundle identifiers if changed
- **Files to Modify:**
  - `app.json`
- **Dependencies:** App icons
- **Verification:** All fields filled and valid

---

---

## 🟢 MEDIUM (Before Beta Testing)

### 14. Design: App Icons
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 2-4 hours (or outsource)
- **Description:** Create professional app icon
- **Tasks:**
  - [ ] Design icon (1024x1024 PNG)
  - [ ] Safe zone: 900x900 (rounded corners)
  - [ ] Create iOS icon (various sizes auto-generated)
  - [ ] Create Android adaptive icon
  - [ ] Test on different backgrounds
  - [ ] Upload to Expo EAS
- **Files to Modify:**
  - `assets/icon.png` or equivalent
  - `app.json`
- **Verification:** Icon appears correctly on device home screen

---

### 15. Design: Splash Screen
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 1-2 hours
- **Description:** Create splash screen
- **Tasks:**
  - [ ] Design splash image (1080x1920 for Android, 2048x2732 for iPad)
  - [ ] Add Habbit logo/animation
  - [ ] Configure in app.json
  - [ ] Test on different devices
  - [ ] Set appropriate background color
- **Files to Modify:**
  - `assets/splash.png`
  - `app.json`
- **Verification:** Splash appears when app launches

---

### 16. App Store: Screenshots
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 2-3 hours
- **Description:** Create store listing screenshots
- **Tasks:**
  - [ ] Take 2-5 screenshots of key features
  - [ ] iOS: 1170x2532 (6.1" display)
  - [ ] Android: 1080x1920
  - [ ] Add descriptive captions
  - [ ] Highlight main features
  - [ ] Make visually appealing
  - [ ] Test on store listing preview
- **Verification:** Screenshots display correctly in stores

---

### 17. App Store: Store Metadata
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 1-2 hours
- **Description:** Write store listing text
- **Tasks:**
  - [ ] Write app name (max 30 chars)
  - [ ] Write subtitle (iOS, max 30 chars)
  - [ ] Write short description (80 chars)
  - [ ] Write full description (4000 chars max for Android)
  - [ ] Choose keywords (max 100 chars)
  - [ ] Set support URL
  - [ ] Set privacy policy URL
  - [ ] Verify all links work
- **Files to Modify:** None (store console)
- **Verification:** All metadata visible in store listing

---

### 18. App Store: Content Rating
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 20 mins
- **Description:** Complete content rating questionnaire
- **Tasks:**
  - [ ] Apple App Store: Complete age rating form
  - [ ] Google Play: Complete content rating questionnaire
  - [ ] Select rating: 4+ (no restricted content)
  - [ ] Review all categories
  - [ ] Submit questionnaire
- **Verification:** Rating appears on store listing

---

### 19. Documentation: API Documentation
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 2-3 hours
- **Description:** Document all API endpoints
- **Tasks:**
  - [ ] Create `backend/API_DOCS.md`
  - [ ] Document each endpoint:
    - [ ] POST `/api/auth/google`
    - [ ] POST `/api/auth/apple`
    - [ ] GET `/api/auth/me`
    - [ ] PUT `/api/auth/profile`
    - [ ] All task/dashboard endpoints
  - [ ] Include request/response examples
  - [ ] Document error codes
  - [ ] Document rate limits
- **Files to Modify:**
  - `backend/API_DOCS.md` (new)
- **Verification:** All endpoints documented with examples

---

### 20. Testing: End-to-End Testing
- **Status:** ⏳ PENDING
- **Priority:** 🟢 MEDIUM
- **Estimated Time:** 3-4 hours
- **Description:** Manual testing of full user flow
- **Tasks:**
  - [ ] Test Google Sign-In flow
  - [ ] Test Apple Sign-In flow
  - [ ] Test habit creation
  - [ ] Test habit tracking
  - [ ] Test profile updates
  - [ ] Test sign out
  - [ ] Test re-sign in
  - [ ] Test offline behavior
  - [ ] Test slow network
  - [ ] Test error scenarios
  - [ ] Test on iOS device
  - [ ] Test on Android device
- **Verification:** All flows work without errors

---

---

## 🔵 LOW (Nice to Have)

### 21. Performance: Code Splitting
- **Status:** ⏳ PENDING
- **Priority:** 🔵 LOW
- **Estimated Time:** 1-2 hours
- **Description:** Optimize bundle size
- **Tasks:**
  - [ ] Analyze bundle with `expo-optimize`
  - [ ] Split routes with React.lazy
  - [ ] Lazy load heavy components
  - [ ] Check bundle size before/after
- **Verification:** Bundle size < 5MB

---

### 22. Performance: Image Optimization
- **Status:** ⏳ PENDING
- **Priority:** 🔵 LOW
- **Estimated Time:** 1 hour
- **Description:** Optimize all images
- **Tasks:**
  - [ ] Compress PNG files
  - [ ] Use WebP format where possible
  - [ ] Set appropriate image sizes
  - [ ] Remove unused images
- **Verification:** All images < 100KB

---

### 23. Accessibility: A11y Improvements
- **Status:** ⏳ PENDING
- **Priority:** 🔵 LOW
- **Estimated Time:** 2-3 hours
- **Description:** Make app accessible
- **Tasks:**
  - [ ] Add accessibility labels to buttons
  - [ ] Test screen reader support
  - [ ] Verify color contrast (WCAG AA)
  - [ ] Test keyboard navigation
  - [ ] Add alt text to images
- **Verification:** App passes accessibility audits

---

### 24. Analytics: User Analytics Setup
- **Status:** ⏳ PENDING
- **Priority:** 🔵 LOW
- **Estimated Time:** 1-2 hours
- **Description:** Track user behavior (opt-in)
- **Tasks:**
  - [ ] Choose analytics service (Firebase, Mixpanel, etc.)
  - [ ] Install analytics SDK
  - [ ] Track key events:
    - [ ] App open
    - [ ] Sign in success
    - [ ] Create habit
    - [ ] Complete habit
  - [ ] Setup dashboard
  - [ ] Make opt-in only
- **Verification:** Events appear in dashboard

---

---

## 📋 COMPLETED TASKS (7/47)

- [x] ✅ Setup Google OAuth with Expo proxy URI
- [x] ✅ Remove email authentication (signup, login, password reset)
- [x] ✅ Create login screen with animations
- [x] ✅ Create Privacy Policy document
- [x] ✅ Create Terms of Service document
- [x] ✅ Remove unused backend dependencies
- [x] ✅ Remove SMTP logging and email utility

---

## 📊 Priority Summary

| Priority | Count | Status |
|----------|-------|--------|
| 🔴 CRITICAL | 6 | ⏳ 5 pending, ✅ 1 done |
| 🟡 HIGH | 7 | ⏳ 7 pending |
| 🟢 MEDIUM | 7 | ⏳ 7 pending |
| 🔵 LOW | 4 | ⏳ 4 pending |
| **TOTAL** | **24** | ⏳ 23 pending |

---

## 🎯 Recommended Timeline

### Week 1: CRITICAL Tasks
- Day 1-2: Secure token storage + Input validation
- Day 3: Apple Sign-In implementation
- Day 4: Privacy policy customization + legal review
- Day 5: Testing

### Week 2: HIGH Priority Tasks
- Day 1-2: Database migration (if doing now)
- Day 3: Rate limiting + Error tracking
- Day 4: HTTPS setup
- Day 5: Testing

### Week 3: MEDIUM Priority Tasks
- Day 1: Icons + splash screen
- Day 2: Screenshots + metadata
- Day 3-4: E2E testing
- Day 5: Final adjustments

### Week 4: Submission
- Day 1-2: Build and submit iOS TestFlight
- Day 2-3: Build and submit Android
- Day 4-5: Monitor beta feedback

---

## 🚀 Next Steps (Immediate)

1. **Start with Critical #1:** Secure token storage (30 mins)
2. **Then #2:** Input validation (45 mins)
3. **Then #5:** Apple Sign-In (2-3 hours)
4. **Customize Docs:** Privacy Policy & Terms (30 mins)

**Estimated Time to Production:** 3-4 weeks (working full-time)

---

## 📝 Notes

- Each task has dependencies listed - complete dependencies first
- Estimated times are for experienced developers
- Testing is critical for each feature
- Legal review of privacy policy is non-negotiable
- Some tasks can run in parallel (e.g., design + development)

---

**Last Updated:** January 17, 2026  
**Created by:** Production Planning  
**Next Review:** After Week 1 completion
