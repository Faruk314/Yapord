function canUpdateUser(loggedUserId: string, userId: string) {
  return loggedUserId === userId;
}

export { canUpdateUser };
