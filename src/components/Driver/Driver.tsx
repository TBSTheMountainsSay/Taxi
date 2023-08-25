import React from 'react';
import styles from './Driver.module.scss';
import clsx from 'clsx';

type TDriverProps = {
  crew_id?: number;
  car_mark: string;
  car_model: string;
  car_color: string;
  car_number?: string;
  driver_name?: string;
  driver_phone?: number;
  lat?: number;
  lon?: number;
  distance: number;
  isChoosen?: boolean;
};

const Driver: React.FC<TDriverProps> = ({
  crew_id,
  car_mark,
  car_model,
  car_color,
  car_number,
  driver_name,
  driver_phone,
  lat,
  lon,
  distance,
  isChoosen,
}) => {
  return (
    <div className={clsx(styles.driver, { [styles.border]: isChoosen })}>
      <div className={styles.carInfo}>
        <div className={styles.car}>{car_mark + ' ' + car_model}</div>
        <div className={styles.carColor}>{car_color}</div>
        <div className={styles.carNumber}>{car_number}</div>
      </div>
      <div className={styles.distance}>{distance + 'м'}</div>
    </div>
  );
};

export default Driver;
