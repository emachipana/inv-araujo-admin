import { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import { BASE_URI } from "../config";
import toast from "react-hot-toast";
import { useAdmin } from "./admin";
import { useAuth } from "./auth";

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [client, setClient] = useState(null);
    const { setNotifications, setOrders, matcher, setOrdersBackup } = useAdmin();
		const { user } = useAuth();

    useEffect(() => {
			const stompClient = new Client({
				brokerURL: `${BASE_URI}/ws`,
				onConnect: () => {
					console.log("Conectado al web socket");

					stompClient.subscribe(`/topic/notifications/${user.id}`, (message) => {
						const notification = JSON.parse(message.body);
						toast.success(notification.message);
						setNotifications((prev) => [notification, ...prev]);
						const audio = new Audio("/sound/notification.wav");
						audio.play().catch(console.error);
					});

					stompClient.subscribe("/topic/orders", (message) => {
						if(!matcher.orders) return;

						const order = JSON.parse(message.body);
						setOrders((prev) => ({...prev, content: [order, ...prev.content]}));
						setOrdersBackup((prev) => ({...prev, content: [order, ...prev.content]}));
					});
				},
			});

			stompClient.activate();
			setClient(stompClient);

			return () => {
				if (stompClient) stompClient.deactivate();
			};
    }, [setNotifications, setOrders, setOrdersBackup, matcher.orders, user.id]);

    return (
			<WebSocketContext.Provider
				value={{ client }}>
				{children}
			</WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
