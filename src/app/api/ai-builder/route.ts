import { isProjectPlanRequest } from "@/lib/ai-builder/contracts";
import { selectProjectPlanner } from "@/lib/ai-builder/planner";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "Expected application/json." }, { status: 415 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isProjectPlanRequest(body)) {
    return Response.json({ error: "Prompt must contain 3-800 characters and locale must be es or en." }, { status: 400 });
  }

  try {
    const { provider, configurationNotice } = selectProjectPlanner();
    const result = await provider.generatePlan({ ...body, prompt: body.prompt.trim() });
    return Response.json({
      ...result,
      notice: configurationNotice ? `${result.notice} ${configurationNotice}` : result.notice,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate a project plan.";
    return Response.json({ error: message }, { status: 502 });
  }
}
