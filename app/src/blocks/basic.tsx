import { Pressable, Text, View } from "react-native";
import type { Action, Block } from "../types";
import { useTheme } from "../theme";

type Of<T extends Block["type"]> = Extract<Block, { type: T }>;
type Nav = (action: Action) => void;

export function Eyebrow({ children, color }: { children: string; color?: string }) {
  const t = useTheme();
  return (
    <Text style={{ fontSize: 12, letterSpacing: 1, textTransform: "uppercase", fontWeight: "600", color: color ?? t.muted }}>
      {children}
    </Text>
  );
}

export function Header({ block }: { block: Of<"header"> }) {
  const t = useTheme();
  return (
    <View style={{ gap: 4 }}>
      {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
      <Text style={{ fontSize: 28, lineHeight: 33, fontWeight: "800", color: t.ink }}>{block.title}</Text>
      {block.subtitle ? <Text style={{ fontSize: 15, lineHeight: 22, color: t.muted }}>{block.subtitle}</Text> : null}
    </View>
  );
}

export function Paragraph({ block }: { block: Of<"text"> }) {
  const t = useTheme();
  return <Text style={{ fontSize: 16, lineHeight: 24, color: t.ink }}>{block.text}</Text>;
}

export function Rule({ block }: { block: Of<"rule"> }) {
  const t = useTheme();
  return (
    <View style={{ gap: 4 }}>
      <Eyebrow color={t.accent}>Rule</Eyebrow>
      <Text style={{ fontSize: 14, lineHeight: 21, color: t.muted }}>{block.text}</Text>
    </View>
  );
}

export function Card({ block, onAction }: { block: Of<"card">; onAction: Nav }) {
  const t = useTheme();
  const action = block.action;
  return (
    <Pressable
      accessibilityRole={action ? "button" : undefined}
      disabled={!action}
      onPress={() => action && onAction(action)}
      style={({ pressed }) => ({
        backgroundColor: t.card, borderColor: pressed ? t.ink : t.rule, borderWidth: 1.5, borderRadius: 14, padding: 16, gap: 4,
      })}
    >
      {block.eyebrow ? <Eyebrow>{block.eyebrow}</Eyebrow> : null}
      <Text style={{ fontSize: 18, lineHeight: 24, fontWeight: "700", color: t.ink }}>{block.title}</Text>
      {block.body ? <Text style={{ fontSize: 14, color: t.muted }}>{block.body}</Text> : null}
    </Pressable>
  );
}

export function PrimaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: t.ink, borderRadius: 14, minHeight: 54, alignItems: "center", justifyContent: "center",
        paddingHorizontal: 16, opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: t.paper, fontSize: 17, fontWeight: "600" }}>{label}</Text>
    </Pressable>
  );
}

export function ButtonBlock({ block, onAction }: { block: Of<"button">; onAction: Nav }) {
  return <PrimaryButton label={block.label} onPress={() => onAction(block.action)} />;
}
