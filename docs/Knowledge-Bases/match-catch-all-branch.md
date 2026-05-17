# Match Catch-All Branch

## Purpose

The match catch-all branch handles every value that was not matched by earlier
branches.

In LogicN syntax, this form:

```logicn
_ => {
  ...
}
```

means:

```text
anything else goes here
```

or:

```text
otherwise do this
```

## Example

```logicn
match payload.event {
  "payment.succeeded" => {
    Payments.markOrderPaid(payload.orderId, payload.amount)
  }

  "payment.failed" => {
    Payments.markOrderFailed(payload.orderId)
  }

  _ => {
    Log.safe("Ignored unknown payment webhook event")

    return Ok({
      received: true,
      duplicate: false,
      ignored: true
    })
  }
}
```

If `payload.event` is neither `"payment.succeeded"` nor `"payment.failed"`,
LogicN runs the `_` branch.

## Meaning

| Syntax | Meaning |
| --- | --- |
| `"payment.succeeded" => { ... }` | Run when the value equals `"payment.succeeded"` |
| `"payment.failed" => { ... }` | Run when the value equals `"payment.failed"` |
| `_ => { ... }` | Run for anything else |

## Security Rule

The catch-all branch must not silently hide unknown security-sensitive cases.

For webhooks, external events, payment states, auth states, permissions,
`Tri`, `Decision`, `Result<T, E>` and other security-sensitive matches, the
catch-all branch should do one of these:

- return a typed error
- return an explicit ignored response
- log a safe redacted event
- trigger manual review
- fail closed

## Accepted Patterns

Explicitly ignore unknown webhook events:

```logicn
_ => {
  Log.safe("Ignored unknown payment webhook event")

  return Ok({
    received: true,
    ignored: true
  })
}
```

Reject unknown webhook events:

```logicn
_ => {
  return Err(UnknownWebhookEvent)
}
```

Fail closed for permissions:

```logicn
_ => {
  return Err(SecurityError.denied("Unknown permission decision"))
}
```

## Rejected Pattern

This is unsafe because the unknown event is silently swallowed:

```logicn
_ => {
}
```

This is also unsafe in a security-sensitive flow because it proceeds as if the
unknown case were acceptable:

```logicn
_ => {
  return Ok(Allowed)
}
```

## Exhaustive Match Relationship

For closed enums, `Option<T>`, `Result<T, E>`, `Tri` and `Decision`, LogicN
should prefer exhaustive explicit branches.

Use `_` when the input is open-ended or externally controlled, such as:

- webhook event names
- external provider status strings
- API version values
- unknown future enum values from another service

Even then, `_` must be explicit and reportable.

## Reports

LogicN should report catch-all branches in:

```text
match-coverage-report.json
webhook-report.json
security-report.json
ai-context-report.json
```

The report should identify:

- which match used a catch-all branch
- whether the matched value is externally controlled
- whether the branch returns an error, ignored response or safe log
- whether the branch is security-sensitive
- whether the branch is allowed by policy

## AI Guidance

AI tools should not remove `_` branches from open-ended external matches. AI
tools should also not add a catch-all branch that hides missing cases in a
closed security-sensitive match.

The safe recommendation is:

```text
Use explicit branches for known closed states.
Use `_` only as an explicit fallback for unknown open-ended values.
Make the fallback observable, typed and safe.
```
