import { Message, columns } from "./columns"
import { MessageTable } from "./message-table"

function getMessageColumnFromJSON(messageDef: any) : Message {
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
    json_data.map((messageDef : any) : Message => getMessageColumnFromJSON(messageDef));

  return messages;
}

export default async function Dashboard() {
  const data = await getASRouterLocalMessages()

  return (
    <div>
      <h4 className="scroll-m-20 text-xl font-semibold text-center py-4">
        Nightly 123 in-tree Production ASRouter messages
      </h4>

      <div className="container mx-auto py-10">
        <MessageTable columns={columns} data={data} />
      </div>
    </div>
  )
}
