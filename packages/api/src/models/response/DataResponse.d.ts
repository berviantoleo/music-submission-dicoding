import { StatusResponse } from "./StatusResponse";

export interface DataResponse<T> {
  data: { [key: string]: T };
}

export type StatusDataResponse<T> = DataResponse<T> | StatusResponse;