import { StatusResponse } from "./StatusResponse";

export interface MessageOnlyResponse {
  message: string
}

export type MessageResponse = MessageOnlyResponse | StatusResponse;