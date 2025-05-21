type CACHE_TAG =
  | "users"
  | "servers"
  | "serverMembers"
  | "channels"
  | "channelMessages"
  | "friendRequests";

function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const;
}

function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const;
}

function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const;
}

function getServerTag(tag: CACHE_TAG, serverId: string) {
  return `server:${serverId}-${tag}` as const;
}

function getChannelTag(tag: CACHE_TAG, channelId: string) {
  return `channel:${channelId}-${tag}` as const;
}

export { getGlobalTag, getIdTag, getUserTag, getServerTag, getChannelTag };
