export type RegisterableCommand = {
  name: string;
  callback: () => void;
};
