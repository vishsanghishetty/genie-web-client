import type { ConversationItem, Artifact } from './types';

export const MOCK_CONVERSATIONS: ConversationItem[] = [
  {
    conversation_id: '123e4567-e89b-12d3-a456-426614174000',
    created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 12,
    topic_summary: 'OpenShift Cluster Health & Utilization Monitor',
  },
  {
    conversation_id: '456e7890-a12b-34c5-d678-901234567890',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 8,
    topic_summary: 'Container Image Vulnerability Scanner Summary',
  },
  {
    conversation_id: '789a0123-b45c-67d8-e901-234567890abc',
    created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o',
    last_used_provider: 'openai',
    message_count: 15,
    topic_summary: 'ArgoCD Sync Status and Deployment Metrics',
  },
  {
    conversation_id: 'abc1234d-e56f-7890-a123-4567890abcde',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 6,
    topic_summary: 'S2I Node.js BuildConfig Template (YAML)',
  },
  {
    conversation_id: 'def5678e-f901-2345-6789-0abcdef12345',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o',
    last_used_provider: 'openai',
    message_count: 10,
    topic_summary: 'Project Resource Consumption and Chargeback Report',
  },
  {
    conversation_id: 'ghi9012f-0123-4567-8901-23456789ghij',
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 4,
    topic_summary: 'Python Script for Kubeconfig Rotation',
  },
  {
    conversation_id: 'jkl3456g-7890-abcd-ef01-234567jklmno',
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o',
    last_used_provider: 'openai',
    message_count: 18,
    topic_summary: 'Installed Operator Status and Update Readiness',
  },
  {
    conversation_id: 'mno7890h-bcde-f012-3456-789mnopqrstu',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 9,
    topic_summary: 'Critical Customer Service SLO Dashboard',
  },
  {
    conversation_id: 'pqr0123i-4567-89ab-cdef-012pqrstuvwx',
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 5,
    topic_summary: 'Custom Prometheus Alerting Rule: High Error Rate',
  },
  {
    conversation_id: 'stu4567j-890a-bcde-f012-345stuvwxyz1',
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o',
    last_used_provider: 'openai',
    message_count: 11,
    topic_summary: 'Ingress Traffic and Route Latency Metrics',
  },
  {
    conversation_id: 'vwx7890k-cdef-0123-4567-89vwxyzabc23',
    created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o-mini',
    last_used_provider: 'openai',
    message_count: 7,
    topic_summary: 'OpenShift Data Foundation (ODF) Storage I/O',
  },
  {
    conversation_id: 'yza0123l-f012-3456-789a-bcyzabcdef45',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_message_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_used_model: 'gpt-4o',
    last_used_provider: 'openai',
    message_count: 13,
    topic_summary: 'AI Model Deployment Custom Resource Definition (CRD)',
  },
];

/**
 * Transform API conversation to UI Artifact
 */
export function conversationToArtifact(conversation: ConversationItem): Artifact {
  // Determine type based on topic keywords
  const topic = conversation.topic_summary.toLowerCase();
  const isCode =
    topic.includes('yaml') ||
    topic.includes('script') ||
    topic.includes('template') ||
    topic.includes('config') ||
    topic.includes('crd') ||
    topic.includes('definition');

  return {
    id: conversation.conversation_id,
    conversationId: conversation.conversation_id,
    title: conversation.topic_summary,
    description: '', // Backend doesn't provide description yet
    type: isCode ? 'code' : 'dashboard',
    createdAt: conversation.created_at,
    updatedAt: conversation.last_message_at,
    messageCount: conversation.message_count,
    model: conversation.last_used_model,
    provider: conversation.last_used_provider,
  };
}
