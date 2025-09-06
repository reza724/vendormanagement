export const ACTIONS = {
  SET_CONTACTS: "SET_CONTACTS",
  UPDATE_CONTACT: "UPDATE_CONTACT",
  DELETE_CONTACT: "DELETE_CONTACT",
  ADD_CONTACT: "ADD_CONTACT",
};

export const contactsReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_CONTACTS:
      return action.payload;

    case ACTIONS.UPDATE_CONTACT:
      return state.map((contact, index) =>
        index === action.index ? { ...contact, ...action.payload } : contact
      );

    case ACTIONS.DELETE_CONTACT:
      return state.filter((_, index) => index !== action.index);

    case ACTIONS.ADD_CONTACT:
      return [...state, action.payload];

    default:
      return state;
  }
};
