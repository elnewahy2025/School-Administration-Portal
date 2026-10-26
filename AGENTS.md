<!-- BEGIN:modularity-rule -->

## RULE #1 (non-negotiable): one function per file, no big files

This is the most important rule in this repository. Every agent MUST follow it.

1. **One function per file.** Each function/component/hook lives in its own file, named after it (e.g. `hasAnyPlatformOwner.ts` → `hasAnyPlatformOwner`). Do not bundle unrelated functions, helpers, or utilities into one file.
2. **No big files.** A file is capped at **~300 lines** (enforced as `max-lines: 300` in `eslint.config.mjs`). If a file grows past ~300 lines, split it by function before doing anything else.
3. **A file up to ~300 lines may stay as one unit** when its functions are a cohesive, inseparable group — most notably a component together with its tightly-coupled sub-parts (e.g. a shadcn primitive exporting a component and its child elements). Do not split these artificially.
4. **One runtime export per file** is additionally enforced by the `d11/single-export` ESLint rule.
5. **Never add a second function to an existing file to "save time".** Create a new file.

### Required carve-outs (the rule cannot apply literally)

- Next.js framework files (`src/app/**/{layout,page,route,template,error,loading,not-found,global-error}.tsx`) must export their framework functions (`generateMetadata`, `generateStaticParams`, `default`, …) from one file — that is a framework contract.
- Barrel files (`index.ts`) re-export by design.
- `*.config.*` and `*.{test,spec,stories}.*` files aggregate by design.
- `src/components/ui/**` follows the shadcn generator convention (component + sub-parts in one file) and is only bounded by the ~300-line cap.

Any new file must also satisfy the ~300-line cap and, outside the carve-outs above, exactly one runtime export.

<!-- END:modularity-rule -->

<!-- BEGIN:language-rule -->

## Language Rule: Always Respond in English

Never respond to the user in Arabic under any circumstances. All communication, explanations, code walkthroughs, and answers must be strictly in English, even when user prompts contain Arabic or when discussing Arabic UI text/content.

<!-- END:language-rule -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
