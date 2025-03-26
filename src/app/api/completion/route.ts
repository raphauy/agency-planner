import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
	const { title, copy, prompt } = await req.json();
	if (!prompt) return new Response("Prompt is required", { status: 400 });

	const preparedCopy = copy ? "Copy actual: " + copy : "";
	console.log("Título:", title, preparedCopy);
	console.log("Prompt:", prompt);
	
	const result = await streamText({
		model: openai("gpt-4o-mini"),
		messages: [
			{
				role: "user",
				content: `Prompt: ${prompt}\nTítulo del post: ${title}\n${preparedCopy}`,
			},
		],
		system: `Eres un redactor de copys para Instagram que escribe siempre en perfecto español. 
		Se te entregará un prompt, el título de un post de Instagram y opcionalmente un copy.
		Si está el copy debes modificarlo o cambiarlo según el prompt. Si no está el copy debes escribirlo. 
		Escribe el texto del post de Instagram y solo responde con la versión final del texto - no incluyas otra información, contexto o explicación.
		No incluyas el prompt u otras instrucciones en tu respuesta. No agregues comillas alrededor de tu respuesta.`,
	});

	return result.toDataStreamResponse();
}
