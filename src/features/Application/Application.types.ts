export type typeCurrentAddress = {
  source_time: string;
  addresses: { address: string; lat: number; lon: number };
  crew_id?: number;
};

export type TDriver = {
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

export type TOrder = {
  order_id: number;
};
