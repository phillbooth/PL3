# Rules: Non-Negotiable

These rules define behavior LogicN must not silently weaken.

## Rules

- Only `Bool` controls ordinary conditions.
- `Tri` and `Decision` require explicit handling.
- Missing values use `Option<T>` or another explicit typed form.
- Recoverable errors use `Result<T, E>` or an equivalent typed result form.
- Public routes must not return raw internal models.
- Public routes must use typed requests and declared responses/views.
- Production data fields must be classified.
- Secrets redact by default.
- Effects must be declared.
- Sensitive action requires permission.
- Sensitive data exposure requires permission.
- Package authority must be explicit.
- Scoped vaults must not become global variables.
- Vault reads and writes must be scoped, typed, permission-checked,
  owner-checked and reportable.
- Context replaces hidden global request/user state.
- Sensitive values must not escape declared scopes or lifetimes.
- `Result<T, E>` and `Option<T>` must be handled explicitly.
- Match catch-all branches must be explicit, observable and safe; they must not
  silently hide unknown security-sensitive states.
- Native interop must be explicit, permissioned and reportable.
- Runtime mutation and monkey patching are forbidden in normal code.
- Target fallback must be declared and reported.
- Photonic and optical values must be resolved or matched before controlling
  ordinary application flow.
- Generated AI content starts untrusted.

## v1 Scope

These rules should be reflected in examples, diagnostics, reports and framework
docs before the framework surface expands.
