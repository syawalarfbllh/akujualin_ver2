import "../css/app.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications"; // 1. Import ini

const appName = import.meta.env.VITE_APP_NAME || "Akujualin";

const theme = createTheme({
    primaryColor: "indigo",
    defaultRadius: "md",
    fontFamily: "Inter, sans-serif",
    cursorType: "pointer",
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx"),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <MantineProvider theme={theme}>
                <Notifications position="top-right" zIndex={1000} />{" "}
                {/* 2. Tambahkan ini */}
                <App {...props} />
            </MantineProvider>,
        );
    },
    progress: { color: "#4338ca" },
});
