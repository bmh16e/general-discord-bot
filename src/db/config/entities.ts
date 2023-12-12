export interface Server {
  server_id: string;
  name: string;
}

export interface Channel {
  channel_id: string;
  name: string;
  server_id: string;
}

export interface Prompt {
  prompt_id: number;
  prompt_content: string;
  use_user_context: boolean;
  channel_id: string;
}
