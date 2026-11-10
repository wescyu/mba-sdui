import { View } from "react-native";
import type { Action, Block } from "./types";
import { ButtonBlock, Card, Header, Paragraph, Rule } from "./blocks/basic";
import { Quiz } from "./blocks/Quiz";

// The heart of SDUI: look at each block's type and draw the matching component.
// A type this app version doesn't know is skipped, so the server can add new
// blocks without breaking older apps.
export function Renderer({ blocks, onAction }: { blocks: Block[]; onAction: (a: Action) => void }) {
  return (
    <View style={{ gap: 20 }}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "header": return <Header key={i} block={block} />;
          case "text": return <Paragraph key={i} block={block} />;
          case "rule": return <Rule key={i} block={block} />;
          case "card": return <Card key={i} block={block} onAction={onAction} />;
          case "button": return <ButtonBlock key={i} block={block} onAction={onAction} />;
          case "quiz": return <Quiz key={i} block={block} onAction={onAction} />;
          default: return null;
        }
      })}
    </View>
  );
}
