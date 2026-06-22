# The Engineering Playbook

A living knowledge base for developers and QA — practical guides, checklists, and self-assessments.

**Live site:** https://sanmanchekar.github.io/engineering-playbook/

## What's inside

- **Ten Commandments** — universal engineering principles
- **Developer Guides** — local setup, git, code review, CI/CD
- **QA Guides** — test strategy, automation, bug reporting, regression
- **DevOps** — Docker, Kubernetes, observability, incident response
- **API & Architecture** — REST, GraphQL, microservices, ADRs
- Interactive quizzes, Mermaid diagrams, multi-language code tabs, dark mode

## Local development

```bash
npm install
npm run start    # dev server with hot reload at http://localhost:3000
npm run build    # production build to ./build
npm run serve    # serve the built site locally
```

## Contributing

1. Branch off `main`
2. Add or edit Markdown / MDX files under `docs/`
3. Open a PR — `main` auto-deploys via GitHub Actions

Built with [Docusaurus](https://docusaurus.io/).
