import type { BotMessage, UserMessage } from "@/types/message";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type init = {
    messages: Array<BotMessage | UserMessage>
}
const initialState: init = {
    messages: [],
};

const Slice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<init["messages"]>) {
            state.messages = action.payload;
        },
        addMessage(state, action: PayloadAction<BotMessage | UserMessage>) {
            state.messages.push(action.payload);
        }
    },
});

export const MessageActions = Slice.actions;

export default Slice.reducer;