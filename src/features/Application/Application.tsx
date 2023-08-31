import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Application.module.scss';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import CustomTitleSmall from '../../components/CustomTitleSmall/CustomTitleSmall';
import Driver from '../../components/Driver/Driver';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { changeCurrentAddress, createOrder } from './application.slice';
import { TDriverProps } from './Application.types';
import { enqueueSnackbar } from 'notistack';

type TApplicationProps = {};

const haversineFormula = (
  coordinates: [number, number],
  driver: TDriverProps
) => {
  return Math.round(
    60 *
      1.1515 *
      (180 / Math.PI) *
      Math.acos(
        Math.sin(coordinates[0] * (Math.PI / 180)) *
          // @ts-ignore
          Math.sin(driver.lat * (Math.PI / 180)) +
          Math.cos(coordinates[0] * (Math.PI / 180)) *
            // @ts-ignore
            Math.cos(driver.lat * (Math.PI / 180)) *
            Math.cos(
              // @ts-ignore
              (coordinates[1] - driver.lon) * (Math.PI / 180)
            )
      ) *
      1609.344
  );
};

const Application: React.FC<TApplicationProps> = ({}) => {
  const dispatch = useAppDispatch();

  const ymaps = React.useRef<YMapsApi>(null);
  const [activeClue, setActiveClue] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    56.852909, 53.209912,
  ]);
  const [address, setAddress] = useState<string>();
  const [addressVariants, setAddressVariants] = useState<string[]>([]);
  const [center, setCenter] = useState<[number, number]>(coordinates);

  const drivers = useAppSelector((state) => state.ApplicationReducer.drivers)
    .map((driver) => ({
      ...driver,
      //Формула Хаверсина
      distance: haversineFormula(coordinates, driver),
    }))
    .sort((a, b) => a.distance - b.distance);

  const nearDriver = drivers[0];

  const saveAddress = useCallback(
    (address: string, coords: [number, number]) => {
      dispatch(changeCurrentAddress({ address, coordinates: coords }));
    },
    []
  );

  const saveOrder = useCallback((source_time: string, crew_id: number) => {
    dispatch(createOrder({ source_time, crew_id }));
  }, []);

  const handleTouch = useCallback(
    (event: any) => {
      let myCoords = event.get('coords');
      setCoordinates(myCoords);

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
          // saveAddress(myCoords, newAddress);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [ymaps, saveAddress]
  );

  const handleChangeAddress = (event: React.ChangeEvent<HTMLInputElement>) => {
    const currentAddress = event.target.value;
    setAddress(currentAddress);
    setActiveClue(true);
    if (!ymaps.current) return;
    ymaps.current.geocode(currentAddress).then((res: any) => {
      const addressesArray = res.geoObjects.toArray();
      setAddressVariants(
        addressesArray.map((item: any) => item.properties._data.text)
      );
    });
  };

  const handleChooseAddress = (addressVariant: any) => {
    setAddress(addressVariant);
    setActiveClue(false);

    if (!ymaps.current) return;
    ymaps.current
      .geocode(addressVariant)
      .then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0).geometry._coordinates;
        setCoordinates(firstGeoObject);
        setCenter(firstGeoObject);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCreateOrder = () => {
    if (
      !address ||
      (coordinates[0] === 56.852909 && coordinates[1] === 53.209912)
    ) {
      enqueueSnackbar('Адрес не найден!', { variant: 'error' });
      return;
    } else {
      if (!address) return;
      const regExp = /\.|-|:|T|Z|\$/g;
      const currentDate = new Date().toISOString().replace(regExp, '');
      saveAddress(address, coordinates);
      // @ts-ignore
      saveOrder(currentDate, nearDriver.crew_id);
      enqueueSnackbar('Заказ создан', { variant: 'success' });
    }
  };

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
            onChange={handleChangeAddress}
            autoComplete={'off'}
          />
          <div className={styles.clue}>
            {addressVariants.length > 0 &&
              activeClue &&
              addressVariants.slice(0, 5).map((addressVariant: any) => (
                <div
                  key={addressVariant}
                  className={styles.clueItem}
                  onClick={() => handleChooseAddress(addressVariant)}
                >
                  {addressVariant}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.detailsText}>
          <CustomTitleSmall title={'Подходящий экипаж:'} />
        </div>
        <div className={styles.details}>
          <div className={styles.automobile}>
            <Driver {...nearDriver} isChoosen={true} />
          </div>
        </div>
      </div>
      <div className={styles.info}>
        <div className={styles.map}>
          <Map
            state={{
              center: center,
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
              geometry={coordinates}
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
          </Map>
        </div>
        <div className={styles.drivers}>
          <div className={styles.driversTitle}>Ближайшие экипажи</div>
          {drivers.slice(0, 4).map((driver) => {
            return (
              <Driver
                key={driver.crew_id}
                car_mark={driver.car_mark}
                car_model={driver.car_model}
                car_color={driver.car_color}
                distance={driver.distance}
              />
            );
          })}
        </div>
      </div>
      <CustomButton title={'Заказать'} onClick={handleCreateOrder} />
    </div>
  );
};

export default Application;
