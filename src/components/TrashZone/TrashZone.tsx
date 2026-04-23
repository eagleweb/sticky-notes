import { forwardRef } from 'react';

import styles from './TrashZone.module.css';

type TrashZoneProps = {
  active?: boolean;
};

export const TrashZone = forwardRef<HTMLDivElement, TrashZoneProps>(({ active = false }, ref) => (
  <div ref={ref} className={active ? `${styles.root} ${styles.active}` : styles.root}>
    <span className={styles.icon}>🗑</span>
    <span className={styles.label}>Drop here to delete</span>
  </div>
));
