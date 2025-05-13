import { z } from "zod";

class InvalidTokenError extends Error {
  constructor(zodError: z.ZodError) {
    super("Invalid Token");
    this.cause = zodError;
  }
}

class InvalidUserError extends Error {
  constructor(zodError: z.ZodError) {
    super("Invalid User");
    this.cause = zodError;
  }
}

class InvalidStateError extends Error {
  constructor() {
    super("Invalid State");
  }
}

class InvalidCodeVerifierError extends Error {
  constructor() {
    super("Invalid Code Verifier");
  }
}

export {
  InvalidTokenError,
  InvalidUserError,
  InvalidStateError,
  InvalidCodeVerifierError,
};
