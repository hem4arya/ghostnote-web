// Test script for search-notes Edge Function
// Run with: deno run --allow-net test-search.ts

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

interface TestCase {
  name: string;
  payload: {
    query: string;
    match_threshold?: number;
    match_count?: number;
  };
  expectedFields: string[];
  expectError?: boolean;
}

const testCases: TestCase[] = [
  {
    name: 'Basic Search Query',
    payload: {
      query: 'machine learning tutorial'
    },
    expectedFields: ['query', 'notes', 'total_results', 'search_metadata']
  },
  {
    name: 'Search with Custom Threshold',
    payload: {
      query: 'javascript programming',
      match_threshold: 0.6,
      match_count: 5
    },
    expectedFields: ['query', 'notes', 'total_results', 'search_metadata']
  },
  {
    name: 'Technical Content Search',
    payload: {
      query: 'artificial intelligence algorithms'
    },
    expectedFields: ['query', 'notes', 'total_results', 'search_metadata']
  },
  {
    name: 'Empty Query Error',
    payload: {
      query: ''
    },
    expectedFields: ['error'],
    expectError: true
  },
  {
    name: 'Whitespace Only Error',
    payload: {
      query: '   '
    },
    expectedFields: ['error'],
    expectError: true
  }
];

async function testSearchFunction() {
  console.log('🔍 Testing Search Notes Edge Function\n');

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/search-notes`, {
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
      
      if (result.notes && Array.isArray(result.notes)) {
        console.log(`  Results count: ${result.notes.length}`);
        if (result.notes.length > 0) {
          const firstResult = result.notes[0];
          console.log(`  First result: "${firstResult.title}" (similarity: ${firstResult.similarity?.toFixed(3) || 'N/A'})`);
        }
      }
      
      if (result.search_metadata) {
        console.log(`  Embedding dimensions: ${result.search_metadata.embedding_dimensions}`);
        console.log(`  Match threshold: ${result.search_metadata.match_threshold}`);
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

interface SearchNote {
  id: number;
  title: string;
  body: string;
  similarity: number;
}

// Search quality test
async function testSearchQuality() {
  console.log('🎯 Testing Search Quality\n');
  
  const qualityTests = [
    {
      query: 'machine learning',
      expectedKeywords: ['machine', 'learning', 'ml', 'ai', 'algorithm']
    },
    {
      query: 'web development',
      expectedKeywords: ['web', 'development', 'frontend', 'backend', 'javascript']
    },
    {
      query: 'data science',
      expectedKeywords: ['data', 'science', 'analytics', 'python', 'statistics']
    }
  ];
  
  for (const test of qualityTests) {
    console.log(`Query: "${test.query}"`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/search-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ query: test.query, match_count: 5 })
      });
      
      const result = await response.json();
      
      if (result.notes && result.notes.length > 0) {
        console.log(`  Found ${result.notes.length} results`);
        
        // Analyze result relevance
        const relevantResults = result.notes.filter((note: SearchNote) => {
          const content = `${note.title} ${note.body}`.toLowerCase();
          return test.expectedKeywords.some(keyword => 
            content.includes(keyword.toLowerCase())
          );
        });
        
        const relevanceScore = relevantResults.length / result.notes.length;
        console.log(`  Relevance score: ${(relevanceScore * 100).toFixed(1)}%`);
        
        // Show top result
        const topResult = result.notes[0];
        console.log(`  Top result: "${topResult.title}" (${(topResult.similarity * 100).toFixed(1)}% similarity)`);
      } else {
        console.log(`  No results found`);
      }
    } catch {
      console.log(`  Search failed`);
    }
    
    console.log('');
  }
}

// Performance test
async function performanceTest() {
  console.log('⚡ Performance Testing\n');
  
  const performanceQueries = [
    'short query',
    'this is a medium length search query with more words',
    'this is a very long and detailed search query that contains many words and concepts that should test the performance of the semantic search system when processing longer and more complex input text'
  ];
  
  for (const query of performanceQueries) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/search-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({ query })
      });
      
      const result = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log(`Query length: ${query.length} chars - ${duration}ms`);
      console.log(`  Results: ${result.notes?.length || 0}`);
      
    } catch (error) {
      console.log(`  Failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Search Notes Edge Function Test Suite\n');
  console.log('Make sure to update SUPABASE_URL and SUPABASE_ANON_KEY before running!\n');
  
  await testSearchFunction();
  await testSearchQuality();
  await performanceTest();
  
  console.log('\n✅ All tests completed!');
}

// Run if this is the main module
runAllTests().catch(console.error);

export {};
