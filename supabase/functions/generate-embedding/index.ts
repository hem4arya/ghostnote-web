import { pipeline } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.1/dist/transformers.min.js';
import { corsHeaders } from '../_shared/cors.ts';

// Use a singleton pattern to load the model only once.
class PipelineSingleton {
    static task = 'feature-extraction';
    static model = 'Xenova/all-MiniLM-L6-v2';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

Deno.serve(async (req: any) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Extract input text from the request body
  const { text } = await req.json();

  // Get the pipeline instance
  const extractor = await PipelineSingleton.getInstance();

  // Generate the embedding
  const output = await extractor(text, {
    pooling: 'mean',
    normalize: true,
  });

  // Extract the embedding from the output
  const embedding = Array.from(output.data);

  // Return the embedding
  return new Response(
    JSON.stringify({ embedding }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  )
});
