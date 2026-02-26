export type TestUserCredentials = {
  username: string;
  password: string;
};

export type AuthenticatedTestUser = TestUserCredentials & {
  userId: number;
  authToken: string;
};