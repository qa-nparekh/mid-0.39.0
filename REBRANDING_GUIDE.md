# SQAI Rebranding Guide

This document provides a comprehensive checklist and step-by-step instructions for rebranding Midscene to SQAI in new versions of the codebase.

## Table of Contents
1. [Overview](#overview)
2. [Pre-Rebranding Checklist](#pre-rebranding-checklist)
3. [Code Changes](#code-changes)
4. [Build Process](#build-process)
5. [Testing & Verification](#testing--verification)
6. [Publishing](#publishing)
7. [Troubleshooting](#troubleshooting)

---

## Overview

### Goals
- Remove all legacy "Midscene" references from user-facing code
- Clean up outdated migration code
- Update cache system to use SQAI branding
- Maintain backward compatibility where necessary
- Ensure consistent version numbering across all packages

### Affected Packages
- `@sqaitech/core`
- `@sqaitech/visualizer`
- `@sqaitech/web`
- `@sqaitech/report`
- All other @sqaitech/* packages

---

## Pre-Rebranding Checklist

### 1. Environment Setup
- [ ] Clone/update the repository to the latest version
- [ ] Ensure Node.js and pnpm are installed
- [ ] Run `pnpm install` to install all dependencies
- [ ] Verify current version numbers in package.json files

### 2. Backup
- [ ] Create a git branch for rebranding work: `git checkout -b rebrand-to-sqai-vX.X.X`
- [ ] Backup existing cache files (if needed for testing)
- [ ] Document current package versions

### 3. Determine Target Version
- [ ] Decide on the new version number (e.g., 0.5.0, 0.6.0)
- [ ] Ensure version follows semantic versioning conventions
- [ ] Check if this is a breaking change (cache invalidation = breaking)

---

## Code Changes

### TASK 1: Remove localStorage Migration Code

**Rationale:** Legacy code for migrating from old localStorage keys is no longer needed after rebrand.

#### Files to Modify:
1. `packages/visualizer/src/store/store.tsx`
2. `packages/visualizer/src/store/history.ts`

#### Changes Required:

**In store.tsx:**
```typescript
// REMOVE these constants:
const OLD_AUTO_ZOOM_KEY = 'auto-zoom';
const OLD_BACKGROUND_VISIBLE_KEY = 'background-visible';
const OLD_ELEMENTS_VISIBLE_KEY = 'elements-visible';
const OLD_CONFIG_KEY = 'config';
const OLD_SERVICE_MODE_KEY = 'service-mode';
const OLD_TRACKING_ACTIVE_TAB_KEY = 'tracking-active-tab';
const OLD_DEEP_THINK_KEY = 'deep-think';
const OLD_SCREENSHOT_INCLUDED_KEY = 'screenshot-included';
const OLD_DOM_INCLUDED_KEY = 'dom-included';

// REMOVE this helper function:
const migrateLocalStorageKey = (oldKey: string, newKey: string) => { ... }

// REMOVE all migration calls like:
migrateLocalStorageKey(OLD_AUTO_ZOOM_KEY, SQAI_AUTO_ZOOM_KEY);
```

**In history.ts:**
```typescript
// REMOVE these constants:
const OLD_HISTORY_KEY = 'history';
const OLD_LAST_SELECTED_TYPE_KEY = 'last-selected-type';

// REMOVE the helper function:
const migrateLocalStorageKey = (oldKey: string, newKey: string) => { ... }

// REMOVE migration calls:
migrateLocalStorageKey(OLD_HISTORY_KEY, SQAI_HISTORY_KEY);
migrateLocalStorageKey(OLD_LAST_SELECTED_TYPE_KEY, SQAI_LAST_SELECTED_TYPE_KEY);
```

**Verification:**
```bash
# Search for any remaining OLD_*_KEY references
grep -r "OLD_.*_KEY" packages/visualizer/src/store/
# Should return no results

# Search for migrateLocalStorageKey
grep -r "migrateLocalStorageKey" packages/visualizer/src/store/
# Should return no results
```

---

### TASK 2: Hide "Open in Playground" Button

**Rationale:** Feature is temporarily disabled but may be used in future.

#### File to Modify:
`apps/report/src/components/detail-panel/index.tsx`

#### Changes Required:

**Before:**
```tsx
<OpenInPlayground 
  dump={dump}
  // ... other props
/>
```

**After:**
```tsx
<div style={{ display: 'none' }}>
  <OpenInPlayground 
    dump={dump}
    // ... other props
  />
</div>
```

**Important:** DO NOT delete the component entirely - wrap it in a hidden div.

**Verification:**
```bash
# Check the component is wrapped correctly
grep -A2 "OpenInPlayground" apps/report/src/components/detail-panel/index.tsx
# Should show the display:none wrapper
```

---

### TASK 3: Rebrand Cache System (midsceneVersion → sqaiVersion)

**Rationale:** Cache files should reflect SQAI branding, not Midscene.

**⚠️ BREAKING CHANGE:** This will invalidate all existing cache files.

#### Files to Modify:
1. `packages/core/src/agent/utils.ts`
2. `packages/core/src/agent/task-cache.ts`
3. `packages/web-integration/tests/ai/web/puppeteer/cache-functionality.test.ts`

#### Changes in utils.ts:

**Add export alias:**
```typescript
export const getMidsceneVersion = (): string => {
  // ... existing implementation
};

// Add this line:
export const getSqaiVersion = getMidsceneVersion;
```

**Why keep getMidsceneVersion?** Internal code may still reference it. The alias provides compatibility.

#### Changes in task-cache.ts:

**1. Update import:**
```typescript
// OLD:
import { getMidsceneVersion } from './utils';

// NEW:
import { getSqaiVersion } from './utils';
```

**2. Update type definition:**
```typescript
// OLD:
export type CacheFileContent = {
  midsceneVersion: string;
  cacheId: string;
  caches: Array<PlanningCache | LocateCache>;
};

// NEW:
export type CacheFileContent = {
  sqaiVersion: string;
  cacheId: string;
  caches: Array<PlanningCache | LocateCache>;
};
```

**3. Rename constant and update value:**
```typescript
// OLD:
const lowestSupportedMidsceneVersion = '0.4.0';

// NEW (use current target version):
const lowestSupportedSqaiVersion = '0.5.0'; // SQAI rebrand - invalidates pre-0.5.0 cache
```

**4. Update all field references (6 locations):**
```typescript
// In constructor:
cacheContent = {
  sqaiVersion: getSqaiVersion(),  // Changed from midsceneVersion: getMidsceneVersion()
  cacheId: this.cacheId,
  caches: [],
};

// In loadCacheFromFile():
const version = getSqaiVersion();  // Changed from getMidsceneVersion()
if (!version) {
  debug('no SQAI version info, will not read cache from file');  // Updated message
  return undefined;
}

if (
  semver.lt(jsonData.sqaiVersion, lowestSupportedSqaiVersion) &&  // Changed field names
  !jsonData.sqaiVersion.includes('beta')
) {
  console.warn(
    `You are using an old version of SQAI cache file from before v0.5.0 rebrand. Cache format has changed.\nPlease delete the existing cache and rebuild it. Sorry for the inconvenience.\ncache file: ${cacheFile}`,
  );
  return undefined;
}

debug(
  'cache loaded from file, path: %s, cache version: %s, record length: %s',
  cacheFile,
  jsonData.sqaiVersion,  // Changed from midsceneVersion
  jsonData.caches.length,
);
jsonData.sqaiVersion = getSqaiVersion();  // Changed from midsceneVersion

// In flushCacheToFile():
const version = getSqaiVersion();  // Changed from getMidsceneVersion()
if (!version) {
  debug('no SQAI version info, will not write cache to file');  // Updated message
  return;
}
```

#### Changes in cache-functionality.test.ts:

**Update test assertion:**
```typescript
// OLD:
expect(cacheContent).toContain('midsceneVersion');

// NEW:
expect(cacheContent).toContain('sqaiVersion');
```

#### Verification:
```bash
# Check all midsceneVersion references are replaced
grep -r "midsceneVersion" packages/core/src/agent/task-cache.ts
# Should return no results

# Check getSqaiVersion is used
grep -r "getSqaiVersion" packages/core/src/agent/task-cache.ts
# Should show multiple matches

# Verify test update
grep "sqaiVersion" packages/web-integration/tests/ai/web/puppeteer/cache-functionality.test.ts
# Should show the updated assertion
```

---

### TASK 4: Update Version Numbers

**Rationale:** All packages must have consistent version numbers.

#### Files to Update:
- `package.json` (root)
- `packages/*/package.json` (all packages)
- `apps/*/package.json` (all apps)

#### Packages List:
```
@sqaitech/shared
@sqaitech/recorder
@sqaitech/webdriver
@sqaitech/visualizer
@sqaitech/core
@sqaitech/web
@sqaitech/cli
@sqaitech/playground
@sqaitech/android
@sqaitech/ios
@sqaitech/android-playground
@sqaitech/ios-playground
@sqaitech/mcp
```

#### Update Command:
```bash
# Option 1: Manual update in each package.json
# Change "version": "0.4.0" to "version": "0.5.0"

# Option 2: Use a script (create if needed)
node scripts/update-version.js 0.5.0

# Option 3: Use pnpm
pnpm version 0.5.0 --no-git-tag-version
```

#### Verification:
```bash
# Check all package versions
grep -r '"version"' packages/*/package.json apps/*/package.json | grep -v node_modules

# All should show the same target version
```

---

## Build Process

### CRITICAL: Build Order

**⚠️ The build order is CRUCIAL for proper report template injection.**

The report application embeds itself into the core package. If you build them in the wrong order, you'll get a `REPLACE_ME_WITH_REPORT_HTML` error.

### Correct Build Sequence:

#### Step 1: Build Core (with placeholder)
```bash
pnpm --filter @sqaitech/core build
```

**Expected Output:**
- Builds successfully
- Shows placeholder warning about REPLACE_ME_WITH_REPORT_HTML
- Creates dist/lib/ and dist/es/ directories

#### Step 2: Build Report (injects template)
```bash
pnpm --filter @sqaitech/report build
```

**Expected Output:**
- Builds the report application
- **MUST show these lines:**
  ```
  Template injected into C:\github\midscene\packages\core\dist\es\utils.mjs
  Template injected into C:\github\midscene\packages\core\dist\lib\utils.js
  ```

**⚠️ If you DON'T see "Template injected" messages, the build failed!**

#### Step 3: Build All Remaining Packages
```bash
pnpm build
```

**Expected Output:**
- Builds all 18+ projects
- May use cache for unchanged packages
- Core and report will be skipped (already built)
- Should complete without errors

### Alternative: Full Clean Build

If you encounter issues:
```bash
# Clean all build artifacts
pnpm clean

# Build everything from scratch
pnpm run build:skip-cache
```

---

## Testing & Verification

### Automated Checks

Create a verification script or run these checks manually:

#### 1. TypeScript Compilation
```bash
# Check for TypeScript errors
pnpm exec tsc --noEmit --project packages/core/tsconfig.json
pnpm exec tsc --noEmit --project packages/visualizer/tsconfig.json
```

#### 2. Search for Legacy References
```bash
# Should return NO results:
grep -r "OLD_.*_KEY" packages/visualizer/src/store/
grep -r "migrateLocalStorageKey" packages/visualizer/src/
grep -r "midsceneVersion" packages/core/src/agent/task-cache.ts

# Should return results (confirming new code):
grep -r "sqaiVersion" packages/core/src/agent/task-cache.ts
grep -r "getSqaiVersion" packages/core/src/agent/
```

#### 3. Cache File Format
```bash
# Create a test to verify cache file format
# Run any test that creates cache files
pnpm --filter @sqaitech/web test cache-functionality.test.ts

# Check generated cache files
cat sqai_run/cache/*.cache.yaml | head -5
# Should show: sqaiVersion: 0.5.0 (not midsceneVersion)
```

#### 4. Report Template Injection
```bash
# Verify the report template is embedded in core
grep -l "sqai-logo" packages/core/dist/lib/utils.js
grep -l "sqai-logo" packages/core/dist/es/utils.mjs

# Both commands should return file paths
# If they return nothing, template injection failed
```

### Manual Testing Checklist

- [ ] Run visualizer and verify no console errors about OLD_*_KEY
- [ ] Check localStorage in browser DevTools - should only see sqai-* keys
- [ ] Open a report file - verify "Open in Playground" button is hidden
- [ ] Generate a new cache file - verify it contains `sqaiVersion` field
- [ ] Try loading an old cache file - should show warning and rebuild
- [ ] Verify all SQAI branding (logos, URLs, console messages)

### Test Commands
```bash
# Run unit tests
pnpm test

# Run specific cache tests
pnpm --filter @sqaitech/web test cache

# Run integration tests (if available)
pnpm test:integration
```

---

## Publishing

### Pre-Publishing Checklist

- [ ] All code changes committed to git
- [ ] Version numbers updated consistently
- [ ] All builds completed successfully
- [ ] All tests passing
- [ ] CHANGELOG.md updated with rebrand notes
- [ ] Documentation updated (if needed)

### Publishing Commands

```bash
# Verify package contents before publishing
pnpm --filter @sqaitech/core pack
pnpm --filter @sqaitech/visualizer pack

# Check generated .tgz files

# Publish to npm (dry run first)
pnpm publish --dry-run --filter @sqaitech/core
pnpm publish --dry-run --filter @sqaitech/visualizer
# ... repeat for all packages

# Actual publish
pnpm publish --access public --filter @sqaitech/core
pnpm publish --access public --filter @sqaitech/visualizer
# ... repeat for all packages

# Or publish all at once (if configured)
pnpm publish -r --access public
```

### Post-Publishing

- [ ] Verify packages on npmjs.com
- [ ] Test installation: `npm install @sqaitech/core@0.5.0`
- [ ] Update documentation website
- [ ] Create GitHub release with notes
- [ ] Announce rebrand to users

---

## Troubleshooting

### Issue: REPLACE_ME_WITH_REPORT_HTML Error

**Symptom:** Report files show "REPLACE_ME_WITH_REPORT_HTML" instead of actual report.

**Cause:** Report build didn't run after core build, or ran in wrong order.

**Solution:**
```bash
# Clean and rebuild in correct order
pnpm --filter @sqaitech/core clean
pnpm --filter @sqaitech/report clean
pnpm --filter @sqaitech/core build
pnpm --filter @sqaitech/report build

# Verify injection messages appear
```

### Issue: TypeScript Errors After Renaming

**Symptom:** `Property 'midsceneVersion' does not exist on type 'CacheFileContent'`

**Cause:** Some files still reference old field name.

**Solution:**
```bash
# Find all remaining references
grep -r "midsceneVersion" packages/core/src/
grep -r "getMidsceneVersion()" packages/core/src/agent/task-cache.ts

# Update each occurrence to use sqaiVersion/getSqaiVersion()
```

### Issue: Old Cache Files Not Invalidating

**Symptom:** Old cache files still load without warning.

**Cause:** `lowestSupportedSqaiVersion` constant not updated.

**Solution:**
```typescript
// In task-cache.ts, ensure:
const lowestSupportedSqaiVersion = '0.5.0'; // Must match or exceed new version
```

### Issue: localStorage Migration Errors

**Symptom:** Console errors about missing OLD_*_KEY constants.

**Cause:** Migration code not fully removed.

**Solution:**
```bash
# Search for any remaining migration code
grep -r "migrateLocalStorageKey" packages/visualizer/
grep -r "OLD_" packages/visualizer/src/store/

# Remove all found references
```

### Issue: Tests Failing After Changes

**Symptom:** Test assertions fail looking for 'midsceneVersion'.

**Cause:** Test files not updated.

**Solution:**
```bash
# Find and update all test files
grep -r "midsceneVersion" packages/*/tests/
grep -r "'midsceneVersion'" apps/*/tests/

# Update to 'sqaiVersion'
```

---

## Checklist Summary

Use this quick checklist to track progress:

### Code Changes
- [ ] Removed localStorage migration code (store.tsx, history.ts)
- [ ] Hidden OpenInPlayground button (detail-panel/index.tsx)
- [ ] Added getSqaiVersion export (utils.ts)
- [ ] Updated cache system to sqaiVersion (task-cache.ts)
- [ ] Updated cache tests (cache-functionality.test.ts)
- [ ] Updated all package versions to target version

### Build & Verification
- [ ] Built core package successfully
- [ ] Built report package with template injection
- [ ] Built all packages successfully
- [ ] No TypeScript compilation errors
- [ ] No legacy references remain (grep checks pass)
- [ ] Cache files use sqaiVersion format
- [ ] Report template injected into core

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Generated cache files verified
- [ ] Old cache invalidation verified

### Publishing (if applicable)
- [ ] Git changes committed
- [ ] CHANGELOG.md updated
- [ ] Documentation updated
- [ ] Packages published to npm
- [ ] Published packages verified

---

## Version History

### v0.5.0 Rebrand Changes
- Removed localStorage migration code (11 keys)
- Hidden "Open in Playground" button
- Renamed cache field: midsceneVersion → sqaiVersion
- Updated lowestSupportedSqaiVersion to 0.5.0
- Updated all error messages to reference SQAI
- **Breaking:** Old cache files invalidated

### Future Rebrand Notes
- Follow this same process for future versions
- Update lowestSupportedSqaiVersion to new version
- Consider adding migration path if cache format changes significantly
- Keep this document updated with new learnings

---

## Contact & Support

For questions about the rebranding process:
- Check project documentation
- Review previous rebrand commits in git history
- Search for TODO/FIXME comments in code
- Consult with team leads

---

**Document Version:** 1.0  
**Last Updated:** January 17, 2026  
**Applies to:** Midscene → SQAI rebrand v0.5.0+
