export type StatusRouteGetResponse = {
  updated_at: string;
  dependencies: {
    database: {
      opened_connections: number;
      max_connections: number;
      version: string;
    };
  };
};
