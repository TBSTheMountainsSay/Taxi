import React from 'react';
import styles from './CustomButton.module.scss';

type TCustomButtonProps = { title: string };

const CustomButton: React.FC<TCustomButtonProps> = ({ title }) => {
  return (
    <div className={styles.CustomButton}>
      <button>{title}</button>
    </div>
  );
};

export default CustomButton;
