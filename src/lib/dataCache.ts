type CACHE_TAG = "users" | "servers" | "channels";

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

export { getGlobalTag, getIdTag, getUserTag, getServerTag };
