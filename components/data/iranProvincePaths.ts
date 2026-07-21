import { iranProvincePathsPart1 } from "./iranProvincePathsPart1";
import { iranProvincePathsPart2 } from "./iranProvincePathsPart2";
import { iranProvincePathsPart3 } from "./iranProvincePathsPart3";
import { iranProvincePathsPart4 } from "./iranProvincePathsPart4";

export type IranProvincePath = {
  className: string;
  d: string;
};

export const iranProvinces: IranProvincePath[] = [
  ...iranProvincePathsPart1,
  ...iranProvincePathsPart2,
  ...iranProvincePathsPart3,
  ...iranProvincePathsPart4,
];
