import { jest } from "@jest/globals";

// ── Mock env ────────────────────────────────────────────────────
jest.unstable_mockModule("../config/env.js", () => ({
  env: {
    PORT: 3001,
    NODE_ENV: "test",
    DATABASE_URL: "postgresql://ci:ci@localhost:5432/ci",
    JWT_SECRET: "test-secret-at-least-32-characters-long",
    JWT_ACCESS_EXPIRES_IN: "15m",
    JWT_REFRESH_EXPIRES_IN: "7d",
    LOG_LEVEL: "error",
  },
}));

// ── Mock Prisma ─────────────────────────────────────────────────
const mockNodeFindMany = jest.fn() as any;
const mockNodeFindUnique = jest.fn() as any;
const mockNodeCreate = jest.fn() as any;
const mockNodeUpdate = jest.fn() as any;
const mockNodeDeleteMany = jest.fn() as any;

const mockEdgeFindMany = jest.fn() as any;
const mockEdgeFindUnique = jest.fn() as any;
const mockEdgeCreate = jest.fn() as any;
const mockEdgeUpdate = jest.fn() as any;
const mockEdgeDeleteMany = jest.fn() as any;

const mockTopicFindUnique = jest.fn() as any;

jest.unstable_mockModule("../config/prisma.js", () => ({
  prisma: {
    mindmapNode: {
      findMany: mockNodeFindMany,
      findUnique: mockNodeFindUnique,
      create: mockNodeCreate,
      update: mockNodeUpdate,
      deleteMany: mockNodeDeleteMany,
    },
    mindmapEdge: {
      findMany: mockEdgeFindMany,
      findUnique: mockEdgeFindUnique,
      create: mockEdgeCreate,
      update: mockEdgeUpdate,
      deleteMany: mockEdgeDeleteMany,
    },
    topic: {
      findUnique: mockTopicFindUnique,
    },
  },
}));

const {
  topicIdSchema,
  nodeIdSchema,
  edgeIdSchema,
  createMindmapNodeSchema,
  updateMindmapNodeSchema,
  createMindmapEdgeSchema,
  updateMindmapEdgeSchema,
} = await import("../validators/mindmap.validator.js");

const { MindmapService, MindmapError } = await import("../services/mindmap.service.js");

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000";
const TOPIC_ID = "880e8400-e29b-41d4-a716-446655440022";
const NODE_A = "aa0e8400-e29b-41d4-a716-446655440011";
const NODE_B = "bb0e8400-e29b-41d4-a716-446655440022";

// ── T-A13: Mindmap Validator Tests ──────────────────────────────

