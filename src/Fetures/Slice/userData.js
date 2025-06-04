import {createSlice} from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: "userData",
    initialState: {
        value: {},
    },
    reducers: {
        handleClickedUser: (state, action) => {
            if(Object.keys(action.payload).includes("isFriend")){
                state.value = action.payload;
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const {handleClickedUser} = counterSlice.actions;

export default counterSlice.reducer;
