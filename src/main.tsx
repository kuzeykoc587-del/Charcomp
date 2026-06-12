import { createRoot } from "react-dom/client";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

async function boot() {
  try {
    const [{ default: App }, { ErrorBoundary }] = await Promise.all([
      import("./App"),
      import("./components/ErrorBoundary"),
    ]);

    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const isFirebaseError =
      error.message.toLowerCase().includes("firebase") ||
      error.message.toLowerCase().includes("vite_firebase");

    root.render(
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f0f0f",
          color: "#f5f5f5",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>
            App failed to start
          </h1>

          {isFirebaseError ? (
            <>
              <p style={{ color: "#a3a3a3", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                The app could not connect to Firebase because the environment
                variables are not set in your Vercel project settings.
              </p>
              <div
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  padding: "1rem",
                  textAlign: "left",
                  fontSize: "0.85rem",
                  color: "#a3a3a3",
                  lineHeight: 1.8,
                }}
              >
                <strong style={{ color: "#f5f5f5" }}>
                  Vercel → Your Project → Settings → Environment Variables
                </strong>
                <br />
                <br />
                Add these 6 variables (get values from Firebase Console → Project Settings → Your apps):
                <br />
                <br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_API_KEY</code><br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_AUTH_DOMAIN</code><br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_PROJECT_ID</code><br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_STORAGE_BUCKET</code><br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_MESSAGING_SENDER_ID</code><br />
                <code style={{ color: "#f97316" }}>VITE_FIREBASE_APP_ID</code>
              </div>
              <p style={{ color: "#6b7280", marginTop: "1rem", fontSize: "0.8rem" }}>
                After adding them, trigger a new deployment on Vercel.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: "#a3a3a3", marginBottom: "1rem", lineHeight: 1.6 }}>
                An unexpected error occurred at startup. Open the browser console for details.
              </p>
              <pre
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: 8,
                  padding: "1rem",
                  fontSize: "0.75rem",
                  color: "#ef4444",
                  textAlign: "left",
                  overflowX: "auto",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {error.message}
              </pre>
            </>
          )}
        </div>
      </div>
    );
  }
}

boot();
