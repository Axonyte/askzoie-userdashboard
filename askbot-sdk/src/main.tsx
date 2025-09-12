import ReactDOM from "react-dom/client";
import App from "./App";
import rawStyles from "@/scss/shadow-styles.scss?inline"; // Import compiled SCSS as a string
import { minify } from "csso"; // CSS minifier for optimized bundle size

// Type definition for initialization options
type Options = {
    elementId?: string; // Optional target element ID for mounting
    token?: string; // Required token for authentication/initialization
    botType: "SIMPLE_BOT";
};

// Default option values
const defaultOptions: Options = {
    token: undefined,
    botType: "SIMPLE_BOT",
};

export class AskBot {
    /**
     * Initializes and mounts the AskBot widget into the provided element
     * or creates a new container if none is specified.
     */
    createBot = (opt: Options = defaultOptions) => {
        const { elementId, token, botType } = opt;

        // Abort if token is missing
        if (!token) return;

        let rootEl: HTMLElement | null;

        // Locate target element if an ID is provided
        if (elementId) {
            rootEl = document.getElementById(elementId);
            if (!rootEl) {
                throw new Error(`Element with id "${elementId}" not found.`);
            }
        } else {
            // Create a new container element in the document body
            rootEl = document.createElement("div");
            rootEl.classList.add("ASK_BOT_WRAPPER");
            document.body.appendChild(rootEl);
        }

        // Create a Shadow DOM root to isolate styles from the host page
        const shadowRoot = rootEl.attachShadow({ mode: "open" });

        // Minify the imported SCSS before injecting into the Shadow DOM
        const minifiedCSS = minify(rawStyles).css;

        // Inject the minified CSS into the Shadow DOM
        const styleTag = document.createElement("style");
        styleTag.textContent = minifiedCSS;
        shadowRoot.appendChild(styleTag);

        // Create a mount point inside the Shadow DOM for React rendering
        const mountPoint = document.createElement("div");
        mountPoint.classList.add("ASK_BOT_SHADOW_WRAPPER");
        shadowRoot.appendChild(mountPoint);

        // Mount the React application into the Shadow DOM
        const root = ReactDOM.createRoot(mountPoint);
        root.render(<App token={token} />);
    };
}

// Expose the AskBot class globally for external usage
(window as any).AskBot = AskBot;
