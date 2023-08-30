export type typeCurrentAddress = {
  address: string;
  lat: number;
  lon: number;
};

export type TDriverProps = {
  crew_id?: number;
  car_mark: string;
  car_model: string;
  car_color: string;
  car_number?: string;
  driver_name?: string;
  driver_phone?: string;
  lat?: number;
  lon?: number;
  isChoosen?: boolean;
};

export type TOrderProps = {
  source_time: string;
  addresses: typeCurrentAddress[];
  crew_id: number;
};
