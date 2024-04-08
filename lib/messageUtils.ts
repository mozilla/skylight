export function getDisplayNameForTemplate(template: string): string {
  const displayNames: any = {
    aboutwelcome: "About:Welcome Page",
    feature_callout: "Feature Callout (screen 0)",
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
  branchSlug?: string): string | undefined {

  const encodedMsgId = encodeURIComponent(msgId);
  const encodedTemplate = encodeURIComponent(template);
  const encodedChannel = channel ? (encodeURIComponent(channel)) : "";
  const encodedExperiment = experiment ? (encodeURIComponent(experiment)) : "";
  const encodedBranchSlug = branchSlug ? (encodeURIComponent(branchSlug)) : "";

  if (_isAboutWelcomeTemplate(template)) {
    return `https://mozilla.cloud.looker.com/dashboards/1677?Message+ID=%25${encodedMsgId?.toUpperCase()}%25&Normalized+Channel=${encodedChannel}&Experiment=${encodedExperiment}&Branch=${encodedBranchSlug}`
  }

  if (template === "infobar") {
    return `https://mozilla.cloud.looker.com/dashboards/1682?Messaging+System+Ping+Type=${encodedTemplate}&Submission+Date=30+days&Messaging+System+Message+Id=${encodedMsgId}&Normalized+Channel=${encodedChannel}&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=&Experiment=${encodedExperiment}&Experiment+Branch=${encodedBranchSlug}`;
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

export function getPreviewLink(message: any): string {
  let previewLink = `about:messagepreview?json=${encodeURIComponent(
    toBinary(JSON.stringify(message)),
  )}`;

  return previewLink;
}
