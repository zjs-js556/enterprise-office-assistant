import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/navigation/AppNavigator";

// ============================================================
// Global JS error capture (catches errors outside React render)
// ============================================================
let globalError: { message: string; stack: string; isFatal: boolean } | null = null;
let onGlobalError: ((e: typeof globalError) => void) | null = null;

const g = globalThis as any;
if (g.ErrorUtils) {
  const defaultHandler = g.ErrorUtils.getGlobalHandler();
  g.ErrorUtils.setGlobalHandler((error: Error, isFatal: boolean) => {
    globalError = {
      message: error.message || String(error),
      stack: error.stack || "",
      isFatal,
    };
    if (onGlobalError) onGlobalError(globalError);
    if (defaultHandler && !isFatal) {
      defaultHandler(error, isFatal);
    }
  });
}

// ============================================================
// Error display screen (shown for both React and global errors)
// ============================================================
function ErrorScreen({
  message,
  stack,
  source,
}: {
  message: string;
  stack: string;
  source: string;
}) {
  return (
    <View style={styles.errorRoot}>
      <View style={styles.errorCard}>
        <Text style={styles.errorIcon}>!</Text>
        <Text style={styles.errorTitle}>应用错误</Text>
        <Text style={styles.errorSource}>来源: {source}</Text>
        <ScrollView style={styles.errorScroll} nestedScrollEnabled>
          <Text style={styles.errorMessage}>{message}</Text>
          {stack ? (
            <Text style={styles.errorStack} selectable>
              {stack}
            </Text>
          ) : null}
        </ScrollView>
        <Text style={styles.errorHint}>
          请截图此页面发送给开发人员
        </Text>
      </View>
    </View>
  );
}

// ============================================================
// React Error Boundary (catches render errors)
// ============================================================
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <ErrorScreen
          message={this.state.error.message || "未知渲染错误"}
          stack={this.state.error.stack || ""}
          source="React ErrorBoundary"
        />
      );
    }
    return this.props.children;
  }
}

// ============================================================
// Root App
// ============================================================
export default function App() {
  const [fatalError, setFatalError] = React.useState<{
    message: string;
    stack: string;
    isFatal: boolean;
  } | null>(globalError);

  React.useEffect(() => {
    onGlobalError = (e) => setFatalError(e ? { ...e } : null);
    return () => {
      onGlobalError = null;
    };
  }, []);

  if (fatalError) {
    return (
      <ErrorScreen
        message={fatalError.message}
        stack={fatalError.stack}
        source={`ErrorUtils (${fatalError.isFatal ? "fatal" : "non-fatal"})`}
      />
    );
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AuthProvider>
          <StatusBar style="light" translucent />
          <AppNavigator />
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

// ============================================================
// Styles
// ============================================================
const styles = StyleSheet.create({
  errorRoot: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F5F7FA",
  },
  errorCard: {
    width: "100%",
    maxHeight: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorIcon: {
    fontSize: 36,
    fontWeight: "700",
    color: "#DC2626",
    width: 64,
    height: 64,
    lineHeight: 64,
    textAlign: "center",
    borderRadius: 32,
    backgroundColor: "#FEF2F2",
    marginBottom: 16,
    overflow: "hidden",
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  errorSource: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  errorScroll: {
    width: "100%",
    maxHeight: 300,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
    marginBottom: 8,
  },
  errorStack: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "monospace",
    lineHeight: 16,
  },
  errorHint: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
});
