import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";
import OpenAI from "openai"

export async function generateAudioFromElevenLabs(text: string, voice: string): Promise<string> {
    const elevenlabs = new ElevenLabsClient({
      apiKey: process.env.ELEVENLABS_API_KEY,
    });
  
    const audio: Readable = await elevenlabs.generate({
      voice,
      text: text,
      model_id: "eleven_multilingual_v2",
      output_format: "mp3_44100_128"
    })
  
    const chunks: Buffer[] = [];
  
    for await (const chunk of audio) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
  
    // @ts-ignore
    const audioBuffer = Buffer.concat(chunks);
    const audioBase64 = audioBuffer.toString('base64');
  
    return audioBase64;
  }

  export async function generateAudioFromOpenAI(text: string, voice: string): Promise<string> {
    console.log("generating audio")
    console.log("text: ", text)
    const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY_FOR_EMBEDDINGS,
    })
    const response = await client.audio.speech.create({
        model: "gpt-4o-mini-tts",
        input: text,
        // @ts-ignore
        voice: voice
    })
  
    // return the base64 of the audio
    const audioBuffer= await response.arrayBuffer()
    const audioBase64= Buffer.from(audioBuffer).toString('base64')
    return audioBase64
  }
  