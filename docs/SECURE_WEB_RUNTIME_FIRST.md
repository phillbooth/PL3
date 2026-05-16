# Secure Web Runtime First

LogicN's first serious milestone should be a memory-safe, security-first,
AI-readable language and runtime for secure web apps, APIs and agent workflows.

The first milestone should not depend on native binary compilation. LogicN should
be useful for normal web applications through a LogicN-native secure runtime that
can check, serve and run typed application code with reports.

## Primary Direction

```text
secure web runtime first
native binary output later
accelerator and systems targets later
```

The runtime-first path keeps LogicN focused on what makes it different:

```text
typed API contracts
explicit effects
deny-by-default permissions
secret-safe output
memory-safe values
safe runtime profiles
source maps
AI-readable project context
machine-readable reports
```

## Target Workloads

LogicN should first serve:

```text
HTTP APIs
webhooks
queue workers
service workers
typed JSON services
auth-heavy backend applications
agent/tool gateway backends
AI/model-serving control planes
secure admin/API backends
```

This is application runtime work. Low-level systems targets, embedded targets,
accelerator targets and binary packaging can remain future output paths.

## Faster Web Apps Without Binary Compilation

LogicN can become fast for web apps before native binary output by making the
runtime do less work per request.

Runtime-first performance rules:

```text
precheck source before serving
cache parsed AST and typed IR
compile route manifests once per build
precompute permission and effect decisions
generate typed JSON decoders and encoders
stream large request and response bodies
use read-only views for large payloads
require explicit clone for expensive copies
cache source maps and diagnostics
keep hot route metadata in compact runtime tables
support worker pools for safe background work
make compute-heavy paths eligible for optional WASM later
```

The fast path should be:

```text
request -> route manifest -> typed decode -> policy check -> flow -> typed response
```

The runtime should avoid:

```text
dynamic route lookup on every request
re-decoding schemas repeatedly
copying large payloads unnecessarily
running security discovery after handler code starts
loading dev-only packages in production mode
```

## Security Model

Security should be default runtime behavior, not framework convention.

Required defaults:

```text
input starts untrusted
effects are denied until declared
packages have no authority until approved
secrets redact by default
unknown JSON fields are rejected or reported
route limits are declared
auth requirements are route-visible
unsafe interop is blocked in production profiles
fallback decisions are reported
```

The runtime should fail closed when it cannot prove a route, package, secret,
effect or deployment setting is safe enough for the selected profile.

## Memory Safety

LogicN should make memory behavior clear without forcing normal web developers
into low-level memory work.

Required direction:

```text
Option for missing values
Result for recoverable errors
bounded arrays and slices
read-only views for large data
explicit clone for large copies
resource scopes for files, sockets, handles and secrets
graph ownership for workflow, route and AST structures
audited interop boundaries for native libraries
memory reports for large payloads and hot routes
```

Normal application code should not need manual allocation or manual cleanup for
ordinary values.

## Developer Experience

LogicN should feel strict but practical.

Developer workflow:

```text
logicn check
logicn run
logicn serve
logicn test
logicn reports
```

Diagnostics should explain:

```text
what failed
why it matters
how to fix it
which source line caused it
which type, effect, route or permission rule was involved
```

The language should prefer clear syntax, one obvious form for common behavior,
small core concepts, real examples and predictable formatting.

## AI-Readable Runtime

LogicN should make code understandable to AI tools without giving those tools
unsafe authority.

Runtime and build outputs should include:

```text
project graph
route manifest
type manifest
effect manifest
security report
memory report
package authority report
source maps
AI-safe project summary
redacted diagnostics
```

AI context must be generated from checked project facts, not raw secrets, hidden
runtime state or unbounded logs.

## Future Targets

Future output targets remain useful, but they should not block the first
production-value milestone.

Staged target order:

```text
1. Checked secure web runtime.
2. Cached typed IR for faster local serve/run.
3. Web-safe module output for selected code.
4. WASM for isolated compute-heavy functions.
5. Native/system output where deployment needs it.
6. Accelerator planning and reports for AI/vector workloads.
```

The first public promise should be:

```text
LogicN makes secure web runtime behavior typed, explicit, reportable and
AI-readable.
```
