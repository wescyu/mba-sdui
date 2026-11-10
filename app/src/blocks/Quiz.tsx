import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import type { Action, Block } from "../types";
import { useTheme } from "../theme";
import { PrimaryButton } from "./basic";

type QuizBlock = Extract<Block, { type: "quiz" }>;

export function Quiz({ block, onAction }: { block: QuizBlock; onAction: (a: Action) => void }) {
  const t = useTheme();
  const total = block.questions.length;
  // queue holds question indexes still to clear; a missed question goes to the back.
  const [queue, setQueue] = useState<number[]>(() => block.questions.map((_, i) => i));
  const [pick, setPick] = useState<number | null>(null);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gain, setGain] = useState(0);
  const [missed, setMissed] = useState<number[]>([]);

  if (total === 0) return null;

  if (queue.length === 0) {
    const firstTry = total - missed.length;
    return (
      <View style={{ gap: 16 }}>
        <Text style={{ fontSize: 34, lineHeight: 38, fontWeight: "800", color: t.ink }}>Level cleared</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {[[`${firstTry}/${total}`, "first try"], [`${xp}`, "XP"]].map(([n, l]) => (
            <View key={l} style={{ flex: 1, backgroundColor: t.card, borderColor: t.rule, borderWidth: 1, borderRadius: 14, padding: 12 }}>
              <Text style={{ fontSize: 22, fontWeight: "700", color: t.ink, fontVariant: ["tabular-nums"] }}>{n}</Text>
              <Text style={{ fontSize: 12, color: t.muted }}>{l}</Text>
            </View>
          ))}
        </View>
        {block.next ? <PrimaryButton label={block.next.label} onPress={() => onAction(block.next!.action)} /> : null}
      </View>
    );
  }

  const index = queue[0];
  const q = block.questions[index];
  const answered = pick !== null;
  const correct = pick === q.answer;
  const cleared = total - new Set(queue).size + (answered && correct && queue.indexOf(index) === queue.lastIndexOf(index) ? 1 : 0);

  function choose(i: number) {
    if (answered) return;
    setPick(i);
    if (i === q.answer) {
      const nextStreak = streak + 1;
      const earned = 10 + Math.min(nextStreak - 1, 5) * 2;
      setStreak(nextStreak);
      setGain(earned);
      setXp(xp + earned);
    } else {
      setStreak(0);
      if (!missed.includes(index)) setMissed([...missed, index]);
      setQueue([...queue, index]);
    }
  }

  function next() {
    setQueue(queue.slice(1));
    setPick(null);
  }

  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <View style={{ flex: 1, flexDirection: "row", gap: 4 }}>
          {block.questions.map((_, i) => (
            <View key={i} style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: i < cleared ? t.accent : t.rule }} />
          ))}
        </View>
        {streak >= 2 ? <Text style={{ fontSize: 13, fontWeight: "700", color: t.accent }}>×{streak}</Text> : null}
        <Text style={{ fontSize: 13, fontWeight: "700", color: t.ink, fontVariant: ["tabular-nums"] }}>{xp} XP</Text>
      </View>

      <Text style={{ fontSize: 24, lineHeight: 30, fontWeight: "800", color: t.ink }}>{q.prompt}</Text>

      <View style={{ gap: 10 }}>
        {q.options.map((o, i) => {
          const isAnswer = answered && i === q.answer;
          const isWrongPick = answered && i === pick && !correct;
          return (
            <Pressable
              key={i}
              accessibilityRole="button"
              disabled={answered}
              onPress={() => choose(i)}
              style={({ pressed }) => ({
                minHeight: 60, justifyContent: "center", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1.5,
                backgroundColor: isAnswer ? t.accentSoft : isWrongPick ? t.redSoft : t.card,
                borderColor: isAnswer ? t.accent : isWrongPick ? t.red : pressed ? t.ink : t.rule,
                opacity: answered && !isAnswer && !isWrongPick ? 0.45 : 1,
              })}
            >
              <Text style={{ fontSize: 17, fontWeight: "600", color: t.ink }}>{o.label}</Text>
              {o.hint ? <Text style={{ fontSize: 13, color: t.muted }}>{o.hint}</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {answered ? (
        <View style={{ backgroundColor: correct ? t.accentSoft : t.redSoft, borderRadius: 16, padding: 16, gap: 10 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" }}>
            <Text style={{ fontSize: 20, fontWeight: "800", color: correct ? t.accent : t.red }}>{correct ? "In the black" : "Red ink"}</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: correct ? t.accent : t.red }}>{correct ? `+${gain} XP` : "it'll come back"}</Text>
          </View>
          <Text style={{ fontSize: 16, lineHeight: 24, color: t.ink }}>{q.why}</Text>
          <PrimaryButton label={queue.length === 1 && correct ? "Finish level" : "Next"} onPress={next} />
        </View>
      ) : null}
    </View>
  );
}
