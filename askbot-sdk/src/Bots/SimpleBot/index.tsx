import { AnimatePresence, motion } from "motion/react";
import ChatWrapper from "./ChatWrapper";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { GlobalVarsActions } from "@/Redux/slices/GlobalVars";
import type { ValueTransition } from "motion";

const transitions: ValueTransition = {
    delay: 0.25,
    type: "spring",
    stiffness: 200,
    damping: 20,
};

const SimpleBot = () => {
    const isOpen = useAppSelector((state) => state.GlobalVars.botUI);
    const dispatch = useAppDispatch();

    return (
        <motion.div
            className="__SIMPLE__BOT__"
            onClick={() => {
                if (!isOpen) dispatch(GlobalVarsActions.setBotUI(true));
            }}
            style={{
                cursor: isOpen ? "unset" : "pointer",
            }}
            initial={false}
            whileHover={{ scale: 1.01 }}
            animate={{
                borderRadius: 10,
                width: isOpen ? 400 : 60,
                height: isOpen ? 400 : 60,
            }}
            transition={{
                borderRadius: transitions,
                width: transitions,
                height: transitions,
            }}
        >
            <AnimatePresence mode="wait">
                {isOpen && <ChatWrapper />}
            </AnimatePresence>
            <AnimatePresence mode="wait">
                {!isOpen && (
                    <motion.img
                        initial={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.2 } }}
                        className="BOT_PROFILE_PIC"
                        src="https://www.w3schools.com/howto/img_avatar.png"
                        alt=""
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SimpleBot;
