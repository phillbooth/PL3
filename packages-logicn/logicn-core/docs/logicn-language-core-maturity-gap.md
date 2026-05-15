# LogicN Language Core Maturity Gap

## Purpose

This document records what LogicN still needs before it can look serious next
to mature systems languages, ignoring legacy baggage in those languages.

LogicN already has a strong direction:

```text
strict typing
explicit Option and Result
memory-safety goals
API contracts
JSON decoding
security policies
compute planning
source maps
reports
AI-readable project context
GPU, photonic, ternary and Omni-logic planning
CPU-compatible execution as the baseline
```

But LogicN is still a language-design and v0.1 prototype project. It must not
present planning documents, simulation reports or prototype checker slices as a
production compiler.

The biggest missing item is not a convenience syntax feature. It is a complete,
enforceable language core:

```text
parser
AST
symbol table
type checker
memory checker
effect checker
module system
trait/protocol system
FFI boundary
test model
standard library
source-mapped runtime errors
build and release modes
package manager
```

## Systems Language Baseline

The comparison baseline includes mature native compilers and memory-safe
systems languages. C++ and Rust are useful references in this document only
because they expose concrete maturity expectations for compiler pipelines,
resource safety, package tooling and low-level integration.

## Missing Compared With Mature Native Toolchains

| Area | What C++ Has | What LogicN Needs |
| --- | --- | --- |
| Mature native compiler | Mature compilers, optimisers, linkers and platform support. | A production compiler pipeline beyond prototype parsing, checking and report generation. |
| ABI and systems integration | Native libraries, drivers, engines, embedded code and OS-level integration. | A defined C ABI and FFI boundary with ownership, nullability, layout and audit reports. |
| RAII and deterministic cleanup | Resource lifetime tied to object lifetime through destructors. | Scoped cleanup for files, sockets, locks, GPU buffers, model handles, DB connections and temporary secrets. |
| Templates and generics | Function templates, class templates, specialisation and compile-time code generation. | A full generic function/type system, constraints, specialisation rules and clear compile-time behavior. |
| Concepts and constraints | C++20 concepts constrain valid template arguments. | Traits, protocols, `where` or `requires`-style constraints for reusable libraries. |
| Compile-time computation | `constexpr` for compile-time values and functions. | Safe compile-time evaluation for constants, schemas, route manifests, numeric shapes, target selection and AI metadata. |
| Operator overloading | Domain-specific operators for maths and custom types. | A controlled operator model for `Money`, `Vector`, `Matrix`, `Tensor`, `Tri`, `LogicN`, complex numbers and photonic maths. |
| Low-level performance controls | Layout, alignment, atomics, memory ordering, allocators and SIMD/intrinsics. | Safe layout, packed structures, alignment, allocation policy, atomics, data-race rules and CPU feature targeting. |
| Stable modules | Language modules for logical code division. | Final module/package syntax, import rules and visibility rules. |
| Standard library depth | Containers, algorithms, I/O, strings, dates, concurrency, maths and more. | A small practical standard library first, then carefully staged expansion. |
| Debug/profiling ecosystem | Debuggers, profilers, sanitizers and performance tools. | `LogicN debug`, `LogicN profile`, allocation reports, flamegraph-style output and source-mapped runtime errors. |
| Build/release modes | Debug/release builds, optimisation flags, link modes and deployment targets. | Final debug/release modes, build layout, signing, source-map output rules and deployment workflow. |

## Missing Compared With Memory-Safe Systems Toolchains

