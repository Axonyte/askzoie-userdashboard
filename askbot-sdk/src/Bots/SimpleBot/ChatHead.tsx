import { useAuth } from "@/providers/AuthProvider";
import { useAppDispatch } from "@/Redux/Hooks";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars";
import { motion } from "motion/react";

const ChatHead = () => {
    const dispatch = useAppDispatch();
    const { botInfo } = useAuth();
    return (
        <motion.div className="__SIMPLE__BOT_HEAD__">
            <div className="left">
                <div className="logo">
                    <img
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt=""
                    />
                </div>
                <div className="content">
                    <div className="name">{botInfo?.name}</div>
                    <div className="desc">Online Now</div>
                </div>
            </div>
            <div className="right">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        dispatch(GlobalVarsActions.setBotUI(false));
                    }}
                >
                    Close
                </button>
            </div>
        </motion.div>
    );
};

export default ChatHead;
