import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[CharComp] App crashed:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const isFirebaseError =
        this.state.error?.message?.toLowerCase().includes("firebase") ||
        this.state.error?.message?.toLowerCase().includes("api-key") ||
        this.state.error?.message?.toLowerCase().includes("api key");

      return (
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
              Something went wrong
            </h1>

            {isFirebaseError ? (
              <>
                <p style={{ color: "#a3a3a3", marginBottom: "1.5rem", lineHeight: 1.6 }}>
                  The app could not connect to Firebase. This usually means the
                  environment variables are missing from your Vercel project settings.
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
                  <strong style={{ color: "#f5f5f5" }}>Add these to Vercel → Settings → Environment Variables:</strong>
                  <br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_API_KEY</code><br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_AUTH_DOMAIN</code><br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_PROJECT_ID</code><br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_STORAGE_BUCKET</code><br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_MESSAGING_SENDER_ID</code><br />
                  <code style={{ color: "#f97316" }}>VITE_FIREBASE_APP_ID</code>
                </div>
                <p style={{ color: "#6b7280", marginTop: "1rem", fontSize: "0.8rem" }}>
                  After adding them, redeploy your project on Vercel.
                </p>
              </>
            ) : (
              <>
                <p style={{ color: "#a3a3a3", marginBottom: "1rem", lineHeight: 1.6 }}>
                  An unexpected error occurred. Check the browser console for details.
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
                  {this.state.error?.message}
                </pre>
              </>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
