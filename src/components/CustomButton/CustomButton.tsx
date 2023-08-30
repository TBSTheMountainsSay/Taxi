import React from 'react';
import styles from './CustomButton.module.scss';

type TCustomButtonProps = { title: string; onClick?: () => void };

const CustomButton: React.FC<TCustomButtonProps> = ({ title, onClick }) => {
  return (
    <div className={styles.CustomButton}>
      <button onClick={onClick}>{title}</button>
    </div>
  );
};

export default CustomButton;
