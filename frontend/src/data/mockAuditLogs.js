export const mockAuditLogs = [
  {
    id: "LOG-2024-0982",
    user: "Dr. Arvind Subramanian (admin@example.com)",
    role: "MINISTRY_ADMIN",
    action: "RISK_ENGINE_RECALCULATE",
    entity: "Project Risk Engine",
    entityId: "MPLADS-DEMO-001",
    details: "Triggered multi-factor risk recalculation; updated score to 84 (CRITICAL)",
    ipAddress: "14.139.128.5",
    timestamp: "2024-03-03T08:24:10Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0981",
    user: "Shri Rajeshwar Rao, IAS (dc.pune@example.com)",
    role: "DISTRICT_AUTHORITY",
    action: "ALERT_STATUS_UPDATE",
    entity: "Alert",
    entityId: "ALT-2024-003",
    details: "Marked alert ALT-2024-003 as REVIEWING; assigned to PWD Chief Auditor",
    ipAddress: "103.24.112.92",
    timestamp: "2024-03-03T07:50:00Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0980",
    user: "Priya Sundaram (analyst@example.com)",
    role: "ANALYST",
    action: "PHOTO_VERIFICATION_EVALUATED",
    entity: "ProjectPhoto",
    entityId: "PHT-2024-003",
    details: "Evaluated EXIF coordinates delta (4,210m); flagged status as FAIL",
    ipAddress: "115.240.90.12",
    timestamp: "2024-03-02T16:15:33Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0979",
    user: "Er. Ramesh Kulkarni (ee.pwd@example.com)",
    role: "OFFICER",
    action: "PHOTO_UPLOAD",
    entity: "ProjectPhoto",
    entityId: "PHT-2024-001",
    details: "Uploaded sub-base asphalting milestone photo with embedded GPS EXIF",
    ipAddress: "117.218.44.18",
    timestamp: "2024-03-02T14:10:00Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0978",
    user: "Dr. Arvind Subramanian (admin@example.com)",
    role: "MINISTRY_ADMIN",
    action: "SECURITY_LOGIN",
    entity: "UserSession",
    entityId: "USR-001",
    details: "Multi-factor authentication session created from Ministry Headquarters",
    ipAddress: "14.139.128.5",
    timestamp: "2024-03-02T07:45:12Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0977",
    user: "Smt. Rohini Sharma, IAS (state.mh@example.com)",
    role: "STATE_AUTHORITY",
    action: "PROJECT_FILTER_EXPORT",
    entity: "ReportExport",
    entityId: "EXP-MH-Q4",
    details: "Exported high-risk projects dataset for Maharashtra state legislative committee",
    ipAddress: "103.48.22.4",
    timestamp: "2024-03-01T17:40:22Z",
    status: "SUCCESS"
  },
  {
    id: "LOG-2024-0976",
    user: "System Daemon (Nirikshan ML Worker)",
    role: "SYSTEM",
    action: "ISOLATION_FOREST_BATCH",
    entity: "ModelResult",
    entityId: "BATCH-2024-03",
    details: "Completed unsupervised anomaly scan on 1,482 projects; 34 flagged as critical outliers",
    ipAddress: "127.0.0.1",
    timestamp: "2024-03-01T02:00:00Z",
    status: "SUCCESS"
  }
];
