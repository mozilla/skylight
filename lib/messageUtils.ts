import { FxMSMessageInfo } from "@/app/columns";
import { getLookerSubmissionTimestampDateFilter } from "./lookerUtils";

export type SurfaceData = {
  surface: string;
  tagColor?: string;
  docs?: string;
};

export function getSurfaceDataForTemplate(template: string): SurfaceData {
  const surfaceData: Record<string, SurfaceData> = {
    aboutwelcome: {
      surface: "About:Welcome Page (1st screen)",
      tagColor: "bg-red-400",
    },
    cfr: {
      surface: "Contextual Feature Recommendation",
      tagColor: "bg-red-200",
    },
    cfr_doorhanger: {
      surface: "Doorhanger",
      tagColor: "bg-orange-200",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#doorhanger",
    },
    defaultaboutwelcome: {
      surface: "Default About:Welcome Message (1st screen)",
      tagColor: "bg-orange-400",
    },
    feature_callout: {
      surface: "Feature Callout (1st screen)",
      tagColor: "bg-yellow-300",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#feature-callouts",
    },
    infobar: {
      surface: "InfoBar",
      tagColor: "bg-lime-300",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#infobar",
    },
    menu: {
      surface: "Menu Messages",
      tagColor: "bg-pink-300",
    },
    milestone_message: {
      surface: "Milestone Messages",
      tagColor: "bg-green-400",
    },
    multi: {
      surface: "1st of Multiple Messages",
      tagColor: "bg-teal-300",
    },
    pb_newtab: {
      surface: "Private Browsing New Tab",
      tagColor: "bg-sky-400",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#privatebrowsing",
    },
    protections_panel: {
      surface: "Protections Dropdown Panel",
      tagColor: "bg-blue-500",
    },
    rtamo: {
      surface: "Return to AMO",
      tagColor: "bg-violet-200",
    },
    toast_notification: {
      surface: "Toast Notification",
      tagColor: "bg-indigo-400",
    },
    toolbar_badge: { surface: "Toolbar Badge", tagColor: "bg-purple-400" },
    // XXX Consider removing after we start reading JSON from remote settings
    "toolbar-badge": { surface: "Toolbar Badge", tagColor: "bg-purple-400" },
    spotlight: {
      surface: "Spotlight Modal Dialog",
      tagColor: "bg-pink-400",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#multistage-spotlight",
    },
    update_action: {
      surface: "Moments Page",
      tagColor: "bg-rose-400",
      docs: "https://experimenter.info/messaging/desktop-messaging-surfaces/#moments-pages",
    },
    "whats-new-panel": { surface: "What's New Panel", tagColor: "bg-sky-200" },
    whatsNewPage: { surface: "What's New Page", tagColor: "bg-fuchsia-300" },
  };

  if (template in surfaceData) {
    return surfaceData[template];
  }

  return {
    surface: template,
  };
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
  endDate?: string | null,
  isCompleted?: boolean,
): string | undefined {
  // The isCompleted value can be useful for messages that used to be in remote
  // settings or old versions of Firefox.
  const submissionDate = getLookerSubmissionTimestampDateFilter(
    startDate,
    endDate,
    isCompleted,
  );
  const dashboardId = getDashboardIdForTemplate(template);
  let baseUrl = `https://mozilla.cloud.looker.com/dashboards/${dashboardId}`;
  let paramObj;

  if (_isAboutWelcomeTemplate(template)) {
    paramObj = {
      "Submission Timestamp Date": submissionDate,
      "Message ID": `%${msgId}%`,
      "Normalized Channel": channel ? channel : "",
      Experiment: experiment ? experiment : "",
      Branch: branchSlug ? branchSlug : "",
    };
  }

  if (template === "infobar") {
    paramObj = {
      "Messaging System Ping Type": template,
      "Submission Date": submissionDate,
      "Messaging System Message Id": msgId,
      "Normalized Channel": channel ? channel : "",
      "Normalized OS": "",
      "Client Info App Display Version": "",
      "Normalized Country Code": "",
      Experiment: experiment ? experiment : "",
      "Experiment Branch": branchSlug ? branchSlug : "",
    };
  }

  if (paramObj) {
    const params = new URLSearchParams(Object.entries(paramObj));
    let url = new URL(baseUrl);
    url.search = params.toString();
    return url.toString();
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
  return btoa(
    String.fromCharCode(...Array.from(new Uint8Array(codeUnits.buffer))),
  );
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
    defaultWelcomeFake.content.backdrop =
      message.backdrop ||
      "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)";

    return defaultWelcomeFake;
  }
  // if the message isn't about:welcome, just send it back
  return message;
}

export function getEditableJSON(message: any): string | undefined {
  // fallbacks for important properties
  switch (message.template) {
    case "spotlight":
      try {
        message.content.screens.forEach((screen: any) => {
          if (!screen.id) {
            screen.id = message.content.id;
          }
        });
        return message;
      } catch (e) {
        console.log("Could not generate editable JSON: ", e);
      }
      break;
    case "infobar":
      try {
        if (message.content && message.content.buttons) {
          return message;
        }
      } catch (e) {
        console.log("Could note generate editable JSON: ", e);
      }
      break;
    default:
      return undefined;
  }
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
    return "1809";
  } else {
    return "1818";
  }
}

/**
 * @returns true if the message has a microsurvey. Currently, this check
 * only involves looking for the "survey" subtring inside the message id.
 */
export function messageHasMicrosurvey(messageId: string): boolean {
  return messageId.toLowerCase().includes("survey");
}

/**
 * A sorting function to determine the order of the message by their surfaces.
 *
 * @returns -1 if the surface for message a is alphabetically before the
 *          surface for message b, zero if they're equal, and 1 otherwise.
 */
export function compareSurfacesFn(
  a: FxMSMessageInfo,
  b: FxMSMessageInfo,
): number {
  if (a.surface < b.surface) {
    return -1;
  } else if (a.surface > b.surface) {
    return 1;
  }
  return 0;
}
