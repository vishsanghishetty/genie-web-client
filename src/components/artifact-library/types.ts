/**
 * API Response from GET /v1/conversations
 */
export interface ConversationsListResponse {
  conversations: ConversationItem[];
}

/**
 * Individual conversation from API
 */
export interface ConversationItem {
  conversation_id: string;
  created_at: string;
  last_message_at: string;
  last_used_model: string;
  last_used_provider: string;
  message_count: number;
  topic_summary: string;
}

/**
 * UI representation of an artifact (derived from conversation)
 */
export interface Artifact {
  id: string;
  conversationId: string;
  title: string;
  description: string;
  type: 'dashboard' | 'code';
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  model: string;
  provider: string;
}

export type ViewMode = 'grid' | 'list';
