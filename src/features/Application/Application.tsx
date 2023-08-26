import React, { useState } from 'react';
import styles from './Application.module.scss';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import CustomTitleSmall from '../../components/CustomTitleSmall/CustomTitleSmall';
import Driver from '../../components/Driver/Driver';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Map, Placemark } from '@pbe/react-yandex-maps';

type TApplicationProps = {};

const Application: React.FC<TApplicationProps> = ({}) => {
  const [map, setMap] = useState<ymaps.Map>();
  console.log(map);

  return (
    <div className={styles.application}>
      <CustomTitle title={'Детали заказа'} />
      <div className={styles.detailsWrapper}>
        <div className={styles.detailsText}>
          <CustomTitleSmall title={'Откуда:'} />
        </div>
        <div className={styles.details}>
          <input placeholder={'Укажите адрес'} className={styles.input} />
        </div>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.detailsText}>
          <CustomTitleSmall title={'Подходящий экипаж:'} />
        </div>
        <div className={styles.details}>
          <div className={styles.automobile}>
            <Driver
              car_mark={'Chevrolet'}
              car_model={'Tahoe'}
              car_color={'Синий'}
              distance={100}
              isChoosen={true}
              car_number={'А832ТС'}
            />
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.map}>
          <Map
            defaultState={{
              center: [56.852909, 53.209912],
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl'],
            }}
            modules={['control.ZoomControl', 'control.FullscreenControl']}
            width={'100%'}
            height={450}
            instanceRef={(value) => {
              setMap(value);
            }}
          >
            <Placemark defaultGeometry={[56.852909, 53.209912]} />
          </Map>
        </div>
        <div className={styles.drivers}>
          <Driver
            car_mark={'Chevrolet'}
            car_model={'Tahoe'}
            car_color={'Синий'}
            distance={100}
          />
          <Driver
            car_mark={'Chevrolet'}
            car_model={'Tahoe'}
            car_color={'Черный'}
            distance={200}
          />
          <Driver
            car_mark={'Chevrolet'}
            car_model={'Tahoe'}
            car_color={'Серый'}
            distance={300}
          />
          <Driver
            car_mark={'Chevrolet'}
            car_model={'Tahoe'}
            car_color={'Белый'}
            distance={400}
          />
        </div>
      </div>
      <CustomButton title={'Заказать'} />
    </div>
  );
};

export default Application;
