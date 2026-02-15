import "../css/app.css";
import "@mantine/core/styles.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { MantineProvider, createTheme } from "@mantine/core";

const appName = import.meta.env.VITE_APP_NAME || "Akujualin";

// --- CONFIG THEME MODERN ---
const theme = createTheme({
    primaryColor: "indigo", // Warna Corporate: Indigo (Modern & Trustworthy)
    defaultRadius: "md", // Sudut membulat (modern feel)
    fontFamily: "Inter, sans-serif", // Pastikan font enak dibaca
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
                <App {...props} />
            </MantineProvider>,
        );
    },
    progress: { color: "#4338ca" }, // Warna loading bar
});
