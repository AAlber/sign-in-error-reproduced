/* eslint-disable import/no-anonymous-default-export */

/** Defining all the different API routes */

export default {
  /** User Data */
  getUserData: "/api/kv-cached/user-data",
  createClerkUser: "/api/auth/createClerkUser",

  /** Vercel Edge Config */

  getEdgeConfig: "/api/edge-config",

  /** Unsplash */

  searchUnsplash: "/api/unsplash",

  /** AI api calls */

  generateTask: "/api/ai/task-generator",
  testaiKey: "/api/ai/test-key",
  generateContent: "/api/ai/generate-content",
  generateContentForPdf: "/api/ai/generate-content-for-pdf",
  grammerImprovement: "/api/ai/grammar-improvement",
  createAssistant: "/api/ai/openai-assistants/create-assistant",
  generateObject: "/api/ai/generate-object",
  handleNewThreadMessage: "/api/ai/openai-assistants/handle-new-thread-message",
  handleNewAutoLessonThreadMessage:
    "/api/ai/auto-lesson/handle-auto-lesson-thread",
  getUsageReport: "/api/ai/budget/get-report",
  getAIToolCompletion: "/api/ai/ai-tool-button-completion",
  generateChapters: "/api/ai/auto-lesson/generate-chapters",
  getAutoLessonThread: "/api/ai/auto-lesson/get-thread",
  getAutoLessonQuestionForChapter:
    "/api/ai/auto-lesson/get-question-for-chapter",
  getDocuChatThread: "/api/ai/docu-chat/get-thread",
  getDocuChatThreadForSpecificUser: "/api/ai/docu-chat/get-thread-of-user",
  createDocuChatAssistant: "/api/docu-chat/create-assistant",
  getAIAppointmentFillout: "/api/ai/schedule/generate-appointment-data",

  /** Institution related API Calls */

  getInstitutions: "/api/institutions/get-institutions/",
  createInstitution: "/api/institutions/create-institution",
  completeInstitutionOnboarding:
    "/api/institutions/complete-institution-onboarding",
  createTrialSubscription: "/api/institutions/create-trial-subscription",
  updateInstitution: "/api/institutions/update-institution",
  deleteInstitution: "/api/institutions/delete-institution",
  deleteEmptyInstitution: "/api/institutions/delete-empty-institution",

  /** Institution User Data Field related API Calls */

  createInstitutionUserDataField:
    "/api/institution-user-data-field/create-institution-user-data-field",
  createInstitutionUserDataFields:
    "/api/institution-user-data-field/create-institution-user-data-fields",
  getInstitutionUserDataFields:
    "/api/institution-user-data-field/get-institution-user-data-fields",
  updateInstitutionUserDataField:
    "/api/institution-user-data-field/update-institution-user-data-field",
  deleteInstitutionUserDataField:
    "/api/institution-user-data-field/delete-institution-user-data-field",
  setInstitutionUserDataFieldValues:
    "/api/institution-user-data-field/set-institution-user-data-field-values",
  getInstitutionUserDataValuesOfFields:
    "/api/institution-user-data-field/get-institution-user-data-values-of-fields",
  getInstitutionUserDataFieldValues:
    "/api/institution-user-data-field/get-institution-user-data-field-values",
  getUserEmptyDataFields:
    "/api/institution-user-data-field/get-user-empty-data-fields",
  updateInstitutionUserDataFieldValues:
    "/api/institution-user-data-field/update-user-empty-data-fields",

  /** Token and Verification related API Calls */

  getStreamToken: "/api/token/stream-token",
  getToken: "/api/token/",

  /** User related API Calls */

  createInstitutionUser: "/api/users/create-institution-user",
  importInstitutionUsers: "/api/users/import-users",
  getUser: "/api/users/get-user",
  updateUser: "/api/users/update-user",
  updateUserPic: "/api/users/update-user-pic/",
  updateUserInstitution: "/api/users/update-user-institution",
  getChats: "/api/chats/",
  createChat: "/api/chats/create-chat",
  sendChatMessage: "/api/chats/send-message",
  addUserToInstitutionChat: "/api/users/add-to-institution-chat",
  removeUserInstitution: "/api/users/remove-user-institution",
  getUserGrades: "/api/users/grades",
  getSpecificUserGrades: "/api/users/specific-user-grades",
  getUserNotes: "/api/notes/get-user-notes",
  createUserNotes: "/api/notes/create-user-notes",
  updateUserNotes: "/api/notes/update-user-notes",
  deleteUserNotes: "/api/notes/delete-user-notes",
  getLayerIdsOfUser: "/api/users/get-layer-ids",

  /** User Role related API Calls */

  createRole: "/api/role/create-role",
  getRolesOfUser: "/api/role/get-from-user/",
  hasRolesWithAccess: "/api/role/has-roles-with-access",
  getUsersByRole: "/api/users/get-by-role/",
  getUsersByLayerId: "/api/users/get-by-layer/",
  deleteRole: "/api/role/delete-role",
  countUsers: "/api/role/count/",
  getInstitutionsOfUser: "/api/role/get-institutions/",
  removeAdminRole: "/api/role/remove-admin-role",
  searchCoursesUserHasAccessTo:
    "/api/role/search-courses-user-has-special-access-to/",
  getLayersUserHasSpecialAccessTo:
    "/api/role/get-layers-user-has-special-access-to",
  getTopMostLayersUserHasAccessTo:
    "/api/role/get-top-most-layers-user-has-access-to",
  removeFromInstitution: "/api/role/remove-from-institution",
  removeManyFromInstitution: "/api/role/remove-many-from-institution",
  getUsersOfInstitution: "/api/role/get-users-of-institution",
  getUsersOfLayer: "/api/role/get-users-of-layer",
  getAdminsOfInstitution: "/api/role/get-admins-of-institution",
  getUsersForAddingToLayer: "/api/role/get-user-to-add-for-layer",
  hasRoleInInstitution: "/api/role/has-role-in-institution",
  setStatusOfUsers: "/api/role/set-status-of-users",
  getContentCourseBlocks: "/api/kv-cached/get-course-content-blocks",
  getContentBlockUserStatus: "/api/courses/get-content-block-user-status",
  getAllUserIdsOfInstitution: "/api/role/get-user-ids-of-institution",

  /** User Integrations related API Calls */
  getAppointmentInvitationEmails:
    "/api/user-integrations/appointment-invitations/get",
  connectAppointmentInvitationEmail:
    "/api/user-integrations/appointment-invitations/connect",
  deleteAppointmentInvitationEmail:
    "/api/user-integrations/appointment-invitations/delete",

  /** Adminstration related API Calls */

  createLayer: "/api/administration/create-layer",
  getLayerTree: "/api/administration/get-layer-tree/",
  updateLayerTimespan: "/api/administration/update-layer-timespan",
  deleteLayer: "/api/administration/delete-layer",
  getLayer: "/api/administration/",
  renameLayer: "/api/administration/rename-layer",
  reorderLayerAndUpdateChildrenPosition:
    "/api/administration/reorder-layer-position",
  getCoursesUserHasAccessTo:
    "/api/administration/get-courses-user-has-access-to",
  getCoursesForEctsExport: "/api/ects/get-courses-for-ects-export",
  getLayerPath: "/api/administration/get-layer-path/",
  getLayerPathId: "/api/administration/get-layer-path-id/",
  getDataForEctsExport: "/api/ects/get-ects-data",
  getDataForEctsExportForMany: "/api/ects/get-ects-data-for-many",
  getEctsPdfUploadKeys: "/api/ects/pdf-uploads/get-keys",
  setEctsPdfUploadKeys: "/api/ects/pdf-uploads/set-key",
  deleteEctsFile: "/api/ects/pdf-uploads/delete-file",
  getUserCoursesWithProgressData:
    "/api/kv-cached/get-user-courses-with-progress-data",
  getDeletedLayers: "/api/administration/get-deleted-layers",
  recoverDeletedLayer: "/api/administration/recover-deleted-layer",

  /** Rating schema related API Calls */

  createRatingSchema: "/api/rating-schema/create-rating-schema",
  updateRatingSchema: "/api/rating-schema/update-rating-schema",
  deleteRatingSchema: "/api/rating-schema/delete-rating-schema",
  getRatingSchemas: "/api/rating-schema/get-rating-schemas",
  createRatingSchemaValue: "/api/rating-schema/create-rating-schema-value",
  getRatingSchemaValues: "/api/rating-schema/get-rating-schema-values",
  updateRatingSchemaValue: "/api/rating-schema/update-rating-schema-value",
  deleteRatingSchemaValue: "/api/rating-schema/delete-rating-schema-value",

  /** Course related API Calls */

  createCourse: "/api/courses/create-course",
  createPost: "/api/courses/feed/create-post",
  createSurveyPost: "/api/courses/feed/survey/create-survey",
  updateSurveyPost: "/api/courses/feed/survey/update-survey",
  deletePost: "/api/courses/feed/delete-post",
  getCourse: "/api/courses/",
  getCoursesOfInstitution: "/api/courses/",
  getSurveyPost: "/api/courses/feed/survey",
  renameCourse: "/api/courses/rename-course",
  updateCourseTheme: "/api/courses/update-theme",
  updateCourseDescription: "/api/courses/update-description",
  importDataFromOtherCourse: "/api/courses/import-data-from-course",
  createFeedback: "/api/courses/feedback/create-feedback",
  getFeedback: "/api/courses/feedback/get-feedback",
  getCourseMembers: "/api/courses/get-all-course-members",
  getInitialCourseData: "/api/courses/get-initial-course-data/",

  createCourseGoal: "/api/course-goal/create-course-goal",
  updateCourseGoal: "/api/course-goal/update-course-goal",
  deleteCourseGoal: "/api/course-goal/delete-course-goal",
  getCourseGoal: "/api/course-goal/get-course-goal",

  /** Course Goal Content Block related API Calls */

  createCourseGoalContentBlock:
    "/api/course-goal-block/create-course-goal-block",
  updateCourseGoalContentBlock:
    "/api/course-goal-block/update-course-goal-block",
  deleteCourseGoalContentBlock:
    "/api/course-goal-block/delete-course-goal-block",
  getCourseGoalContentBlocks: "/api/course-goal-block/get-course-goal-blocks",

  /** Course Goal (updated version) related API Calls */

  getCourseGoals: "/api/course-goals/",
  upsertCourseGoal: "/api/course-goals/upsert-course-goal/",
  removeContentBlockFromCourseGoal: "/api/course-goals/remove-content-block",

  /** Content Block rating related API Calls */

  createContentBlockRating:
    "/api/content-block-rating/create-content-block-rating",
  updateContentBlockRating:
    "/api/content-block-rating/update-content-block-rating",
  deleteContentBlockRating:
    "/api/content-block-rating/delete-content-block-rating",
  getContentBlockRating: "/api/content-block-rating/get-content-block-rating",

  /** Overwrite user course status related API Calls */

  overwriteUserCourseStatus:
    "/api/course-overwritten-user-status/overwrite-course-user-status",
  removeOverwriteUserCourseStatus:
    "/api/course-overwritten-user-status/remove-overwritten-course-user-status",

  /** Schedule related API Calls */

  createAppointment: "/api/schedule/create-appointment",
  getAppointments: "/api/schedule/",
  getAppointmentsOfWeek: "/api/schedule/get-appointments-of-week/",
  getAllUpcomingAppointments: "/api/schedule/get-all-upcoming-appointments",
  updateAppointment: "/api/schedule/update-appointment",
  deleteAppointment: "/api/schedule/delete-appointment",
  getUsersAndAvailability: "/api/schedule/get-users-and-availability",
  getLayersAndChildrenWithAppointments:
    "/api/schedule/get-layers-and-children-with-appointments",
  updateAppointmentURL: "/api/schedule/update-appointment-url",
  getCourseUpcomingAppointments:
    "/api/kv-cached/get-course-upcoming-appointments",
  getAppointmentsWithAttendenceOfUser:
    "/api/schedule/get-appointments-with-attendence-of-user",
  searchAppointments: "/api/schedule/search-appointments",

  /** Appointment Attendence related API Calls */

  checkInAttendence: "/api/schedule/attendence/attendence-check-in",
  checkInAttendenceWithRotatingQr:
    "/api/schedule/attendence/attendence-rotating-qr-check-in",
  checkInOnlineAttendence:
    "/api/schedule/attendence/online-attendence-check-in",
  /** @deprecated */
  updateAttendanceKeyExpiry:
    "/api/schedule/attendence/update-attendance-key-expiry",
  updateAttendanceKeyValidity:
    "/api/schedule/attendence/update-attendance-key-validity",
  getAttendenceKey: "/api/schedule/attendence/get-attendence-key",
  getAttendenceOfUser: "/api/schedule/attendence/get-attendence-of-user",
  getAttendenceOfUsers: "/api/schedule/attendence/get-attendence-of-users",
  updateAttendenceOfUser: "/api/schedule/attendence/update-attendence-of-user",
  updateAttendenceOfUsers:
    "/api/schedule/attendence/update-attendence-of-users",
  updateAttendenceOfUsersWithFullData:
    "/api/schedule/attendence/update-attendence-of-users-with-full-data",
  getAllAttendenceLogsOfAppointment:
    "/api/schedule/attendence/get-all-attendence-logs-of-appointment",
  getAttendanceLogsOfUser:
    "/api/schedule/attendence/get-attendance-logs-of-user",
  getRotatingQr: "/api/schedule/attendence/get-rotating-qr",
  getPossibleAttendees: "/api/schedule/get-possible-attendees",
  getSelectedAttendees: "/api/schedule/get-selected-attendees",
  updateNotes: "/api/schedule/update-notes",

  /** Invite Related API Calls */

  createInvite: "/api/invite/create",
  joinInvite: "/api/invite/join",
  getInvite: "/api/invite/",
  revokePendingInvites: "/api/invite/revoke-pending-invites",
  countPendingInvites: "/api/invite/count-pending-invites/",
  getInviteForEmail: "/api/invite/get-invite-for-email",

  /** Task related API Calls */

  createAssessment: "/api/tasks/create-task",
  getAssessments: "/api/tasks/",
  getAssessment: "/api/tasks/get-specific/",
  getAssessmentByBlockId: "/api/tasks/get-by-blockid/",
  publishAssessment: "/api/tasks/publish-task",
  deleteAssessment: "/api/tasks/delete-task",
  updateAssessment: "/api/tasks/update-task",
  getAssessmentStatus: "/api/tasks/get-status/",
  getAssessmentStatusForModeratorOverview: "/api/tasks/get-mod-status/",

  /** Task Document relared API Calls */

  getAssessmentUserDocument: "/api/tasks/task-user-document/",
  updateAssessmentUserDocument:
    "/api/tasks/task-user-document/update-task-user-document",
  getAssessmentUserDocumentByContentBlock:
    "/api/tasks/task-user-document/get-by-blockid/",
  getAssessmentDocumentStatusByBlockId:
    "/api/tasks/task-user-document/get-status/",
  getAssessmentMembersStatus:
    "/api/tasks/task-user-document/get-members-status",

  getUsersForChatCreation: "/api/chat/get-users-for-chat-creation",
  promoteToModerator: "/api/chat/groups/add-moderator",
  demoteAsModerator: "/api/chat/groups/remove-moderator",
  removeUserFromChannel: "/api/chat/user-management/remove-user-from-channel",
  removeUserFromInstitution:
    "/api/chat/user-management/remove-user-from-institution",

  /** Content block related API Calls */

  createContentBlock: "/api/content-block/create-content-block",
  getContentBlocksOfLayer: "/api/content-block/",
  getAllContentBlocksOfLayer:
    "/api/content-block/get-all-content-blocks-of-layer",
  updateBlockRequirement:
    "/api/content-block/requirements/update-block-requirement",
  deleteContentBlock: "/api/content-block/delete-content-block",
  hasMetBlockRequirements:
    "/api/content-block/requirements/has-met-requirements/",
  createContentBlockFeedback:
    "/api/content-block/create-content-block-feedback",
  getContentBlockFeedback: "/api/content-block/get-content-block-feedback",
  getContentBlockUserData: "/api/content-block/get-content-block-user-data",

  /** Hand in related API Calls */

  createHandIn: "/api/hand-in/create-hand-in",
  updateHandInHasEnded: "/api/hand-in/update-has-ended",
  checkHandInHasEnded: "/api/hand-in/check-has-ended/",
  getHandInStatusForModeratorOverview: "/api/hand-in/get-mod-status/",
  getHandInUserDocumentStatus: "/api/hand-in/hand-in-document/get-status/",
  createHandInUserDocument:
    "/api/hand-in/hand-in-document/create-hand-in-document",
  getHandInUserDocument: "/api/hand-in/hand-in-document/get-hand-in-document",

  /** Learning Material related API Calls */

  createLearning: "/api/learning/create-learning",
  getLearning: "/api/learning/",
  getLearningStatusForModeratorOverview: "/api/learning/get-mod-status/",
  getLearningUserStatus: "/api/learning/learning-document/get-status/",
  getLearningUserProcess: "/api/learning/learning-document/get-status-content/",
  updateLearningUserProcess:
    "/api/learning/learning-document/update-learning-document",
  registerLearningMaterialAsOpenedByUser:
    "/api/learning/learning-document/create-learning-document",

  /** Auto Lesson related API Calls */

  createAutoLesson: "/api/auto-lesson/create-auto-lesson",
  getAutoLesson: "/api/auto-lesson/get-auto-lesson",
  addMessageToAutoLessonChat:
    "/api/auto-lesson/add-message-to-auto-lesson-chat/",
  generateNextMessage: "/api/auto-lesson/generate-next-message/",
  createAutoLessonAssistant: "/api/auto-lesson/create-assistant",

  /** Access pass api Calls */

  createAccessPass: "/api/stripe/access-passes/create-access-pass",
  getAccessPassStatusInfos:
    "/api/stripe/access-passes/get-access-pass-status-infos",
  sendAccessPassUsageReport:
    "/api/stripe/access-passes/send-access-pass-usage-report",
  deleteAccessPass: "/api/stripe/access-passes/delete-access-pass",
  updateAccessPass: "/api/stripe/access-passes/update-access-pass",

  /** Paid access pass api Calls */
  getStripeConnectAccount: "/api/stripe/paid-access-passes/get-account",
  createStripeConnectAccount: "/api/stripe/paid-access-passes/create-account",

  /** Tax Rate api Calls */

  createTaxRate: "/api/stripe/paid-access-passes/tax-rates/create",
  updateTaxRate: "/api/stripe/paid-access-passes/tax-rates/update",
  getAllTaxRates: "/api/stripe/paid-access-passes/tax-rates/get-all",

  /** Institution Settings related API Calls */
  getInstitutionSettings: "/api/institution-settings/get-institution-settings",
  updateInstitutionSettings:
    "/api/institution-settings/update-institution-settings",
  getInstitutionSettingsValues:
    "/api/institution-settings/get-institution-settings-values",
  getInstitutionSettingsProfileDataPoints:
    "/api/institution-settings/get-institution-settings-profile-data-points",
  getInstitutionStorageStatus:
    "/api/institution-settings/get-institution-storage-status",

  /** User Institution Profile related API Calls */

  getInstitutionProfileCurrentUser:
    "/api/institution-user-profile/get-institution-user-profile",
  getInstitutionProfileOfSpecificUser:
    "/api/institution-user-profile/get-institution-user-profile-of-user/",
  updateInstitutionUserProfile:
    "/api/institution-user-profile/update-institution-user-profile",
  hasCompleteInstitutionProfile:
    "/api/institution-user-profile/has-complete-profile",

  /** Stripe */
  createStripeSubscription: "/api/stripe/create-subscription",
  updateSubscriptionPaymentMethod: "/api/stripe/update-subscription-payMethod",
  createSetupIntent: "/api/stripe/create-setup-intent",
  getPaymentMethods: "/api/stripe/get-payment-methods",
  getSubscription: "/api/stripe/get-subscription",
  getInvoices: "/api/stripe/get-invoices",
  updateSubscription: "/api/stripe/update-subscription",
  cancelSubscription: "/api/stripe/cancel-subscription",
  reactivateSubscription: "/api/stripe/reactivate-subscription",
  getPaymentIntentStatus: "/api/stripe/get-payment-intent-status",
  getCoupon: "/api/stripe/get-coupon",
  getCustomerAndTaxId: "/api/stripe/get-customer-and-tax-id",
  checkInstitutionSubscriptionStatus:
    "/api/stripe/check-institution-subscription-status",
  updateCustomerInformation: "/api/stripe/update-customer-information",
  updateCustomerCompanyName: "/api/stripe/update-customer-company-name",
  updateCustomerTaxId: "/api/stripe/update-customer-tax-id",
  createCheckoutSession: "/api/stripe/add-ons/create-checkout-session",
  getStatusOfPaidAddOns: "/api/stripe/add-ons/get-status-of-paid-add-ons",
  cancelAddOn: "/api/stripe/add-ons/cancel-add-on",
  reactivateAddOn: "/api/stripe/add-ons/reactivate-add-on",
  validatePromoCode: "/api/stripe/validate-promo-code",
  createAccessPassSubscription:
    "/api/stripe/access-passes/create-access-pass-subscription",
  getUpcomingInvoicePreview: "/api/stripe/get-upcoming-invoice-preview",
  updateCustomerLanguage: "/api/stripe/update-customer-language",
  getUserInvoices: "/api/stripe/get-user-invoices",
  createBillingPortalSession: "/api/stripe/create-billing-portal-session",

  /** Institution Room related API Calls */

  createRoom: "/api/room/create-room",
  updateRoom: "/api/room/update-room",
  deleteRooms: "/api/room/delete-rooms",
  getRoomsOfInstitution: "/api/room/rooms-of-institution/",
  getRoomsOfInstitutionWithAppointments:
    "/api/room/rooms-of-institution-with-appointments/",
  deleteRoom: "/api/room/delete-room",
  getRoomWithAppointments: "/api/room/get-room-with-appointments/",
  getAppointmentsOfRoom: "/api/room/get-appointments-of-room",

  // Institution User Group related API Calls

  createUserGroup: "/api/institution-user-group/create-institution-user-group",
  updateUserGroup: "/api/institution-user-group/update-institution-user-group",
  deleteUserGroup: "/api/institution-user-group/delete-institution-user-group",
  getUserGroupsOfInstitution:
    "/api/institution-user-group/user-groups-of-institution",
  getEmailsOfUserGroup: "/api/institution-user-group/emails-of-user-group/",
  getUserGroupsOfInstitutionForUser:
    "/api/institution-user-group/user-groups-of-institution-for-user/",
  getUserGroup: "/api/institution-user-group/get-user-group/",
  addUsersToUserGroup: "/api/institution-user-group/add-users-to-group",
  getUsersOfUserGroups: "/api/institution-user-group/get-users-of-user-groups/",
  giveGroupAccessToLayer:
    "/api/institution-user-group/give-group-access-to-layer",
  getGroupsOfUser: "/api/institution-user-group/get-groups-of-user/",
  removeUsersFromUserGroups:
    "/api/institution-user-group/remove-users-from-groups",
  removeUsersFromAllUserGroups:
    "/api/institution-user-group/remove-users-from-all-groups",

  /** Admin Dashboard */
  adminDashGetInstitutions: "/api/admin-dashboard/admin-dash-get-institutions",
  adminDashCreateInstitution:
    "/api/admin-dashboard/admin-dash-create-institution",
  extendSubscriptionOfInstitution:
    "/api/admin-dashboard/extend-institution-subscription",
  instantCancelSubscription: "/api/admin-dashboard/instant-cancel-subscription",
  adminDashDeleteInstitution:
    "/api/admin-dashboard/admin-dash-delete-institution",
  adminDashEncryptPaymentSettings:
    "/api/admin-dashboard/admin-dash-encrypt-payment-settings",
  sendAdminDashAdminInvite: "/api/admin-dashboard/send-admin-invite",
  adminDashGetUserOverview: "/api/admin-dashboard/get-user-overview",
  adminDashUpdateInstitutionCredits:
    "/api/admin-dashboard/update-institution-credits",
  adminDashDeleteInstitutionCoupon:
    "/api/admin-dashboard/delete-institution-coupon",

  // Time Tracking related API Calls
  getTrackingDataForUser: "/api/time-tracking/get-tracking-data/",

  // Institution Schedule Monitor related API Calls
  addLayerToMonitor: "/api/institution-schedule-monitor/add-layer-to-monitor",
  removeLayerFromMonitor:
    "/api/institution-schedule-monitor/remove-layer-from-monitor",
  getLayersOfMonitor: "/api/institution-schedule-monitor/get-layers-of-monitor",
  updateLayerPositions:
    "/api/institution-schedule-monitor/update-layer-positions",

  // Notification related API Calls

  countNotifications: "/api/notifications/count",
  getNotifications: "/api/notifications/get-notifications",
  deleteNotification: "/api/notifications/delete-notification",
  deleteAllNotifications: "/api/notifications/delete-all",

  // Peer Feedback related API Calls

  createPeerFeedback: "/api/peer-feedback/create",
  deletePeerFeedback: "/api/peer-feedback/delete",
  getPeerFeedback: "/api/peer-feedback/get-all-for-layer/",
  getPeerFeedbacksOfUser: "/api/peer-feedback/get-of-user/",
  getPeerFeedbackGivenToUser: "/api/peer-feedback/get-given-to-user/",

  // Big Blue Button related API Calls

  generateBBBLink: "/api/big-blue-button/generate-bbb-link",

  // Zoom related API Calls

  createZoomMeeting: "/api/zoom/create-meeting",
  getGeneralAppZoomAccessToken: "/api/zoom/get-general-app-access-token",

  // Widget related API Calls

  getWidgetData: "/api/widgets/get-widgets",

  //Update the institution theme
  updateInstitutionTheme: "/api/institution-theme/update-institution-theme",

  createPresignedUrl: "/api/cloudflare/create-presigned-url",
  uploadFile: "/api/cloudflare/upload",
  deleteFile: "/api/cloudflare/delete",
  downloadFile: "/api/cloudflare/download",
  getFiles: "/api/cloudflare/",
  listFilesInDirectory: "/api/cloudflare/list-files-in-directory",
  moveFiles: "/api/cloudflare/move-files",
  getInstitutionStorageOverview:
    "/api/cloudflare/get-institution-storage-overview",
  getStorageCategories: "/api/cloudflare/get-storage-categories",
  //Custom filters
  createScheduleCustomFilter: "/api/schedule/filter/create-custom-filter",
  getScheduleCustomFilters: "/api/schedule/filter/get-custom-filter",
  deleteScheduleCustomFilter: "/api/schedule/filter/delete-custom-filter",

  //appointments creation layers
  getChildrenIdsOfLayerInAppointment: "/api/schedule/get-children-of-layer",

  //workbench
  getEditorAItoken: "/api/editor/ai-token",
  // getstream chat
  updateChannelPermission: "/api/chat/update-channel-permission",

  // Moodle Integration
  getMoodleAccountInformation: "/api/moodle/get-account-information",
  getMoodleIntegrationData: "/api/moodle/get-data",
  setMoodleCredentials: "/api/moodle/set-credentials",
  deleteMoodleIntegration: "/api/moodle/delete",
  syncMoodleDataPoints: "/api/moodle/sync-data-points",

  getAIFillout: "/api/planner/ai-fillout",
  getAIFixSuggestions: "/api/planner/ai-fix-suggestion",
  getAIConstraintsWithAppliedSuggestion: "/api/planner/ai-apply-suggestion",
  getUnavailabilities: "/api/planner/get-unavailabilities",
  getDraftAppointments: "/api/planner/get-draft-appointments",

  getInstitutionUserDocuments: "/api/users/user-documents/",

  deleteAllTestInstitutions: "/api/institutions/delete-all-test-institutions",
};