describe("T-A13: Mindmap Validators", () => {
  describe("topicIdSchema", () => {
    it("accepts valid UUID", () => {
      expect(topicIdSchema.safeParse({ params: { topicId: VALID_UUID } }).success).toBe(true);
    });

    it("rejects invalid UUID", () => {
      expect(topicIdSchema.safeParse({ params: { topicId: "bad" } }).success).toBe(false);
    });
  });

  describe("nodeIdSchema / edgeIdSchema", () => {
    it("accepts valid id", () => {
      expect(nodeIdSchema.safeParse({ params: { id: VALID_UUID } }).success).toBe(true);
      expect(edgeIdSchema.safeParse({ params: { id: VALID_UUID } }).success).toBe(true);
    });
  });

  describe("createMindmapNodeSchema", () => {
    it("accepts valid node input", () => {
      const result = createMindmapNodeSchema.safeParse({
        body: {
          topicId: VALID_UUID,
          title: "Stoicism",
          nodeType: "CONCEPT",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty title", () => {
      const result = createMindmapNodeSchema.safeParse({
        body: { topicId: VALID_UUID, title: "", nodeType: "CONCEPT" },
      });
      expect(result.success).toBe(false);
    });

    it("rejects title exceeding 200 chars", () => {
      const result = createMindmapNodeSchema.safeParse({
        body: { topicId: VALID_UUID, title: "x".repeat(201), nodeType: "CONCEPT" },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createMindmapEdgeSchema", () => {
    it("accepts valid edge input", () => {
      const result = createMindmapEdgeSchema.safeParse({
        body: {
          sourceNodeId: NODE_A,
          targetNodeId: NODE_B,
          relationType: "INFLUENCES",
        },
      });
      expect(result.success).toBe(true);
    });

    it("rejects same source and target", () => {
      const result = createMindmapEdgeSchema.safeParse({
        body: {
          sourceNodeId: NODE_A,
          targetNodeId: NODE_A,
          relationType: "SELF_LOOP",
        },
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateMindmapNodeSchema", () => {
    it("accepts partial update", () => {
      const result = updateMindmapNodeSchema.safeParse({
        params: { id: VALID_UUID },
        body: { title: "Updated Title" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty body", () => {
      const result = updateMindmapNodeSchema.safeParse({
        params: { id: VALID_UUID },
        body: {},
      });
      expect(result.success).toBe(false);
    });
  });

  describe("updateMindmapEdgeSchema", () => {
    it("accepts partial edge update", () => {
      const result = updateMindmapEdgeSchema.safeParse({
        params: { id: VALID_UUID },
        body: { relationType: "CONTRADICTS" },
      });
      expect(result.success).toBe(true);
    });

    it("rejects same source and target in update", () => {
      const result = updateMindmapEdgeSchema.safeParse({
        params: { id: VALID_UUID },
        body: { sourceNodeId: NODE_A, targetNodeId: NODE_A },
      });
      expect(result.success).toBe(false);
    });
  });
});

// ── T-A13: MindmapService Unit Tests ────────────────────────────

describe("T-A13: MindmapService", () => {
  let service: InstanceType<typeof MindmapService>;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new MindmapService();
  });

  describe("getGraphByTopic", () => {
    it("returns nodes and edges for a topic", async () => {
      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      const nodes = [
        { id: NODE_A, topicId: TOPIC_ID, title: "Ethics" },
        { id: NODE_B, topicId: TOPIC_ID, title: "Virtue" },
      ];
      const edges = [{ id: "e1", sourceNodeId: NODE_A, targetNodeId: NODE_B }];

      mockNodeFindMany.mockResolvedValue(nodes);
      mockEdgeFindMany.mockResolvedValue(edges);

      const result = await service.getGraphByTopic(TOPIC_ID);
      expect(result.topicId).toBe(TOPIC_ID);
      expect(result.nodes).toHaveLength(2);
      expect(result.edges).toHaveLength(1);
    });

    it("returns empty edges when no nodes exist", async () => {
      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      mockNodeFindMany.mockResolvedValue([]);

      const result = await service.getGraphByTopic(TOPIC_ID);
      expect(result.nodes).toHaveLength(0);
      expect(result.edges).toHaveLength(0);
      // Should NOT call findMany for edges when no nodes
      expect(mockEdgeFindMany).not.toHaveBeenCalled();
    });

    it("throws TOPIC_NOT_FOUND when topic doesn't exist", async () => {
      mockTopicFindUnique.mockResolvedValue(null);
      await expect(service.getGraphByTopic(TOPIC_ID)).rejects.toThrow(MindmapError);
    });
  });

  describe("createNode", () => {
    it("creates a node when topic exists", async () => {
      mockTopicFindUnique.mockResolvedValue({ id: TOPIC_ID });
      const created = { id: "n1", topicId: TOPIC_ID, title: "Logic" };
      mockNodeCreate.mockResolvedValue(created);

      const result = await service.createNode({
        topicId: TOPIC_ID,
        title: "Logic",
        nodeType: "CONCEPT",
      });
      expect(result).toEqual(created);
    });

    it("throws when topic doesn't exist", async () => {
      mockTopicFindUnique.mockResolvedValue(null);
      await expect(
        service.createNode({ topicId: TOPIC_ID, title: "Test", nodeType: "CONCEPT" }),
      ).rejects.toThrow(MindmapError);
    });
  });

  describe("deleteNode", () => {
    it("deletes when node exists", async () => {
      mockNodeDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.deleteNode(NODE_A)).resolves.toBeUndefined();
    });

    it("throws when node doesn't exist", async () => {
      mockNodeDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.deleteNode(NODE_A)).rejects.toThrow(MindmapError);
    });
  });

  describe("createEdge", () => {
    it("creates edge between valid nodes in same topic", async () => {
      mockNodeFindMany.mockResolvedValue([
        { id: NODE_A, topicId: TOPIC_ID },
        { id: NODE_B, topicId: TOPIC_ID },
      ]);
      const created = { id: "e1", sourceNodeId: NODE_A, targetNodeId: NODE_B };
      mockEdgeCreate.mockResolvedValue(created);

      const result = await service.createEdge({
        sourceNodeId: NODE_A,
        targetNodeId: NODE_B,
        relationType: "INFLUENCES",
      });
      expect(result).toEqual(created);
    });

    it("throws when nodes are in different topics", async () => {
      mockNodeFindMany.mockResolvedValue([
        { id: NODE_A, topicId: TOPIC_ID },
        { id: NODE_B, topicId: "different-topic" },
      ]);

      await expect(
        service.createEdge({
          sourceNodeId: NODE_A,
          targetNodeId: NODE_B,
          relationType: "INFLUENCES",
        }),
      ).rejects.toThrow(MindmapError);
    });

    it("throws when source or target node missing", async () => {
      mockNodeFindMany.mockResolvedValue([{ id: NODE_A, topicId: TOPIC_ID }]);

      await expect(
        service.createEdge({
          sourceNodeId: NODE_A,
          targetNodeId: NODE_B,
          relationType: "INFLUENCES",
        }),
      ).rejects.toThrow(MindmapError);
    });
  });

  describe("updateEdge", () => {
    it("throws EDGE_NOT_FOUND when edge doesn't exist", async () => {
      mockEdgeFindUnique.mockResolvedValue(null);
      await expect(service.updateEdge(VALID_UUID, { relationType: "CONTRADICTS" })).rejects.toThrow(
        MindmapError,
      );
    });

    it("throws when update would make source == target", async () => {
      mockEdgeFindUnique.mockResolvedValue({
        id: VALID_UUID,
        sourceNodeId: NODE_A,
        targetNodeId: NODE_B,
      });

      await expect(service.updateEdge(VALID_UUID, { targetNodeId: NODE_A })).rejects.toThrow(
        MindmapError,
      );
    });
  });

  describe("deleteEdge", () => {
    it("deletes when edge exists", async () => {
      mockEdgeDeleteMany.mockResolvedValue({ count: 1 });
      await expect(service.deleteEdge(VALID_UUID)).resolves.toBeUndefined();
    });

    it("throws when edge doesn't exist", async () => {
      mockEdgeDeleteMany.mockResolvedValue({ count: 0 });
      await expect(service.deleteEdge(VALID_UUID)).rejects.toThrow(MindmapError);
    });
  });
});
