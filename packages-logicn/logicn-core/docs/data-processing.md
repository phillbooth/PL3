# LogicN Data Processing Packages

## Purpose

This document defines the LogicN data-processing package direction.

Data processing should be package-owned, typed, streaming-capable, memory-bounded
and reportable. LogicN core may define syntax and safety contracts used by data
pipelines, but HTML parsing, search indexing, archival storage, database
archive adapters and content extraction belong in packages.

## Package Family

Use the current lowercase LogicN package naming scheme:

```text
logicn-data
logicn-data-html
logicn-data-search
logicn-data-archive
logicn-data-json
logicn-data-database
logicn-data-pipeline
logicn-data-reports
```

`logicn-data` is the umbrella package. Focused packages own parse, search,
archive, streaming and report contracts.

## Boundary

Use data packages for:

```text
HTML parse, sanitize, render and search contracts
JSON streaming and archive contracts
database archive/export contracts
search indexing and query contracts
bounded streaming pipelines
data processing security policy
memory limits and backpressure policy
archive integrity metadata
data processing report contracts
```

Do not use data packages for:

```text
browser engine implementation
database engine implementation
search engine implementation
object storage implementation
HTML/CSS layout engine implementation
unbounded scraping frameworks
unsafe parsers
unreviewed personal-data harvesting
```

## HTML Processing

`logicn-data-html` should define contracts for:

```text
HTML parsing
safe HTML rendering
sanitization policy
link extraction
text extraction
metadata extraction
HTML search document creation
unsafe element and attribute reports
```

Example:

```text
htmlPolicy userContent {
    allow elements ["p", "a", "strong", "em", "ul", "li"]
    allow attributes ["href"] on "a"
    deny scripts
    deny inlineEventHandlers
    deny remoteImages
    report html
}
```

HTML parsing must be bounded. Large documents should use streaming extraction
where possible. Unsafe HTML must produce diagnostics and redacted reports rather
than silently rendering.

## Search

`logicn-data-search` should define:

```text
search document contracts
index input contracts
query contracts
ranking metadata
filter policy
field allowlists
PII-safe indexing policy
search report contracts
```

Search packages should not become a search engine. They define typed inputs,
outputs, policy and report contracts for search providers or future engines.

## Archive

`logicn-data-archive` should define:

```text
archive item contracts
content-addressed references
manifest contracts
hash and checksum metadata
signature metadata
retention policy references
integrity verification reports
restore reports
```

Archive integrity should be explicit:

```text
archive {
    hash: sha256
    manifest: required
    verifyOnRead: true
    retention: "project-default"
    report integrity
}
```

Archive packages should not implement object storage or backup systems. They
define contracts and reports that storage adapters can satisfy.

## JSON And Database Archiving

`logicn-data-json` should define:

```text
streaming JSON decode
JSON Lines handling
schema validation
partial extraction
redaction before archive
large document memory policy
JSON archive report contracts
```

`logicn-data-database` should define:

```text
database export contracts
snapshot metadata
schema version metadata
row count and checksum reports
restore validation references
redaction and classification hooks
```

Database archive packages must not become an ORM or migration system.

## Streaming Pipelines

`logicn-data-pipeline` should define bounded pipeline contracts:

```text
stream sources
stream transforms
batch windows
backpressure
checkpointing
retry policy
quarantine policy
memory budgets
timeout policy
processing reports
```

Example:

```text
pipeline HtmlArchivePipeline {
    source: stream files from "/import/html"
    memory maxInFlightMb: 128
    backpressure: required
    checkpoint every: "1000 items"

    step parseHtml using logicn-data-html
    step extractText
    step redactSecrets
    step indexSearch using logicn-data-search
    step archiveJson using logicn-data-archive

    onItemError quarantine
    onSystemError stop
    report dataProcessing
}
```

## Security Rules

Data processing must be security-sensitive by default.

Required rules:

```text
deny network unless declared
deny shell execution
deny unsafe parser plugins
deny unbounded memory
deny secrets in reports
deny personal data indexing unless classified and approved
require input size limits
require content-type validation
require redaction before archive where policy says so
require archive integrity reports
```

## Memory Limits

Data processing packages must declare memory policy:

```text
memory {
    maxInFlightMb: 256
    maxItemMb: 32
    streaming: required
    spillToDisk: denied unless approved
    onOverflow: quarantine
}
```

Large files, large HTML documents, large JSON payloads and database exports
should use streaming and bounded batches.

## Reports

Data packages should define report contracts for:

```text
app.data-processing-report.json
app.html-processing-report.json
app.search-index-report.json
app.archive-report.json
app.archive-integrity-report.json
app.json-archive-report.json
app.database-archive-report.json
app.pipeline-report.json
```

Example:

```json
{
  "dataProcessing": {
    "pipeline": "HtmlArchivePipeline",
    "itemsRead": 12000,
    "itemsProcessed": 11980,
    "itemsQuarantined": 20,
    "maxInFlightMb": 128,
    "networkAccess": "denied",
    "archiveIntegrity": "verified",
    "reports": [
      "app.html-processing-report.json",
      "app.search-index-report.json",
      "app.archive-integrity-report.json"
    ],
    "warnings": []
  }
}
```

## Full LogicN-Style Example

```text
use logicn-data-html
use logicn-data-search
use logicn-data-archive

secure flow processHtmlArchive(input: HtmlArchiveRequest)
  -> Result<DataProcessingReport, DataProcessingError>
effects [file.read, file.write, compute.run] {
    permissions {
        deny network.any
        deny shell.run
    }

    memory {
        maxInFlightMb: 128
        maxItemMb: 16
        streaming: required
        onOverflow: quarantine
    }

    htmlPolicy safeContent {
        deny scripts
        deny inlineEventHandlers
        sanitize true
    }

    pipeline HtmlArchivePipeline {
        source: stream files from input.sourceDirectory
        step parseHtml policy safeContent
        step extractText
        step redactSecrets
        step createSearchDocument
        step writeSearchIndex
        step archiveJson hash sha256
        checkpoint every: "1000 items"
        report dataProcessing
    }

    return run HtmlArchivePipeline
}
```

## Final Rule

```text
LogicN data processing should be typed, streaming-capable, memory-bounded,
security-aware, archive-verifiable and reportable.
```
