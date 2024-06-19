export const SET_COLOR = "SET_COLOR";
export const SET_LINE = "SET_LINE";

export const setColor = (hex: string) => {
  return {
    type: SET_COLOR,
    payload: hex,
  };
};

export const setLine = (width: number) => {
  return {
    type: SET_LINE,
    payload: width,
  };
};
