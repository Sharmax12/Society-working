# HallWayLoop design-system baseline

This document records the existing token-first approach so new pages can reuse the same visual language instead of inventing one-off styles.

## Color

Use the CSS variables in `app/globals.css` through Tailwind utilities rather than hard-coded colors:

- `background` / `foreground` for page surfaces and default text.
- `card` / `popover` for raised surfaces.
- `primary` and `primary-foreground` for brand actions and accents.
- `secondary`, `muted`, and `accent` for supporting surfaces.
- `border`, `input`, and `ring` for field borders and keyboard focus.
- `destructive` for errors and destructive actions.

Both light and dark values belong in the CSS token definitions. Keep the coral brand values in the existing root variables rather than introducing a second palette.

## Type

Keep the public site to a compact type scale:

- **Display:** page hero headings, usually `text-5xl` to `text-7xl`.
- **H1:** page titles, usually `text-4xl` to `text-6xl`.
- **H2:** section titles, usually `text-2xl` to `text-4xl`.
- **H3:** card titles, usually `text-lg` to `text-xl`.
- **Body:** paragraph copy, usually `text-sm` to `text-base`.
- **Caption:** helper text and metadata, usually `text-xs`.

Use one clear heading weight per page and reserve the strongest weight for the page title or key section title.

## Spacing and layout

Use Tailwind spacing utilities in a 4px rhythm. Prefer consistent section containers (`max-w-6xl` with `px-5 sm:px-8`) and standard vertical section padding (`py-12` through `py-20`) over one-off pixel values.

## Interaction and accessibility

- Every interactive control needs visible hover and keyboard-focus states.
- Disabled controls should use the native `disabled` attribute and a visibly muted state.
- Forms need associated labels, required-field validation, submission/loading feedback, and an announced success or error state.
- Empty states should explain the current condition before displaying counts; hide zero counts when they do not add meaning.
- Keep link destinations and button labels explicit. Use `button` for actions and links for navigation.
- Product-blueprint copy must make it clear when a feature is planned rather than live.
