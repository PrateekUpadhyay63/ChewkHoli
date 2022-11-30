export interface INormalNotification {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  sender_data: senderData;
  group_data?: IChatNotification;
}

export interface senderData {
  name: string;
  profile_image: string;
  first_name: string;
  last_name: string;
}

export interface IChatNotification {
  group_id: string | number;
  room_jid: string;
  group_name: string;
  name?: string;
  active?: boolean;
}
