export type DecisionHubProps = {
  tripId: string;
  count: number;
  categories: {
    activity: number;
    logistics: number;
    inventory: number;
  };
};