| Area | What Rust Has | What LogicN Needs |
| --- | --- | --- |
| Finished ownership checker | A mature ownership, borrowing and lifetime model. | A real memory checker implementation for the chosen LogicN model. |
| Lifetimes | Compiler reasoning about how references relate to each other. | Final explicit/implicit lifetime rules, borrow escape checks, graph ownership and recursive structure handling. |
| Traits | Shared behavior contracts that constrain generic types. | A trait/protocol/interface system for APIs, JSON, DB models, formatting, logging, numeric compute and AI models. |
| Cargo-style package manager | Build, test, dependency resolution, packaging and publishing. | Dependency resolution, lockfile, registry, versioning, package permissions, trusted modules, private registries and reproducible builds. |
| Crate/module privacy | Packages, crates, modules, `use`, visibility and path rules. | Final module syntax and privacy such as `public`, `private`, `internal`, package-only and test-only. |
| Macro and derive ecosystem | Declarative/procedural macros and derives. | A safer restricted alternative for schema derives, API derives, JSON encode/decode, validation, tests, OpenAPI and reports. |
| Testing model | Unit, documentation and integration tests through Cargo conventions. | LogicN test syntax, unit tests, integration tests, API tests, webhook tests, JSON validation tests, security tests and source-map tests. |
| Documentation generation | Generated API docs and strong documentation culture. | Generated docs for APIs, types, effects, permissions, examples, security assumptions and AI guides. |
| Unsafe escape hatch | Explicit `unsafe` blocks with remaining compiler checks still active. | A controlled trusted/unsafe module model for FFI, drivers, GPU kernels, native calls and OS integration. |
| Async ecosystem | `async`/`.await`, futures and mature runtimes. | Real runtime semantics for structured await, streams, cancellation propagation, bounded queues, backpressure and reports. |
| Pattern matching maturity | Mature `match`, enums and exhaustive checking. | Final algebraic variant, sealed state and exhaustive match rules. |
| Formatting/linting ecosystem | Standard `rustfmt` and Clippy expectations. | `LogicN fmt` plus `LogicN lint` for security, APIs, JSON, effects, permissions and AI-readability. |
| Panic model | Recoverable `Result` and unrecoverable `panic!`. | Clear distinctions between `Result`, fatal runtime error, security violation, failed assertion, unreachable state and process abort. |
| Ecosystem maturity | Crates, examples, docs, CI, benchmarks and production deployments. | Real examples beyond syntax demos and a small compiled native target. |

## Priority Order

The project should prioritise these before expanding advanced target claims:

1. Real compiler pipeline: parser, AST, symbol table, type checker, memory
   checker, effect checker, IR and output.
2. Traits, protocols and generic constraints.
3. Deterministic cleanup for resources and secrets.
4. Testing syntax and `LogicN test` model.
5. FFI and trusted module system.
6. Package manager and registry design.
7. Async streams, cancellation, timeouts, bounded queues and backpressure.
8. Source-mapped runtime errors across checked, binary and WASM targets.
9. Small real standard library.
10. Debug/profile/lint tooling.

## First Standard Library Baseline

Start small:

```text
print
log
File
Path
Stream
Json
Http
Env
DateTime
Result
Option
Array
Map
Set
Pattern
Crypto
Test
```

Keep framework features, ORMs, admin UI, CMS behavior and frontend framework
syntax outside the standard library.

## Honest Positioning

LogicN can stand apart only if it converts its design goals into enforceable
compiler and runtime behavior.

Required wording:

```text
LogicN is not yet a production compiler.
LogicN has prototype tooling and planning documents.
LogicN must implement the core parser, checker, memory model, effect model,
module system, traits/protocols, FFI boundary, tests and standard library before
claiming maturity next to C++ or Rust.
```

## References

- C++ RAII: <https://en.cppreference.com/w/cpp/language/raii>
- C++ templates: <https://en.cppreference.com/w/cpp/language/templates>
- C++ concepts: <https://en.cppreference.com/w/cpp/language/constraints>
- C++ `constexpr`: <https://en.cppreference.com/w/cpp/language/constexpr>
- C++ modules: <https://en.cppreference.com/w/cpp/language/modules>
- Rust generics, traits and lifetimes: <https://doc.rust-lang.org/book/ch10-00-generics.html>
- Cargo tests: <https://doc.rust-lang.org/cargo/guide/tests.html>
- Rust packages, crates and modules: <https://doc.rust-lang.org/book/ch07-00-managing-growing-projects-with-packages-crates-and-modules.html>
- Unsafe Rust: <https://doc.rust-lang.org/book/ch20-01-unsafe-rust.html>
