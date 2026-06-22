import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'The Engineering Playbook',
  tagline: 'A living knowledge base for developers and QA — practical guides, checklists, and self-assessments.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://sanmanchekar.github.io',
  baseUrl: '/engineering-playbook/',

  organizationName: 'sanmanchekar',
  projectName: 'engineering-playbook',
  trailingSlash: false,
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
          editUrl:
            'https://github.com/sanmanchekar/engineering-playbook/edit/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true,
      },
    },
    navbar: {
      title: 'Engineering Playbook',
      logo: {
        alt: 'Engineering Playbook',
        src: 'img/logo.svg',
      },
      hideOnScroll: true,
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'commandments',
          position: 'left',
          label: 'Commandments',
        },
        {
          type: 'docSidebar',
          sidebarId: 'dev',
          position: 'left',
          label: 'Dev',
        },
        {
          type: 'docSidebar',
          sidebarId: 'qa',
          position: 'left',
          label: 'QA',
        },
        {
          type: 'docSidebar',
          sidebarId: 'devops',
          position: 'left',
          label: 'DevOps',
        },
        {
          type: 'docSidebar',
          sidebarId: 'api',
          position: 'left',
          label: 'API & Architecture',
        },
        {
          href: 'https://github.com/sanmanchekar/engineering-playbook',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Sections',
          items: [
            {label: 'Ten Commandments', to: '/docs/commandments/intro'},
            {label: 'Dev Guides', to: '/docs/dev/intro'},
            {label: 'QA Guides', to: '/docs/qa/intro'},
            {label: 'DevOps', to: '/docs/devops/intro'},
            {label: 'API & Architecture', to: '/docs/api/intro'},
          ],
        },
        {
          title: 'Contribute',
          items: [
            {label: 'GitHub', href: 'https://github.com/sanmanchekar/engineering-playbook'},
            {label: 'Issues', href: 'https://github.com/sanmanchekar/engineering-playbook/issues'},
            {label: 'How to contribute', to: '/docs/commandments/intro'},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Engineering Playbook. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'docker', 'yaml', 'json', 'python', 'go', 'java', 'sql'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
