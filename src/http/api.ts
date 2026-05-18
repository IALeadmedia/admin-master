import { appSetting } from "../constants/app-setting/config.const";
import { HttpClientFactory } from "../helpers/adapter";

export const httpClientAxios = HttpClientFactory.createHttpClient(
  'axios',
  appSetting.baseUrl,
  {
    withCredentials: true,
  },
)