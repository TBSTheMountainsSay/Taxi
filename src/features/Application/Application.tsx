import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Application.module.scss';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import CustomTitleSmall from '../../components/CustomTitleSmall/CustomTitleSmall';
import Driver from '../../components/Driver/Driver';
import CustomButton from '../../components/CustomButton/CustomButton';
import {
  Map,
  Placemark,
  SearchControl,
  withYMaps,
} from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { Simulate } from 'react-dom/test-utils';
import error = Simulate.error;
import { useAppDispatch, useAppSelector } from '../../app/hooks';

type TApplicationProps = {};

const Application: React.FC<TApplicationProps> = ({}) => {
  const API_KEY = '05f8d2ae-bd94-4329-b9f9-7351e2ec9627';
  const dispatch = useAppDispatch();
  const drivers = useAppSelector((state) => state.ApplicationReducer.drivers);

  const ymaps = React.useRef<YMapsApi>(null);

  const [newCoords, setNewCoords] = useState<[number, number]>([
    56.852909, 53.209912,
  ]);
  const [address, setAddress] = useState<any>();

  const handleTouch = useCallback(
    (event: any) => {
      let myCoords = event.get('coords');
      setNewCoords(myCoords);

      if (!ymaps.current) return;
      ymaps.current
        .geocode(myCoords)
        .then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0);

          const newAddress = [
            firstGeoObject.getLocalities().length
              ? firstGeoObject.getLocalities()
              : firstGeoObject.getAdministrativeAreas(),
            firstGeoObject.getThoroughfare() || firstGeoObject.getPremise(),
            firstGeoObject.getPremiseNumber(),
          ]
            .filter(Boolean)
            .join(', ');
          firstGeoObject.getAddressLine();
          setAddress(() => newAddress);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [ymaps]
  );

  return (
    <div className={styles.application}>
      <CustomTitle title={'Детали заказа'} />
      <div className={styles.detailsWrapper}>
        <div className={styles.detailsText}>
          <CustomTitleSmall title={'Откуда:'} />
        </div>
        <div className={styles.details}>
          <input
            type="text"
            id="suggest"
            placeholder={'Укажите адрес'}
            className={styles.input}
            value={address}
          />
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
              center: newCoords,
              zoom: 15,
              controls: ['zoomControl', 'fullscreenControl'],
            }}
            modules={[
              'control.ZoomControl',
              'control.FullscreenControl',
              'SuggestView',
            ]}
            width={'100%'}
            height={450}
            onClick={handleTouch}
            onLoad={(e) => {
              // @ts-ignore
              ymaps.current = e;
            }}
          >
            <Placemark
              geometry={newCoords}
              options={{
                preset: 'islands#yellowIcon',
                draggable: true,
              }}
              properties={{
                hintContent: address,
                balloonContent: address,
              }}
            />
            {drivers.map((driver) => {
              return (
                <Placemark
                  key={driver.crew_id}
                  defaultGeometry={[driver.lat, driver.lon]}
                  options={{ preset: 'islands#greenIcon', draggable: false }}
                  properties={{
                    hintContent: `Экипаж такси (${
                      driver.car_color +
                      ' ' +
                      driver.car_mark +
                      ' ' +
                      driver.car_model
                    })`,
                    balloonContent: `Экипаж такси (${
                      driver.car_color +
                      ' ' +
                      driver.car_mark +
                      ' ' +
                      driver.car_model
                    })`,
                  }}
                />
              );
            })}
            <SearchControl options={{ float: 'right' }} />
          </Map>
        </div>
        <div className={styles.drivers}>
          {drivers.map((driver) => {
            return (
              <Driver
                car_mark={driver.car_mark}
                car_model={driver.car_model}
                car_color={driver.car_color}
                //Формула Хаверсина
                distance={Math.round(
                  60 *
                    1.1515 *
                    (180 / Math.PI) *
                    Math.acos(
                      Math.sin(newCoords[0] * (Math.PI / 180)) *
                        // @ts-ignore
                        Math.sin(driver.lat * (Math.PI / 180)) +
                        Math.cos(newCoords[0] * (Math.PI / 180)) *
                          // @ts-ignore
                          Math.cos(driver.lat * (Math.PI / 180)) *
                          Math.cos(
                            // @ts-ignore
                            (newCoords[1] - driver.lon) * (Math.PI / 180)
                          )
                    ) *
                    1609.344
                )}
              />
            );
          })}
        </div>
      </div>
      <CustomButton title={'Заказать'} />
    </div>
  );
};

export default Application;
