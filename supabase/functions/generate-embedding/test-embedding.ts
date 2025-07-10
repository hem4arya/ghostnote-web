// Test script for generate-embedding Edge Function
// Run with: deno run --allow-net test-embedding.ts

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

interface TestCase {
  name: string;
  payload: {
    text: string;
  };
  expectedFields: string[];
  expectError?: boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Basic Text Embedding',
    payload: {
      text: 'This is a sample text for embedding generation.'
    },
    expectedFields: ['embedding', 'text', 'dimensions']
  },
  {
    name: 'Long Text Embedding',
    payload: {
      text: 'This is a much longer text that exceeds 100 characters to test the truncation feature in the response. It should still generate a valid embedding and return the truncated text for confirmation.'
    },
    expectedFields: ['embedding', 'text', 'dimensions']
  },
  {
    name: 'Technical Content',
    payload: {
      text: 'Machine learning is a subset of artificial intelligence that focuses on algorithms and statistical models.'
    },
    expectedFields: ['embedding', 'text', 'dimensions']
  },
  {
    name: 'Empty Text Error',
    payload: {
      text: ''
    },
    expectedFields: ['error'],
    expectError: true
  },
  {
    name: 'Whitespace Only Error',
    payload: {
      text: '   '
    },
    expectedFields: ['error'],
    expectError: true
  }
];

async function testEmbeddingGeneration() {
  console.log('🧪 Testing Generate Embedding Edge Function\n');

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify(testCase.payload)
      });

      const result = await response.json();
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Response keys: ${Object.keys(result).join(', ')}`);
      
      // Verify expected fields
      const hasExpectedFields = testCase.expectedFields.every(field => 
        Object.prototype.hasOwnProperty.call(result, field)
      );
      
      console.log(`  Has expected fields: ${hasExpectedFields ? '✅' : '❌'}`);
      
      if (result.embedding && Array.isArray(result.embedding)) {
        console.log(`  Embedding dimensions: ${result.embedding.length}`);
        console.log(`  Embedding sample: [${result.embedding.slice(0, 3).map((n: number) => n.toFixed(4)).join(', ')}...]`);
      }
      
      if (result.text) {
        console.log(`  Text echo: "${result.text}"`);
      }
      
      if (result.error && testCase.expectError) {
        console.log(`  Expected error: ✅`);
        console.log(`  Error message: ${result.error}`);
      } else if (result.error && !testCase.expectError) {
        console.log(`  Unexpected error: ❌`);
        console.log(`  Error message: ${result.error}`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`  ❌ Test failed: ${errorMessage}`);
    }
    
    console.log('');
  }
}

// Embedding quality test
async function testEmbeddingQuality() {
  console.log('🎯 Testing Embedding Quality\n');
  
  const similarTexts = [
    'Machine learning algorithms',
    'Artificial intelligence methods',
    'AI and ML techniques'
  ];
  
  const differentText = 'Cooking recipes for dinner';
  
  const embeddings: number[][] = [];
  
  // Generate embeddings for similar texts
  for (const text of similarTexts) {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ text })
      });
      
      const result = await response.json();
      if (result.embedding) {
        embeddings.push(result.embedding);
        console.log(`Generated embedding for: "${text}"`);
      }
    } catch {
      console.log(`Failed to generate embedding for: "${text}"`);
    }
  }
  
  // Generate embedding for different text
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ text: differentText })
    });
    
    const result = await response.json();
    if (result.embedding) {
      embeddings.push(result.embedding);
      console.log(`Generated embedding for: "${differentText}"`);
    }
  } catch {
    console.log(`Failed to generate embedding for: "${differentText}"`);
  }
  
  // Calculate similarities
  if (embeddings.length >= 4) {
    const cosineSimilarity = (a: number[], b: number[]) => {
      const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
      const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
      const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
      return dotProduct / (magnitudeA * magnitudeB);
    };
    
    console.log('\nSimilarity Analysis:');
    console.log(`Similar text 1 vs 2: ${cosineSimilarity(embeddings[0], embeddings[1]).toFixed(4)}`);
    console.log(`Similar text 1 vs 3: ${cosineSimilarity(embeddings[0], embeddings[2]).toFixed(4)}`);
    console.log(`Similar text vs Different: ${cosineSimilarity(embeddings[0], embeddings[3]).toFixed(4)}`);
    console.log('(Higher values indicate more similarity)');
  }
}

// Performance test
async function performanceTest() {
  console.log('\n⚡ Performance Testing\n');
  
  const testTexts = [
    'Short text',
    'This is a medium length text that contains more words and should take slightly longer to process.',
    'This is a very long text that contains many words and sentences. It includes various topics and concepts that the embedding model needs to process and understand. The purpose is to test how the system handles longer inputs and whether there are any performance implications when dealing with more extensive content that requires more computational resources to generate meaningful vector representations.'
  ];
  
  for (const text of testTexts) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-embedding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ text })
      });
      
      const result = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`Text length: ${text.length} chars - ${duration}ms`);
      
      if (result.embedding) {
        console.log(`  Embedding dimensions: ${result.embedding.length}`);
      }
      
    } catch (error) {
      console.log(`  Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Generate Embedding Edge Function Test Suite\n');
  console.log('Make sure to update SUPABASE_URL and SUPABASE_ANON_KEY before running!\n');
  
  await testEmbeddingGeneration();
  await testEmbeddingQuality();
  await performanceTest();
  
  console.log('\n✅ All tests completed!');
}

// Run if this is the main module
runAllTests().catch(console.error);

export {};
