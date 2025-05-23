function createChatKey(userA: string, userB: string) {
  const [first, second] = [userA, userB].sort();
  return `${first}_${second}`;
}

export { createChatKey };
