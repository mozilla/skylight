
export function getDisplayNameForTemplate(template: string): string {

  const displayNames : any = {
    'feature_callout' : '1st Feature Callout Screen',
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