## 2026-02-12 - [Accessible Icon-Only Buttons and Login Feedback]
**Learning:** Icon-only buttons without ARIA labels are invisible to screen readers. Adding both `aria-label` and `title` ensures they are accessible and provide visual tooltips. Also, providing immediate feedback (loading state) on authentication forms improves the perceived performance and prevents duplicate submissions.
**Action:** Always check for icon-only buttons and ensure they have descriptive `aria-label` and `title`. Use `htmlFor` and `id` to properly associate labels with inputs in forms.

## 2026-02-12 - [React State Initialization Order]
**Learning:** Using `const` for state and then using it in `useCallback` defined *before* the state declaration causes a "Cannot access before initialization" error because `const` is not hoisted.
**Action:** Always declare `useState` at the top of the component, before any `useCallback`, `useEffect`, or helper functions that might depend on them.
