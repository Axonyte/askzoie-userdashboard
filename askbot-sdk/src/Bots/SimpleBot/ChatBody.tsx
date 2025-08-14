import MessageService from "@/services/MessageService";
import type { BotMessage, UserMessage } from "@/types/message";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState, type FC } from "react";

const ChatBody = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["user-messages"],
        queryFn: async () => {
            const messages = await MessageService.getMessages();
            return messages;
        },
    });

    return (
        <motion.div className="__SIMPLE__BOT__BODY__">
            {isLoading && <div className="loading-all-messages">Loading</div>}
            <div className="messages">
                {data?.map((message) => (
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
                            delay: !isHovered ? 0 : 0.15,
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
