export type Guest = {
  first_name: string;
  last_name: string;
  email: string;
  dietary_requirements?: string;
};

export type Step = {
  title: string;
  buttons: {
    text: string;
    nextStep: number;
    retainCharacters: number;
  }[];
};

export type Steps = {
  [key: number]: Step;
};
