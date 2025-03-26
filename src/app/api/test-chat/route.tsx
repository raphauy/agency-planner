import { copyLabTools } from '@/services/tools';
import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    tools: copyLabTools,
    // tools: {
    //   // server-side tool with execute function:
    //   getWeatherInformation: {
    //     description: 'devuelve el tiempo actual en una ciudad dada al usuario',
    //     parameters: z.object({ city: z.string() }),
    //     execute: async ({}: { city: string }) => {
    //       const weatherOptions = ['soleado', 'nublado', 'lluvioso', 'nevado', 'ventoso'];
    //       return weatherOptions[
    //         Math.floor(Math.random() * weatherOptions.length)
    //       ];
    //     },
    //   },
    //   // client-side tool that starts user interaction:
    //   askForConfirmation: {
    //     description: 'pregunta al usuario por confirmación',
    //     parameters: z.object({
    //       message: z.string().describe('El mensaje a preguntar por confirmación'),
    //     }),
    //   },
    //   // client-side tool that is automatically executed on the client:
    //   getLocation: {
    //     description:
    //       'Obtiene la ubicación del usuario. Siempre pregunta por confirmación antes de usar esta herramienta.',
    //     parameters: z.object({}),
    //   },
    // },
  });

  return result.toDataStreamResponse();
}