import { atom } from "recoil";

export const ctImagesState = atom({
  key: "ctImagesState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});