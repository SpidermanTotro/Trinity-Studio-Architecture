# AGENTS.md

## Repository status

This repository is currently an architecture and planning seed for Trinity Studio.
The default branch contains documentation only; it does not yet contain a runnable
application, package manifest, installer, or test suite.

Do not describe planned components as implemented. Keep architecture proposals,
proofs of concept, and production code clearly separated.

## Product direction

Trinity Studio should become a small, local-first management layer for TrinityCore
development and server operations.

Non-negotiable constraints:

- work offline by default
- prefer local Ollama models and local tools
- require no cloud account, subscription, telemetry, or sign-in
- never commit API keys, credentials, database dumps, player data, or generated binaries
- keep TrinityCore itself as an upstream dependency instead of copying its large source tree here
- preserve compatibility with Linux first; document other platforms rather than claiming support
- keep privileged server operations explicit and user-confirmed

## Change discipline

1. Confirm whether a change is documentation, prototype, or production code.
2. Keep pull requests small enough to review and validate independently.
3. Add an issue or design note before introducing a new framework or service.
4. If executable code is added, include its package manifest, a minimal test, and CI in the same pull request.
5. Do not merge generated “complete system” implementations without running their build and tests.
6. Do not silently revive code from closed pull requests; inspect and port only the verified pieces.

## Proposed boundaries

A future implementation should keep these responsibilities separate:

- `core-adapter`: read-only discovery of TrinityCore source, builds, configuration, and process state
- `workspace`: project profiles and local paths, with secrets stored outside Git
- `doctor`: dependency, database, port, permission, and build diagnostics
- `runner`: explicit start, stop, build, and test commands with dry-run output
- `ui`: optional presentation layer consuming the same local APIs as the CLI
- `ai`: optional Ollama assistance that cannot execute privileged actions without confirmation

The first executable milestone should be a small CLI with `status`, `doctor`,
`scan`, and `config` commands. A desktop interface should come later.

## Validation

For documentation-only changes:

- check Markdown structure and links
- verify every capability is labelled as current, proposed, or experimental

Once code exists, replace this section with the repository's exact install, lint,
test, build, and smoke-test commands.
