import { TDriver } from '../features/Application/Application.types';
import { GET_CREWS_RESPONSE } from '../features/Application/application.mocks';

export const applicationAPI = {
  getCrews: (
    source_time: string,
    addresses: { address: string; lat: number; lon: number }[]
  ) =>
    new Promise<{
      code: number;
      descr: string;
      data: { crews_info: TDriver[] };
    }>((resolve) => setTimeout(() => resolve(GET_CREWS_RESPONSE), 500)),

  createOrder: (
    source_time: string,
    addresses: { address: string; lat: number; lon: number }[],
    crew_id?: number
  ) =>
    new Promise<{ code: number; descr: string; data: { order_id: number } }>(
      (resolve) =>
        setTimeout(
          () => resolve({ code: 0, descr: 'OK', data: { order_id: 12345 } }),
          500
        )
    ),
};
