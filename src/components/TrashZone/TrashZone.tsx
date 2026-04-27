import { forwardRef } from 'react';

import styles from './TrashZone.module.css';

export const TrashZone = forwardRef<HTMLDivElement>(function TrashZone(_, ref) {
  return (
    <div ref={ref} className={styles.root}>
      <span className={styles.icon}>🗑</span>
      <span className={styles.label}>Drop here to delete</span>
    </div>
  );
});
