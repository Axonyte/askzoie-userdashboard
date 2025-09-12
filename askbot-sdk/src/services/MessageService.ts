import type { BotMessage, UserMessage } from "@/types/message";
import { AxiosClient } from "@/utils/axios";

export const DemoMessages = [
    {
        "id": "1",
        "message": "Hello! How can I assist you today?",
        "isBot": true
    },
    {
        "id": "2",
        "message": "Hi! Can you help me find a good Italian restaurant nearby?",
        "isBot": false
    },
    {
        "id": "3",
        "message": "Absolutely! Which area are you in right now?",
        "isBot": true
    },
    {
        "id": "4",
        "message": "I'm near downtown.",
        "isBot": false
    },
    {
        "id": "5",
        "message": "Great! There’s 'Luigi’s Trattoria' just 2 miles from downtown. Would you like directions?",
        "isBot": true
    },
    {
        "id": "6",
        "message": "Yes, please send me the directions.",
        "isBot": false
    },
    {
        "id": "7",
        "message": "I’ve sent the directions to your phone. Anything else I can help you with?",
        "isBot": true
    },
    {
        "id": "8",
        "message": "Can you tell me if they offer vegan options?",
        "isBot": false
    },
    {
        "id": "9",
        "message": "Yes, Luigi’s Trattoria has several vegan dishes on their menu.",
        "isBot": true
    },
    {
        "id": "10",
        "message": "Awesome! Thanks for the help.",
        "isBot": false
    }
]


class MessageService {
    static getMessages = (): Promise<(BotMessage | UserMessage)[]> => {
        return new Promise((res,) => {
            res(DemoMessages)
        })
    }
    static newMessage = async (msg: string): Promise<any> => {
        const { data } = await AxiosClient.post('/bot/chat', {
            message: msg
        });
        return data;
    }
}

export default MessageService