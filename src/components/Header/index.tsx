import styles from './header.module.scss';

export function Header(): JSX.Element {
  return (
    <div className={styles.header}>
      <img src="/images/Logo.svg" alt="spacetraveling" />
    </div>
  );
}
