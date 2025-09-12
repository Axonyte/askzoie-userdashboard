import { useAppDispatch } from "@/Redux/Hooks";
import { MessageActions } from "@/Redux/slices/MessageSlice";
import MessageService from "@/services/MessageService";
import { nanoid } from "@reduxjs/toolkit";
import { motion } from "motion/react";
import { useState } from "react";

const ChatFoot = () => {
    const [message, setMessage] = useState("");
    const dispatch = useAppDispatch();

    const onSubmit = async () => {
        dispatch(
            MessageActions.addMessage({
                id: nanoid(),
                isBot: false,
                message: message,
            })
        );
        const response = await MessageService.newMessage(message);
        dispatch(
            MessageActions.addMessage({
                id: nanoid(),
                isBot: true,
                message: response.botMessage,
            })
        );

        setMessage("");
    };
    return (
        <motion.div className="__SIMPLE__BOT__FOOT__">
            <input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder="Type Your Message Here!"
            />
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onSubmit}
            >
                <svg
                    width={30}
                    height={30}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M6.75 12H16.75M16.75 12L14 14.75M16.75 12L14 9.25"
                        stroke="#000000"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M2 15V9C2 6.79086 3.79086 5 6 5H18C20.2091 5 22 6.79086 22 9V15C22 17.2091 20.2091 19 18 19H6C3.79086 19 2 17.2091 2 15Z"
                        stroke="#000000"
                        strokeWidth="1.5"
                    />
                </svg>
            </motion.button>
        </motion.div>
    );
};

export default ChatFoot;
