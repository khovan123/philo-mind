import { Text, View, ScrollView, StyleSheet, Linking, Pressable } from "react-native";
import React, { useMemo } from "react";

interface MarkdownNode {
  type: "text" | "heading" | "paragraph" | "list" | "link" | "code" | "emphasis" | "strong";
  content?: string;
  children?: MarkdownNode[];
  level?: number;
  href?: string;
}

const Colors = {
  background: "#0C0C0E",
  surface: "#161618",
  text: "#E5E1E4",
  muted: "#A1A1AA",
  primary: "#D97706",
  primaryLight: "#FFB77D",
  border: "#353437",
};

const Fonts = {
  sans: "System",
  mono: "Menlo",
};

function parseMarkdown(markdown: string): MarkdownNode[] {
  const lines = markdown.split("\n");
  const nodes: MarkdownNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Headings
    if (line.startsWith("# ")) {
      nodes.push({ type: "heading", content: line.slice(2), level: 1 });
    } else if (line.startsWith("## ")) {
      nodes.push({ type: "heading", content: line.slice(3), level: 2 });
    } else if (line.startsWith("### ")) {
      nodes.push({ type: "heading", content: line.slice(4), level: 3 });
    } else if (line.startsWith("#### ")) {
      nodes.push({ type: "heading", content: line.slice(5), level: 4 });
    } else if (line.startsWith("- ")) {
      nodes.push({ type: "list", content: line.slice(2) });
    } else if (line.trim() === "") {
      // skip empty lines
    } else {
      // Paragraph
      nodes.push({ type: "paragraph", content: line });
    }

    i++;
  }

  return nodes;
}

function renderInlineMarkdown(text: string): MarkdownNode[] {
  const inlineNodes: MarkdownNode[] = [];
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const strongRegex = /\*\*([^*]+)\*\*/g;
  const emphasisRegex = /\*([^*]+)\*/g;
  const codeRegex = /`([^`]+)`/g;

  let lastIndex = 0;
  let match;

  const regex = /\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      inlineNodes.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }

    if (match[1] && match[2]) {
      inlineNodes.push({ type: "link", content: match[1], href: match[2] });
    } else if (match[3]) {
      inlineNodes.push({ type: "code", content: match[3] });
    } else if (match[4]) {
      inlineNodes.push({ type: "strong", content: match[4] });
    } else if (match[5]) {
      inlineNodes.push({ type: "emphasis", content: match[5] });
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    inlineNodes.push({ type: "text", content: text.slice(lastIndex) });
  }

  return inlineNodes.length > 0 ? inlineNodes : [{ type: "text", content: text }];
}

interface MarkdownRendererProps {
  markdown: string;
  onLinkPress?: (href: string) => void;
}

export function MarkdownRenderer({ markdown, onLinkPress }: MarkdownRendererProps) {
  const nodes = useMemo(() => parseMarkdown(markdown), [markdown]);

  function handleLinkPress(href: string) {
    if (onLinkPress) {
      onLinkPress(href);
    } else {
      // Default: open external links or navigate internal routes
      if (href.startsWith("http")) {
        Linking.openURL(href);
      } else if (href.startsWith("mailto:")) {
        Linking.openURL(href);
      }
    }
  }

  function renderInline(nodes: MarkdownNode[]) {
    return nodes.map((node, idx) => {
      if (node.type === "text") {
        return (
          <Text key={idx} style={styles.text}>
            {node.content}
          </Text>
        );
      } else if (node.type === "link") {
        return (
          <Pressable key={idx} onPress={() => handleLinkPress(node.href!)}>
            <Text style={styles.link}>{node.content}</Text>
          </Pressable>
        );
      } else if (node.type === "code") {
        return (
          <Text key={idx} style={styles.code}>
            {node.content}
          </Text>
        );
      } else if (node.type === "strong") {
        return (
          <Text key={idx} style={styles.strong}>
            {node.content}
          </Text>
        );
      } else if (node.type === "emphasis") {
        return (
          <Text key={idx} style={styles.emphasis}>
            {node.content}
          </Text>
        );
      }
    });
  }

  return (
    <View style={styles.container}>
      {nodes.map((node, idx) => {
        if (node.type === "heading") {
          const level = node.level || 1;
          const headingStyles = [
            styles.heading,
            level === 1 && styles.h1,
            level === 2 && styles.h2,
            level === 3 && styles.h3,
            level === 4 && styles.h4,
          ];
          return (
            <Text key={idx} style={headingStyles}>
              {node.content}
            </Text>
          );
        } else if (node.type === "paragraph") {
          const inlineNodes = renderInlineMarkdown(node.content!);
          return (
            <View key={idx} style={styles.paragraph}>
              {renderInline(inlineNodes)}
            </View>
          );
        } else if (node.type === "list") {
          return (
            <View key={idx} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listText}>{node.content}</Text>
            </View>
          );
        }
        return null;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  heading: {
    fontFamily: Fonts.sans,
    fontWeight: "800",
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
  },
  h3: {
    fontSize: 16,
    lineHeight: 24,
  },
  h4: {
    fontSize: 14,
    lineHeight: 20,
  },
  paragraph: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 8,
  },
  text: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  link: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primaryLight,
    textDecorationLine: "underline",
  },
  code: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    lineHeight: 18,
    color: Colors.primary,
    backgroundColor: Colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  strong: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    fontWeight: "700",
  },
  emphasis: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    fontStyle: "italic",
  },
  listItem: {
    flexDirection: "row",
    gap: 8,
    marginLeft: 8,
    marginBottom: 4,
  },
  bullet: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.primary,
    fontWeight: "800",
  },
  listText: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
    flex: 1,
  },
});
