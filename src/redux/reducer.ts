import { SET_COLOR, SET_LINE } from "./action";
type ActionTypes = typeof SET_COLOR | typeof SET_LINE;

interface ActionPayload {
  type: ActionTypes;
  payload?: any;
}

export type RootState = {
  color: string;
  line: number;
};

const initialState: RootState = {
  color: "",
  line: 5,
};

const rootReducer = (state = initialState, action: ActionPayload): RootState => {
  switch (action.type) {
    case SET_COLOR:
      return { ...state, color: action.payload };
    case SET_LINE:
      return { ...state, line: action.payload };
    default:
      return state;
  }
};

export default rootReducer;
