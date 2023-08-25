import React from 'react';
import styles from './CustomTitle.module.scss'

type TCustomTitleProps = {title: string}

const CustomTitle: React.FC<TCustomTitleProps> = ({title}) => {
  return (
    <div className={styles.customTitle}>
      <div className={styles.title}>{title}</div>
    </div>
  );
};

export default CustomTitle;