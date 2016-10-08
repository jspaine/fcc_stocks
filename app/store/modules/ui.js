const UPDATE_UI_SIZE = 'ui/UPDATE_UI_SIZE'

const initialState = {
  width: window.innerWidth,
  height: window.innerHeight
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_UI_SIZE:
      return {
        ...state,
        width: action.width,
        height: action.height
      }
    default: return state
  }
}

export const updateUiSize = (size) => ({
  type: UPDATE_UI_SIZE,
  width: size.width,
  height: size.height
})

export const getUiSize = (state) => ({
  width: state.width,
  height: state.height
})
