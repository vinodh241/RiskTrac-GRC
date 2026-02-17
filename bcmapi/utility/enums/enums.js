const RISK_RATING_TYPES = {
    INHERENT_RISK_RATING        : 1,
    RESIDUAL_RISK_RATING        : 2,
    MATRIX_RESIDUAL_RISK_RATING : 3
}

const WORKFLOW_STATUS = {
    NOT_STARTED             : 'Assessment is Not yet started',
    SCHEDULED               : 'Assessment to be moved to In-Progress',
    DRAFT                   : 'Assessment is In Progress by the Risk Owner',
    SUBMIT_FOR_REVIEW       : 'To be submitted by Risk Owners for Review',
    RESPONDED               : 'Assessment under Review by BCManager',
    UNDER_BCM_REVIEW        : 'Review to be submitted by the BCManager',
    APPROVED                : 'Assessment Approved by BCManager',
    TO_BE_PUBLISHED         : 'Pending to be Published',
    PUBLISHED               : 'Assessment Published',
}

const WORKFLOW_ACTION_BUTTONS = {
    SUBMIT_FOR_REVIEW       : 'Submit For Review',
    TAKE_REVIEW_ACTION      : 'Take Review Action',
    PUBLISH                 : 'Publish Assessment'
}

const SRA_WORKFLOW_N_REVIEW_STATUS = {
  DELAYED_RESPONSE      : 'Delayed Response',
  RE_SUBMITTED          : 'Resubmitted',
  REVIEW_PENDING        : 'Review Pending',
  NEW                   : 'New',
  DRAFT                 : 'Draft',
  RETURN_WITH_COMMENT   : 'Returned With Comment',
  RESPONDED             : 'Responded'

}

const INC_STATUS = {
   ON_GOING         : 'Ongoing'
}

const BUDGET_REQUIRED_LIST =  [{
    "IsBudgetRequired": 1,
    "IsBudgetRequiredName": "Yes"
  },
  {
    "IsBudgetRequired": 0,
    "IsBudgetRequiredName": "No"
  }]

const AFFILIATION_LIST = [{
  "AffiliationID"   : 1,
  "AffiliationName" : "Internal"
},
{
  "AffiliationID"   : 2,
  "AffiliationName" : "External"
}]

const REMEDIATION_WORKFLOW_STATUS = {
  ACTION_ITEM_NEW                           : "Pending with BC Manager",
  ACTION_ITEM_ASSIGNED                      : "Assigned to Action Item Owner",
  ACTION_ITEM_OPEN                          : "Open and Pending with Action Item Owner",
  ACTION_ITEM_SUBMIT                        : "Submit Action Item (Action Item Owner)",
  ACTION_ITEM_REVIEW_BUSINESS_OWNER         : "Review Pending (Site/Business Owner)",
  ACTION_ITEM_REVIEW_BCMANAGER              : "Review Pending (BC Manager)",
  ACTION_ITEM_EXTEND_REVIEW_BUSINESS_OWNER  : "Extension Review Pending (Site/Business Owner)",
  ACTION_ITEM_EXTEND_REVIEW_BCMANAGER       : "Extension Review Pending (BC Manager)",
  ACTION_ITEM_ESCALATION_REVIEW             : "Escalation Review Pending (BCM Steering Committee)",
}

const NEW_REMEDIATION_TRACKER = {
  "currentWorkFlowStatus" : "New Action Item",
  "nextWorkflowStatus"    : "Action Item Open"
}

const REMEDIATION_TRACKER_COMMENT_TAGS = {
  UPDATE_TAG                        : "Update comment added by - Action Item owner",
  REVIEW_TAG_BUSINESS_OWNER         : "Review Decision details by Business Owner/Site Admin Head",
  REVIEW_TAG_BC_MANAGER             : "Review Decision details by BC Manager",
  SUBMIT_TAG                        : "Submit comment added by - Action Item owner",
  REVIEW_EXT_TAG_ACTION_ITEM_OWNER  : "Extension Request comment by - Action Item owner",
  REVIEW_EXT_TAG_BUSINESS_OWNER     : "Extension Request Review comment by - Business Owner/Site Admin Head",
  REVIEW_EXT_TAG_BC_MANAGER         : "Extension Request Review comment by - BC Manager",
  REVIEW_ESCALATION_TAG             : "Escalation Request Review comment by - BCM Steering Committee User"
}

const RISK_CALCULATION_RANGES = [
  {
    "OverallInherentRiskRatingID" : 1,
    "OverallInherentRiskRating"   : "Low",
    "Computation"                 : "<4"
  },
  {
    "OverallInherentRiskRatingID" : 2,
    "OverallInherentRiskRating"   : "Medium",
    "Computation"                 : ">=4 & <=7"
  },
  {
    "OverallInherentRiskRatingID" : 3,
    "OverallInherentRiskRating"   : "High",
    "Computation"                 : ">7"
  }
]

const IMPACT_LIST_DROPDOWN =  [{
  "ImpactID": 1,
  "ImpactName": "No Impact",
  "impactClass" : 'bg-noimpact',
  "color" :'white'
},
{
  "ImpactID": 2,
  "ImpactName": "Minor",
  "impactClass" : 'bg-minor',
  "color" :'#D6FDFF'
},
{
  "ImpactID": 3,
  "ImpactName": "Considerable",
  "impactClass" : 'bg-cons',
  "color" :'#FFF1D6'
},
{
  "ImpactID": 4,
  "ImpactName": "Major",
  "impactClass" : 'bg-major',
  "color" :'#FFDBDB'
}]


const IN_APP_ALERTS_INFO_DATA =  [
  {
    "SubModuleID"  : "5",
    "Route"        : "site-risk-assessments/site-risk-listing",
  },
  {
    "SubModuleID"  : "6",
    "Route"        : "business-impact-analysis/business-impact-analysis",
  },
  {
    "SubModuleID"  : "7",
    "Route"        : "",
  },
  {
    "SubModuleID"  : "8",
    "Route"        : "bcms-testing/bcms-test-listing",
  },
  {
    "SubModuleID"  : "9",
    "IncRoute"     : "incident-report/incident-report-list",
    "CrisisRoute"  : "crisis-communication/crisis-communication-list"
  },
  {
    "SubModuleID"  : "12",
    "Route"        : "remediation-tracker/remediation-listing",
  }
]



module.exports = {
        RISK_RATING_TYPES                 : RISK_RATING_TYPES,
        WORKFLOW_STATUS                   : WORKFLOW_STATUS,
        WORKFLOW_ACTION_BUTTONS           : WORKFLOW_ACTION_BUTTONS,
        BUDGET_REQUIRED_LIST              : BUDGET_REQUIRED_LIST,
        AFFILIATION_LIST                  : AFFILIATION_LIST,
        REMEDIATION_WORKFLOW_STATUS       : REMEDIATION_WORKFLOW_STATUS,
        NEW_REMEDIATION_TRACKER           : NEW_REMEDIATION_TRACKER,
        REMEDIATION_TRACKER_COMMENT_TAGS  : REMEDIATION_TRACKER_COMMENT_TAGS,
        IMPACT_LIST_DROPDOWN              : IMPACT_LIST_DROPDOWN,
        RISK_CALCULATION_RANGES           : RISK_CALCULATION_RANGES,
        SRA_WORKFLOW_N_REVIEW_STATUS      : SRA_WORKFLOW_N_REVIEW_STATUS,
        INC_STATUS                        : INC_STATUS,
        IN_APP_ALERTS_INFO_DATA           : IN_APP_ALERTS_INFO_DATA
};

