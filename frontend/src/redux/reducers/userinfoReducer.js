const defaultState = null;
const userinfo = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_USERINFO':
      if (action.payload) {
        window.localStorage.userinfo = JSON.stringify(action.payload);
        window.localStorage.token = action.payload.token;
      } else {
        window.localStorage.removeItem('userinfo');
        window.localStorage.removeItem('token');
      }
      return action.payload;
    default:
      return state;
  }
};
export default userinfo
