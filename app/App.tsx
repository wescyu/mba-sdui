import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { fetchScreen } from "./src/api";
import { PrimaryButton } from "./src/blocks/basic";
import { Renderer } from "./src/Renderer";
import { useTheme } from "./src/theme";
import { SUPPORTED_SCHEMA, type Action, type Screen } from "./src/types";

type State = { status: "loading" } | { status: "error"; message: string } | { status: "ready"; screen: Screen };

export default function App() {
  const t = useTheme();
  const [stack, setStack] = useState<string[]>(["home"]);
  const [state, setState] = useState<State>({ status: "loading" });
  const [loadedAt, setLoadedAt] = useState("");
  const id = stack[stack.length - 1];

  const load = useCallback(async (screenId: string) => {
    setState({ status: "loading" });
    try {
      const screen = await fetchScreen(screenId);
      if (screen.schemaVersion > SUPPORTED_SCHEMA) {
        setState({ status: "error", message: "This lesson needs a newer version of the app." });
        return;
      }
      setState({ status: "ready", screen });
      setLoadedAt(new Date().toLocaleTimeString());
    } catch (e) {
      setState({ status: "error", message: e instanceof Error ? e.message : "Could not reach the server." });
    }
  }, []);

  useEffect(() => {
    load(id);
  }, [id, load]);

  const onAction = (action: Action) => {
    if (action.type !== "navigate") return;
    setStack(action.to === "home" ? ["home"] : [...stack, action.to]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.paper }}>
      <ScrollView
        contentContainerStyle={{
          width: "100%", maxWidth: 520, alignSelf: "center", gap: 20,
          paddingHorizontal: 16, paddingBottom: 40, paddingTop: Platform.OS === "web" ? 24 : 64,
        }}
      >
        {stack.length > 1 ? (
          <Pressable accessibilityRole="button" onPress={() => setStack(stack.slice(0, -1))} hitSlop={12}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: t.accent }}>‹ Back</Text>
          </Pressable>
        ) : null}

        {state.status === "loading" ? <ActivityIndicator color={t.accent} style={{ marginTop: 80 }} /> : null}

        {state.status === "error" ? (
          <View style={{ gap: 12, marginTop: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: t.ink }}>Couldn't load this screen</Text>
            <Text style={{ fontSize: 15, lineHeight: 22, color: t.muted }}>{state.message}</Text>
            <PrimaryButton label="Try again" onPress={() => load(id)} />
          </View>
        ) : null}

        {state.status === "ready" ? (
          <>
            {/* key resets block state (like quiz progress) when the screen changes */}
            <Renderer key={state.screen.id + loadedAt} blocks={state.screen.blocks} onAction={onAction} />
            <Pressable accessibilityRole="button" onPress={() => load(id)} hitSlop={8} style={{ marginTop: 12 }}>
              <Text style={{ fontSize: 12, color: t.muted, textAlign: "center" }}>
                Screen "{state.screen.id}" from server at {loadedAt} · Tap to reload
              </Text>
            </Pressable>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
