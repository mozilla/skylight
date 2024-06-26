export function getDisplayNameForTemplate(template: string): string {
  const displayNames: any = {
    aboutwelcome: "About:Welcome Page (1st screen)",
    defaultaboutwelcome: "Default About:Welcome Message",
    feature_callout: "Feature Callout (1st screen)",
    infobar: "InfoBar",
    milestone_message: "Milestone Messages",
    multi: "1st of Multiple Messages",
    pb_newtab: "Private Browsing New Tab",
    protections_panel: "Protections Dropdown Panel",
    toast_notification: "Toast Notification",
    toolbar_badge: "Toolbar Badge",
    spotlight: "Spotlight Modal Dialog",
    update_action: "Moments Page",
  };

  if (template in displayNames) {
    return displayNames[template];
  }

  return template;
}

export function getTemplateFromMessage(msg: any): string {
  if (!msg || !msg?.template) {
    return "none";
  }

  return msg.template;
}

export function _isAboutWelcomeTemplate(template: string): boolean {
  // XXX multi shouldn't really be here, but for now, we're going to assume
  // it's a spotlight
  const aboutWelcomeSurfaces = [
    "aboutwelcome",
    "defaultaboutwelcome",
    "feature_callout",
    "multi",
    "spotlight",
  ];

  return aboutWelcomeSurfaces.includes(template);
}


export function getDashboard(
  template: string,
  msgId: string,
  channel?: string,
  experiment?: string,
  branchSlug?: string,
  startDate?: string | null,
  endDate?: string | null): string | undefined {

  const encodedMsgId = encodeURIComponent(msgId);
  const encodedTemplate = encodeURIComponent(template);
  const encodedChannel = channel ? (encodeURIComponent(channel)) : "";
  const encodedExperiment = experiment ? (encodeURIComponent(experiment)) : "";
  const encodedBranchSlug = branchSlug ? (encodeURIComponent(branchSlug)) : "";
  const encodedStartDate = startDate ? (encodeURIComponent(startDate)) : "";
  const encodedEndDate = endDate ? (encodeURIComponent(endDate)) : "";
  const dashboardId = getDashboardIdForTemplate(template);

  // Showing the last 30 complete days to ensure the dashboard isn't including today which has no data yet
  // XXX refactor the date logic below into a separate function (see https://bugzilla.mozilla.org/show_bug.cgi?id=1905204)
  let encodedSubmissionDate = "30+day+ago+for+30+day";
  if (startDate && endDate && (new Date() < new Date(endDate))) {
    encodedSubmissionDate = `${encodedStartDate}+to+${encodedEndDate}`;
  } else if (startDate) {
    encodedSubmissionDate = `${encodedStartDate}+to+today`;
  }

  if (_isAboutWelcomeTemplate(template)) {
    return `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Submission+Timestamp+Date=${encodedSubmissionDate}&Message+ID=%25${encodedMsgId?.toUpperCase()}%25&Normalized+Channel=${encodedChannel}&Experiment=${encodedExperiment}&Branch=${encodedBranchSlug}`
  }

  if (template === "infobar") {
    return `https://mozilla.cloud.looker.com/dashboards/${dashboardId}?Messaging+System+Ping+Type=${encodedTemplate}&Submission+Date=${encodedSubmissionDate}&Messaging+System+Message+Id=${encodedMsgId}&Normalized+Channel=${encodedChannel}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=&Experiment=${encodedExperiment}&Experiment+Branch=${encodedBranchSlug}`;
  }

  return undefined;
}

// Convert a UTF-8 string to a string in which only one byte of each
// 16-bit unit is occupied. This is necessary to comply with `btoa` API constraints.
export function toBinary(string: string): string {
  const codeUnits = new Uint16Array(string.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = string.charCodeAt(i);
  }
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(codeUnits.buffer))));
}

export function maybeCreateWelcomePreview(message: any): object {
  if (message.template === "defaultaboutwelcome") {
    //Shove the about:welcome message in a spotlight
    let defaultWelcomeFake = {
      id: message.id,
      template: "spotlight",
      targeting: true,
      content: message,
    };
    // Add the modal property to the spotlight to mimic about:welcome
    defaultWelcomeFake.content.modal = "tab";
    // The recipe might have a backdrop, but if not, fall back to the default
    defaultWelcomeFake.content.backdrop = message.backdrop ||
    "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)";

    return defaultWelcomeFake;
  }
  // if the message isn't about:welcome, just send it back
  return message;
}

export function getPreviewLink(message: any): string {

  let previewLink = `about:messagepreview?json=${encodeURIComponent(
    toBinary(JSON.stringify(message)),
  )}`;

  return previewLink;
}

/**
 * XXX consider moving this function inside looker.ts
 * @returns the Looker dashboard ID for a given message template
 */
export function getDashboardIdForTemplate(template: string) {
  if (template === "infobar") {
    return "1775";
  } else {
    return "1806";
  }
}
