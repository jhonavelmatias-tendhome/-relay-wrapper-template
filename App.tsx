import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { WebView, type WebViewNavigation } from "react-native-webview";
import { useEffect } from "react";

const WEB_URL: string =
  (Constants.expoConfig?.extra as { relayWebUrl?: string } | undefined)
    ?.relayWebUrl ?? "https://example.com";

export default function App() {
  const webviewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const canGoBackRef = useRef(false);

  useEffect(() => {
    if (Platform.OS !== "android") return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      if (canGoBackRef.current) {
        webviewRef.current?.goBack();
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  const onNav = (e: WebViewNavigation) => {
    canGoBackRef.current = e.canGoBack;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
        <StatusBar style="auto" />
        <WebView
          ref={webviewRef}
          source={{ uri: WEB_URL }}
          style={styles.webview}
          onNavigationStateChange={onNav}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          allowsBackForwardNavigationGestures
          pullToRefreshEnabled
          startInLoadingState
          javaScriptEnabled
          domStorageEnabled
          originWhitelist={["https://*", "http://*"]}
        />
        {loading && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <ActivityIndicator size="large" />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#ffffff" },
  webview: { flex: 1 },
  loadingOverlay: {
    position: "absolute",
    inset: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
