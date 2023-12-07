import { execute } from "../../.graphclient";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const GraphqlRequestBodySchema = z.object({
  query: z.string({ required_error: "Missing query" }),
  operationName: z.string().optional(),
  variables: z.record(z.unknown()).optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log({ req });
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const body = req.body;
  const result = GraphqlRequestBodySchema.safeParse(body);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }
  const operation = result.data;
  const response = await execute(operation.query, operation.variables, undefined, undefined, operation.operationName);
  res.status(200).json(response);
}
