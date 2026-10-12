// Some MCP clients expose only text content to the model. Keep the complete
// payload there as well so downstream tool calls do not lose structured fields.
export function toolResult(result, summary) {
  return {
    structuredContent: result,
    content: [
      { type: "text", text: `${summary} ${result.disclaimer}` },
      { type: "text", text: JSON.stringify(result) }
    ]
  };
}
