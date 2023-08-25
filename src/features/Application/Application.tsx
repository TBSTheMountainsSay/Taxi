import React from 'react';
import styles from './Application.module.scss';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import CustomTitleSmall from '../../components/CustomTitleSmall/CustomTitleSmall';
import Driver from '../../components/Driver/Driver';
import CustomButton from '../../components/CustomButton/CustomButton';

type TApplicationProps = {};

const Application: React.FC<TApplicationProps> = ({}) => {
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
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab1f11837637e83ae3958622ca70d4b88b4ddce263b50f7385f5234ab5eaa7d42&amp;source=constructor"
            width="100%"
            height="450"
            frameBorder="0"
          ></iframe>
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
