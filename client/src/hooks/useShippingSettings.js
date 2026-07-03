import { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = `${import.meta.env.VITE_ENV === "production" ? import.meta.env.VITE_BACKEND_URL_PROD : import.meta.env.VITE_BACKEND_URL}/api/settings`;

export function useShippingSettings() {
    const [settings, setSettings] = useState({
        freeShippingThreshold: 999,
        shippingCharge: `${100}`,
        processingDays: "3-5"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get(BASE_URL);
                if (data.success && data.data) {
                    setSettings({
                        freeShippingThreshold: data.data.freeShippingThreshold ?? 999,
                        shippingCharge: data.data.shippingCharge ?? "100",
                        processingDays: data.data.processingDays || "3-5"
                    });
                }
            } catch (error) {
                console.error("Failed to fetch shipping settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
}
