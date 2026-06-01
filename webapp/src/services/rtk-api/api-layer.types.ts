export type ApiLayerCheckStatus = "success" | "warning" | "error";

export type ApiLayerCheckAC =
  | "401_RETRY_QUEUE"
  | "TYPE_SAFE_METHODS"
  | "BASE_QUERY_REAUTH"
  | "TOKEN_PERSISTENCE";

export type ApiLayerCheck = {
  id: string;
  title: string;
  description: string;
  status: ApiLayerCheckStatus;
  ac: ApiLayerCheckAC;
  evidence: string;
};

export type RunApiLayerCheckResult = {
  id: string;
  message: string;
  queuedRequestCount: number;
  refreshCallCount: number;
  retriedRequestCount: number;
};
