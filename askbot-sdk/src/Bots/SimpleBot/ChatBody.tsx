import { useAuth } from "@/providers/AuthProvider";
import { useAppSelector } from "@/Redux/Hooks";
import type { BotMessage, UserMessage } from "@/types/message";
import { motion } from "motion/react";
import { useState, type FC } from "react";

const ChatBody = () => {
    const messages = useAppSelector((s) => s.MessageSlice.messages);

    const { botInfo } = useAuth();

    return (
        <motion.div className="__SIMPLE__BOT__BODY__">
            <div className="messages">
                <Message
                    msg={{
                        id: "welcome-msg",
                        isBot: true,
                        message: botInfo?.persona?.defaultGreeting as string,
                    }}
                />
                {messages?.map((message) => (
                    <Message msg={message} key={message.id} />
                ))}
            </div>
        </motion.div>
    );
};

const Message: FC<{ msg: UserMessage | BotMessage }> = ({ msg }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{
                backgroundColor: "#83838334",
                transition: {
                    duration: 0.45,
                },
            }}
            className={`message-wrapper ${
                msg.isBot ? "bot-message-warpper" : ""
            }`}
        >
            <motion.div
                animate={{
                    x: isHovered ? (msg.isBot ? 10 : -10) : 0,
                    transition: {
                        x: {
                            delay: 0,
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                        },
                    },
                }}
                className={`message ${msg.isBot ? "bot-message" : ""}`}
            >
                <div className="content">{msg.message}</div>
            </motion.div>
        </motion.div>
    );
};

export default ChatBody;
