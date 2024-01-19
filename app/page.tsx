import { Message, columns } from "./columns"
import { MessageTable } from "./message-table"
import Link from "next/link";

function getASRouterLocalColumnFromJSON(messageDef: any) : Message {
  return {
    product: 'Desktop',
    release: 'Fx 123',
    id: messageDef.id,
    topic: messageDef.provider,
    surface: messageDef.template,
    segment: 'some segment',
    metrics: 'some metrics',
    ctrPercent: .5, // getMeFromLooker
    ctrPercentChange: 2, // getMeFromLooker
    ctrDashboardLink: "http://localhost/derive-from-alex-dboard",
    previewLink: `about:messagepreview?json=${btoa(JSON.stringify(messageDef))}`,
  }
}

async function getASRouterLocalMessages(): Promise<Message[]> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/123-nightly-in-progress.json",
    "utf8");
  let json_data = JSON.parse(data);
  let messages : Message[] =
    json_data.map((messageDef : any) : Message => getASRouterLocalColumnFromJSON(messageDef));

  return messages;
}

export default async function Dashboard() {
  // XXX useEffect
  const data = await getASRouterLocalMessages()

  return (
    <div>
      <div>
        <h4 className="scroll-m-20 text-xl font-semibold text-center py-4">
          Nightly 123 in-tree Production ASRouter messages
        </h4>

        <ul className="list-disc mx-20 text-sm">
          <li>
            To make the preview links work, set <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code> to <code>true</code> in <code>about:config</code>.
          </li>

          <li>
            This is a prototype for learning & feedback, not a commitment to future direction.
          </li>

          <li>
            <Link
          href="https://github.com/mozilla/protolight/blob/main/TODO.md">Rationale & tentative todo-list for this prototype</Link>
          </li>

          <li>
          Feedback of all kinds accepted in <Link href="https://mozilla.slack.com/archives/C05N15KHCLC">#skylight-messaging-system</Link>
          </li>
        </ul>
      </div>

      <div className="container mx-auto py-10">
        <MessageTable columns={columns} data={data} />
      </div>
    </div>
  )
}
