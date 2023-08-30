import React from 'react';
import styles from './Driver.module.scss';
import clsx from 'clsx';
import { TDriverProps } from 'src/features/Application/Application.types';

interface IDriverProps extends TDriverProps {
  distance: number;
}

const formatDistance = (metres: number): string => {
  return metres < 1000 ? metres + 'м' : (metres / 1000).toFixed(1) + 'км';
};

const Driver: React.FC<IDriverProps> = ({
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
      <div className={styles.distance}>{formatDistance(distance)}</div>
    </div>
  );
};

export default Driver;
