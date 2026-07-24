import React from "react";

// ─── Message Renderer ─────────────────────────────────────────────────────────
export function RenderMarkdown({ text }: { text: string }) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let listBuffer: string[] = [];
  let listType: "ul" | "ol" | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === "ul" ? "ul" : "ol";
    elements.push(
      <Tag key={`list-${i}`} className={`my-2 pl-5 space-y-0.5 ${listType === "ul" ? "list-disc" : "list-decimal"} text-foreground/90`}>
        {listBuffer.map((item, idx) => (
          <li key={idx} className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  const inlineFormat = (line: string): string =>
    line
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, `<code class="bg-primary/10 text-primary px-1 py-0.5 rounded text-xs font-mono">$1</code>`);

  while (i < lines.length) {
    const line = lines[i]!;

    // Heading ##
    if (/^##\s/.test(line)) {
      flushList();
      elements.push(
        <h3 key={`h-${i}`} className="text-sm font-bold text-foreground mt-4 mb-1.5 first:mt-0">
          {line.replace(/^##\s/, "")}
        </h3>
      );
    }
    // Heading #
    else if (/^#\s/.test(line)) {
      flushList();
      elements.push(
        <h2 key={`h1-${i}`} className="text-base font-bold text-foreground mt-4 mb-2 first:mt-0">
          {line.replace(/^#\s/, "")}
        </h2>
      );
    }
    // Bullet list
    else if (/^[-*]\s/.test(line)) {
      if (listType !== "ul") { flushList(); listType = "ul"; }
      listBuffer.push(line.replace(/^[-*]\s/, ""));
    }
    // Ordered list
    else if (/^\d+\.\s/.test(line)) {
      if (listType !== "ol") { flushList(); listType = "ol"; }
      listBuffer.push(line.replace(/^\d+\.\s/, ""));
    }
    // Empty line
    else if (line.trim() === "") {
      flushList();
    }
    // Normal paragraph
    else {
      flushList();
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm leading-relaxed text-foreground/90 my-1"
          dangerouslySetInnerHTML={{ __html: inlineFormat(line) }}
        />
      );
    }
    i++;
  }
  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}
