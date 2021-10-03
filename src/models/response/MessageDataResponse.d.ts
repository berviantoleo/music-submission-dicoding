import { MessageResponse } from "./MessageResponse";
import { DataResponse } from "./DataResponse";
export type MessageDataResponse<T> = MessageResponse | DataResponse<T>;