import React from 'react';
import styles from './CustomTitleSmall.module.scss'

type TCustomTitleSmallProps = {title: string}

const CustomTitleSmall: React.FC<TCustomTitleSmallProps> = ({title}) => {
  return (
    <div className={styles.customTitleSmall}>
      <div className={styles.titleSmall}>{title}</div>
    </div>
  );
};

export default CustomTitleSmall;