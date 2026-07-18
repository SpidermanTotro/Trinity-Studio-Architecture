# Trinity Studio repository instructions

Read and follow `AGENTS.md` before changing this repository.

This is currently a documentation-only architecture seed, not a completed Trinity
Studio application. Never claim that planned modules, installers, dashboards, AI
debuggers, or server controls already exist.

Keep changes local-first and Linux-first:

- prefer Ollama and local services
- add no required cloud API, sign-in, subscription, or telemetry
- never commit credentials, database dumps, player data, or generated binaries
- do not vendor the TrinityCore source tree
- keep changes small, reviewable, and backed by real validation

If adding the first executable code, start with a minimal CLI and include a package
manifest, tests, and CI in the same pull request. Treat closed pull requests as
unverified proposals; port code from them only after inspecting and testing it.
