# Security audit 01: Jun/17/2025

## Github Dependabot alert fixed

Github dependabot alert **_Vite's server.fs.deny bypassed with /. for files under project root #1 _**fixed by upgrading vite version to vite@6.3.5

## Snyk scan

- Snyk scan was performed using `snyk scan --dev` command.
- The result was saved in `snyk-scan.json` file.
- No vulnerabilities were found across all **42**dependencies _(including dev dependencies)_.
- Also static code analysis was performed using `snyk code test` command. No issues were detected.
- No zero-days vulnerabilites detected.

## Socket.dev scan

- Socket.dev scan was performed using `socket scan create` command.
- No alerts were found.
- No zero-days vulnerabilites detected.

---

# Proposal to replace @tanstack/react-form with react-hook-form

Although [Socket.dev report on @tanstack/react-form](https://socket.dev/npm/package/@tanstack/react-form) gives 100 score on Supply Chain Security and 100 score on Vulnerability, it also highlights that this package's dependencies have 9 high alerts with Supply Chain Risks.

At the same time [report on react-hook-form](https://socket.dev/npm/package/react-hook-form) indicates only 1 medium alert of such kind. Also Quality score is higher for `react-hook-form`.

The number of weekly downloads is also much higher for `react-hook-form`.

|                             | @tanstack/react-form | react-hook-form |
| --------------------------- | -------------------- | --------------- |
| Weekly downloads on NPM     | 233,368              | 12,892,044      |
| Quality score               | 82                   | 100             |
| Supply chain security score | 100                  | 100             |
| Maintenance score           | 97                   | 95              |
| Vulnerability score         | 100                  | 100             |
| Sub dependencies alerts     |                      |                 |
