import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  commandments: [
    {
      type: 'category',
      label: 'The Ten Commandments',
      collapsed: false,
      items: [
        'commandments/intro',
        'commandments/one-clarity-before-code',
        'commandments/two-tests-are-not-optional',
        'commandments/three-small-pull-requests',
        'commandments/four-readability-first',
        'commandments/five-no-broken-windows',
        'commandments/six-handle-errors-explicitly',
        'commandments/seven-secure-by-default',
        'commandments/eight-observability-matters',
        'commandments/nine-document-the-why',
        'commandments/ten-ship-then-improve',
        'commandments/quiz',
      ],
    },
  ],
  dev: [
    {
      type: 'category',
      label: 'Developer Guides',
      collapsed: false,
      items: [
        'dev/intro',
        'dev/local-setup',
        'dev/git-workflow',
        'dev/code-review',
        'dev/ci-cd',
        'dev/quiz',
      ],
    },
  ],
  qa: [
    {
      type: 'category',
      label: 'QA Guides',
      collapsed: false,
      items: [
        'qa/intro',
        'qa/test-strategy',
        'qa/automation',
        'qa/bug-reporting',
        'qa/regression',
        'qa/quiz',
      ],
    },
  ],
  devops: [
    {
      type: 'category',
      label: 'DevOps & Infrastructure',
      collapsed: false,
      items: [
        'devops/intro',
        'devops/docker',
        'devops/kubernetes',
        'devops/observability',
        'devops/incident-response',
        'devops/quiz',
      ],
    },
  ],
  api: [
    {
      type: 'category',
      label: 'API & Architecture',
      collapsed: false,
      items: [
        'api/intro',
        'api/rest-design',
        'api/graphql',
        'api/microservices',
        'api/slas',
        'api/adr',
        'api/quiz',
      ],
    },
  ],
};

export default sidebars;
