import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const groq = new OpenAI({
	apiKey: process.env.GROQ_API_KEY!,
	baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {

	const { title, copy, prompt } = await req.json();
	if (!prompt) return new Response("Prompt is required", { status: 400 });

	const preparedCopy= copy ? "Copy actual: " + copy : ""
	console.log("Título:", title, preparedCopy);
	console.log("Prompt:", prompt);
	
	const response = await groq.chat.completions.create({
		model: "mixtral-8x7b-32768",
		stream: true,
		messages: [
			{
				role: "system",
				content: `Eres un redactor de copys para Instagram que escribe siempre en perfecto español. 
				Se te entregará un prompt, el título de un post de Instagram y opcionalmente un copy.
				Si está el copy debes modificarlo o cambiarlo según el prompt. Si no está el copy debes escribirlo. 
				Escribe el texto del post de Instagram y solo responde con la versión final del texto - no incluyas otra información, contexto o explicación.
				No incluyas el prompt u otras instrucciones en tu respuesta. No agregues comillas alrededor de tu respuesta.`,
			},
			{
				role: "user",
				content: `Prompt: ${prompt}\nTítulo del post: ${title}\n${preparedCopy}`,
			},
		],
	});

	const stream = OpenAIStream(response);
	return new StreamingTextResponse(stream);
}
