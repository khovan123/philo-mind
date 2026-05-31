import { prisma } from "../config/prisma.js";
import type {
  CreateMindmapEdgeInput,
  CreateMindmapNodeInput,
  UpdateMindmapEdgeInput,
  UpdateMindmapNodeInput,
} from "../validators/mindmap.validator.js";

// ── T-A13: Mindmap Service ───────────────────────────────────

export class MindmapService {
  async getGraphByTopic(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new MindmapError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
    }

    const nodes = await prisma.mindmapNode.findMany({
      where: { topicId },
      orderBy: { title: "asc" },
    });

    const nodeIds = nodes.map((node) => node.id);
    const edges =
      nodeIds.length === 0
        ? []
        : await prisma.mindmapEdge.findMany({
            where: {
              sourceNodeId: { in: nodeIds },
              targetNodeId: { in: nodeIds },
            },
            orderBy: { relationType: "asc" },
          });

    return { topicId, nodes, edges };
  }

  async createNode(input: CreateMindmapNodeInput) {
    await this.ensureTopicExists(input.topicId);

    return prisma.mindmapNode.create({
      data: input,
    });
  }

  async updateNode(nodeId: string, input: UpdateMindmapNodeInput) {
    await this.ensureNodeExists(nodeId);

    return prisma.mindmapNode.update({
      where: { id: nodeId },
      data: input,
    });
  }

  async deleteNode(nodeId: string) {
    const result = await prisma.mindmapNode.deleteMany({
      where: { id: nodeId },
    });

    if (result.count === 0) {
      throw new MindmapError("NODE_NOT_FOUND", "Không tìm thấy node", 404);
    }
  }

  async createEdge(input: CreateMindmapEdgeInput) {
    await this.ensureEdgeNodesAreValid(input.sourceNodeId, input.targetNodeId);

    return prisma.mindmapEdge.create({
      data: input,
    });
  }

  async updateEdge(edgeId: string, input: UpdateMindmapEdgeInput) {
    const existing = await prisma.mindmapEdge.findUnique({
      where: { id: edgeId },
    });

    if (!existing) {
      throw new MindmapError("EDGE_NOT_FOUND", "Không tìm thấy edge", 404);
    }

    const sourceNodeId = input.sourceNodeId ?? existing.sourceNodeId;
    const targetNodeId = input.targetNodeId ?? existing.targetNodeId;

    if (sourceNodeId === targetNodeId) {
      throw new MindmapError("INVALID_EDGE", "Source node và target node phải khác nhau", 400);
    }

    await this.ensureEdgeNodesAreValid(sourceNodeId, targetNodeId);

    return prisma.mindmapEdge.update({
      where: { id: edgeId },
      data: input,
    });
  }

  async deleteEdge(edgeId: string) {
    const result = await prisma.mindmapEdge.deleteMany({
      where: { id: edgeId },
    });

    if (result.count === 0) {
      throw new MindmapError("EDGE_NOT_FOUND", "Không tìm thấy edge", 404);
    }
  }

  private async ensureTopicExists(topicId: string) {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: { id: true },
    });

    if (!topic) {
      throw new MindmapError("TOPIC_NOT_FOUND", "Không tìm thấy topic", 404);
    }
  }

  private async ensureNodeExists(nodeId: string) {
    const node = await prisma.mindmapNode.findUnique({
      where: { id: nodeId },
      select: { id: true },
    });

    if (!node) {
      throw new MindmapError("NODE_NOT_FOUND", "Không tìm thấy node", 404);
    }
  }

  private async ensureEdgeNodesAreValid(sourceNodeId: string, targetNodeId: string) {
    const nodes = await prisma.mindmapNode.findMany({
      where: { id: { in: [sourceNodeId, targetNodeId] } },
      select: { id: true, topicId: true },
    });

    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    const targetNode = nodes.find((node) => node.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      throw new MindmapError("NODE_NOT_FOUND", "Không tìm thấy source hoặc target node", 404);
    }

    if (sourceNode.topicId !== targetNode.topicId) {
      throw new MindmapError(
        "INVALID_EDGE",
        "Source node và target node phải thuộc cùng topic",
        400,
      );
    }
  }
}

export class MindmapError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number,
  ) {
    super(message);
    this.name = "MindmapError";
  }
}

export const mindmapService = new MindmapService();
