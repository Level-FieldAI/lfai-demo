export enum ConversationStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  ERROR = 'error',
}

export type IReplicaInfo = {
  replica_id: string;
  replica_name: string;
  thumbnail_video_url: string;
  training_progress: string;
  status: string;
  created_at: string;
  updated_at: string;
  error_message: string | null;
  replica_type?: string;
};

export type IConversation = {
  conversation_id: string;
  conversation_name: string;
  status: ConversationStatus;
  conversation_url: string;
  replica_id: string | null;
  persona_id: string | null;
  created_at: string;
};
