import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Application.module.scss';
import CustomTitle from '../../components/CustomTitle/CustomTitle';
import CustomTitleSmall from '../../components/CustomTitleSmall/CustomTitleSmall';
import Driver from '../../components/Driver/Driver';
import CustomButton from '../../components/CustomButton/CustomButton';
import { Map, Placemark, SearchControl } from '@pbe/react-yandex-maps';
import { YMapsApi } from '@pbe/react-yandex-maps/typings/util/typing';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  changeCurrentAddress,
  createOrderThunk,
  getCrewsThunk,
} from './application.slice';
import { TDriver } from './Application.types';
import { enqueueSnackbar } from 'notistack';

type TApplicationProps = {};

const haversineFormula = (coordinates: [number, number], driver: TDriver) => {
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

const getDate = () => {
  const regExp = /\.|-|:|T|Z|\$/g;
  return new Date().toISOString().replace(regExp, '');
};

const Application: React.FC<TApplicationProps> = ({}) => {
  const dispatch = useAppDispatch();
  const ymaps = React.useRef<YMapsApi>(null);
  const [activeClue, setActiveClue] = useState<boolean>(false);
  const [coordinates, setCoordinates] = useState<[number, number]>([
    56.852909, 53.209912,
  ]);
  const [address, setAddress] = useState<string>('Ижевск, Центральная площадь');
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

  useEffect(() => {
    saveAddress(getDate(), address, coordinates);
    getCrews();
  }, []);

  const saveAddress = useCallback(
    (
      source_time: string,
      address: string,
      coords: [number, number],
      crew_id?: number
    ) => {
      dispatch(
        changeCurrentAddress({
          source_time,
          address,
          coordinates: coords,
          crew_id,
        })
      );
    },
    []
  );

  const getCrews = useCallback(() => dispatch(getCrewsThunk()), []);

  const saveOrder = useCallback(() => {
    dispatch(createOrderThunk());
  }, []);

  const handleTouch = useCallback(
    async (event: any) => {
      let myCoords = event.get('coords');
      setCoordinates(myCoords);
      await getCrews().unwrap();

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
          saveAddress(getDate(), newAddress, myCoords, nearDriver.crew_id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [ymaps, saveAddress, nearDriver]
  );

  const handleChangeAddress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    },
    []
  );

  const handleChooseAddress = useCallback(
    async (addressVariant: any) => {
      setAddress(addressVariant);
      setActiveClue(false);
      await getCrews().unwrap();
      if (!ymaps.current) return;
      ymaps.current
        .geocode(addressVariant)
        .then((res: any) => {
          const firstGeoObject = res.geoObjects.get(0).geometry._coordinates;
          setCoordinates(firstGeoObject);
          setCenter(firstGeoObject);
          saveAddress(
            getDate(),
            addressVariant,
            coordinates,
            nearDriver.crew_id
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [ymaps, saveAddress, nearDriver]
  );

  const handleCreateOrder = useCallback(() => {
    if (!address) {
      enqueueSnackbar('Адрес не найден!', { variant: 'error' });
      return;
    } else {
      saveAddress(getDate(), address, coordinates, nearDriver.crew_id);
      getCrews();
      saveOrder();
      enqueueSnackbar('Заказ создан!', { variant: 'success' });
    }
  }, [nearDriver]);

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
