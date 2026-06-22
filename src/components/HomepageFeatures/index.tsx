import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  to: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'The Ten Commandments',
    emoji: '📜',
    to: '/docs/commandments/intro',
    description: <>The non-negotiables every engineer — dev or QA — should internalize. Read once, live by daily.</>,
  },
  {
    title: 'Developer Guides',
    emoji: '💻',
    to: '/docs/dev/intro',
    description: <>Local setup, git workflow, code review, CI/CD — the bread and butter of day-to-day shipping.</>,
  },
  {
    title: 'QA Guides',
    emoji: '🔍',
    to: '/docs/qa/intro',
    description: <>Test strategy, automation frameworks, bug reporting templates, regression checklists.</>,
  },
  {
    title: 'DevOps & Infra',
    emoji: '⚙️',
    to: '/docs/devops/intro',
    description: <>Docker, Kubernetes, observability, incident response runbooks.</>,
  },
  {
    title: 'API & Architecture',
    emoji: '🏛️',
    to: '/docs/api/intro',
    description: <>REST design, GraphQL, microservices patterns, Architecture Decision Records.</>,
  },
  {
    title: 'Interactive Quizzes',
    emoji: '🧠',
    to: '/docs/commandments/quiz',
    description: <>Test what you've learned with built-in self-assessments at the end of every section.</>,
  },
];

function Feature({title, emoji, description, to}: FeatureItem) {
  return (
    <div className={clsx('col col--4', styles.featureCol)}>
      <Link to={to} className={styles.featureCard}>
        <div className={styles.featureEmoji}>{emoji}</div>
        <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
        <p className={styles.featureDesc}>{description}</p>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
