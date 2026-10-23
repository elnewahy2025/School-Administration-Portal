export type CircularPriority = "low" | "normal" | "high" | "urgent";

export type CircularStatus =
  "draft" | "published" | "in_progress" | "completed" | "overdue" | "archived" | "cancelled";

export type CircularResponseType = "acknowledgement" | "approval" | "task";

export type CircularResponseStatus =
  "pending" | "acknowledged" | "approved" | "rejected" | "completed" | "not_applicable";

export type CircularRow = {
  id: string;
  school_id: string;
  ref_number: string;
  title: string;
  body: string;
  category: string;
  priority: CircularPriority;
  status: CircularStatus;
  response_type: CircularResponseType;
  response_instructions: string | null;
  allow_response_revision: boolean;
  publish_at: string | null;
  due_at: string | null;
  created_by: string;
  closed_at: string | null;
  created_at: string;
};

export type CircularTargetRow = {
  id: string;
  circular_id: string;
  department_id: string | null;
  department_name?: string | null;
  role_key: string | null;
};

export type CircularResponseRow = {
  id: string;
  circular_id: string;
  school_id: string;
  department_id: string;
  department_name?: string | null;
  responder_id: string;
  responder_name?: string | null;
  response_type: CircularResponseType;
  status: CircularResponseStatus;
  reason: string | null;
  is_latest: boolean;
  submitted_at: string;
};
