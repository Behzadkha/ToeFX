const initialState = {
    selectedFoot: 0,
    images: [],
    toeData: []
}

/*
    Helps save the selected foot, images and toe data to the database.
    Redux
*/
export default function(state = initialState , action) {
    switch(action.type){
        case "SET_SELECTED_FOOT":
            return {
              ...state,
              selectedFoot: action.payload
            };
        case "SAVE_IMAGES":
            return {
                ...state,
                images: action.payload
            };
        case "SAVE_TOE_DATA":
            return {
                ...state,
                toeData: action.payload
            }
        default:
            return state;
    }
}
