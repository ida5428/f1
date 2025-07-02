import React from 'react';
import styles from "./LayoutComponents.module.css";

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? '/f1-site' : '';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1><a href="/">Formula 1</a></h1>
      <nav>
        <ul>
          <li><a href={`${basePath}/race`}>Race</a></li>
          <li><a href={`${basePath}/drivers`}>Drivers</a></li>
          <li><a href={`${basePath}/teams`}>Teams</a></li>
        </ul>
      </nav>
    </header>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div>
        <p><strong>Disclaimer:</strong> This site is an unofficial project and is not affiliated with <strong>Formula 1®</strong>, the <strong>FIA</strong>, or any related entities. All trademarks are property of their respective owners.</p>
      </div>
      <div>
        <p>All data provided by the <a href="https://openf1.org/"><strong>OpenF1 API</strong></a>.</p>
      </div>
    </footer>
  );
};