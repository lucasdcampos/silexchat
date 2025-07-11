import type { Chat } from "./models/chat";

export const getChatDisplayData = (chat: Chat, currentUserId: number) => {
  if (chat.type === 'GROUP') {
    return {
      name: chat.name || 'Group',
      avatarUrl: chat.avatarUrl,
    };
  } else {
    const otherParticipant = chat.participants.find(p => p.user.id !== currentUserId);
    return {
      name: otherParticipant?.user.username || 'Direct Message',
      avatarUrl: otherParticipant?.user.avatarUrl,
    };
  }
};