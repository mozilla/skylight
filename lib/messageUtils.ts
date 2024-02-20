
export function getDisplayNameForTemplate(template: string): string {

  const displayNames : any = {
    'feature_callout' : 'Feature Callout (screen 0)',
    'infobar' : 'InfoBar',
    'milestone_message': 'Milestone Messages',
    'multi': '1st of Multiple Messages',
    'pb_newtab': 'Private Browsing New Tab',
    'protections_panel': 'Protections Dropdown Panel',
    'toast_notification': 'Toast Notification',
    'toolbar_badge': 'Toolbar Badge',
    'spotlight': 'Spotlight Modal Dialog',
    'update_action': 'Moments Page',
  };
  if (template in displayNames) {
    return displayNames[template];
  }

  return template;
}

export function getTemplateFromMessage(msg : any) : string {
  if (!msg || !msg?.template) {
    return "none";
  }

  return msg.template;
}

export function _isAboutWelcomeTemplate( template : string ) : boolean {
  // XXX multi shouldn't really be here, but for now, we're going to assume
  // it's a spotlight
  const aboutWelcomeSurfaces = ['feature_callout', 'multi', 'spotlight']

  return aboutWelcomeSurfaces.includes(template);
}

export function getDashboard( template: string, msgId: string ) : string | undefined {
  const encodedMsgId = encodeURIComponent(msgId);
  const encodedTemplate = encodeURIComponent(template);

  if (_isAboutWelcomeTemplate(template)) {
    return `https://mozilla.cloud.looker.com/dashboards/1471?Message+ID=%25${encodedMsgId?.toUpperCase()}%25`
  }

  if (template === 'infobar') {
    return `https://mozilla.cloud.looker.com/dashboards/1622?Messaging+System+Ping+Type=${encodedTemplate}&Submission+Date=30+days&Messaging+System+Message+Id=${encodedMsgId}&Normalized+Channel=release&Normalized+OS=&Client+Info+App+Display+Version=&Normalized+Country+Code=`
  }

  return undefined
}
