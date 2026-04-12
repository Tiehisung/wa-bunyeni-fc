import { getRandomIndex } from "@/lib";
import { StylesConfig } from "react-select";

export const customStyles: StylesConfig = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    borderColor: Color.teal,
    minHeight: "40px",
    boxShadow: state.isFocused ? `0 0 0 1px ${Color.teal}` : "none",
    "&:hover": {
      borderColor: "#aaa",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 20,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? Color.lightBlue
      : state.isFocused
        ? 'whitesmoke'
        : "white",
    color: state.isSelected ? "white" : "black",
    "&:hover": {
      backgroundColor: '#e9ecef',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: Color.lightBlue,
    color: "white",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    "&:hover": {
      backgroundColor: Color.darkBlue,
      color: Color.red,
    },
  }),
};

export enum Color {
  red = "#ff3434",

  teal = "#006265",

  blue = "#0c6bef",
  lightBlue = "#2cb5ff",
  darkBlue = "#171c2e",

  grey = "#272727",

  green = "#00c846",

  modalTransparent = "#1a1212b1",

  black = "#455A64",
}

export const colors = Object.values(Color)
export const randomColor = colors[getRandomIndex(colors.length)] as string