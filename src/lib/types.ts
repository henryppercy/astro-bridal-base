export type Guest = {
  first_name: string;
  last_name: string;
  email: string;
  dietary_requirements?: string;
};

export type Step = {
  step: number;
  title: string;
  param: string;
  buttons: {
    text: string;
    nextStep: number;
  }[];
};

export type Steps = {
  [key: number]: Step;
};
