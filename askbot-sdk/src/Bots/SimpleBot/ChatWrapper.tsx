import ChatHead from "./ChatHead";
import ChatBody from "./ChatBody";
import ChatFoot from "./ChatFoot";
import { motion } from "motion/react";

const ChatWrapper = () => {
    return (
        <motion.div
            className="__SIMPLE__BOT__CHAT_WRAPPER"
            initial={{
                opacity: 0,
                transition: { duration: 0.3 },
            }}
            animate={{
                opacity: 1,
                transition: { duration: 0.3, delay: 0.5 },
            }}
            exit={{
                opacity: 0,
                transition: { duration: 0.2 },
            }}
        >
            <ChatHead />
            <ChatBody />
            <ChatFoot />
        </motion.div>
    );
};

export default ChatWrapper;
