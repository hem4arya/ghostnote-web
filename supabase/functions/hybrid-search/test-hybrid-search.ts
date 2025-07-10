// Test script for hybrid search Edge Function
// Run with: deno run --allow-net test-hybrid-search.ts

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

interface TestCase {
  name: string;
  payload: Record<string, unknown>;
  expectedFields: string[];
}

const testCases: TestCase[] = [
  {
    name: 'Basic Hybrid Search',
    payload: {
      query: 'machine learning tutorial',
      search_type: 'hybrid',
      match_count: 5
    },
    expectedFields: ['search_results', 'search_metadata', 'execution_time_ms']
  },
  {
    name: 'Semantic Search Only',
    payload: {
      query: 'artificial intelligence',
      search_type: 'semantic',
      match_threshold: 0.4
    },
    expectedFields: ['search_results', 'search_metadata']
  },
  {
    name: 'Search with Filters',
    payload: {
      query: 'web development',
      category: 'Technology',
      min_rating: 4.0,
      max_price: 100.0,
      search_type: 'fulltext'
    },
    expectedFields: ['search_results', 'search_metadata', 'search_suggestions']
  },
  {
    name: 'Empty Query Error',
    payload: {
      query: '',
      search_type: 'hybrid'
    },
    expectedFields: ['error']
  }
];

async function testHybridSearch() {
  console.log('🧪 Testing Hybrid Search Edge Function\n');

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.name}`);
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/hybrid-search`, {
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
      
      if (result.search_results) {
        console.log(`  Results count: ${result.search_results.length}`);
        console.log(`  Execution time: ${result.execution_time_ms}ms`);
      }
      
      if (result.error) {
        console.log(`  Error message: ${result.error}`);
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`  ❌ Test failed: ${errorMessage}`);
    }
    
    console.log('');
  }
}

// Performance test
async function performanceTest() {
  console.log('⚡ Performance Testing\n');
  
  const queries = [
    'javascript tutorial',
    'python data science',
    'react components',
    'machine learning basics',
    'web design principles'
  ];
  
  const times: number[] = [];
  
  for (const query of queries) {
    const startTime = Date.now();
    
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/hybrid-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          query,
          search_type: 'hybrid',
          match_count: 10
        })
      });
      
      const result = await response.json();
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      times.push(duration);
      console.log(`Query: "${query}" - ${duration}ms (${result.search_results?.length || 0} results)`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Query: "${query}" - Failed: ${errorMessage}`);
    }
  }
  
  if (times.length > 0) {
    const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const maxTime = Math.max(...times);
    const minTime = Math.min(...times);
    
    console.log(`\nPerformance Summary:`);
    console.log(`  Average: ${avgTime.toFixed(0)}ms`);
    console.log(`  Min: ${minTime}ms`);
    console.log(`  Max: ${maxTime}ms`);
  }
}

// Run tests
async function runAllTests() {
  console.log('🚀 Hybrid Search Edge Function Test Suite\n');
  console.log('Make sure to update SUPABASE_URL and SUPABASE_ANON_KEY before running!\n');
  
  await testHybridSearch();
  await performanceTest();
  
  console.log('✅ All tests completed!');
}

// Run if this is the main module
runAllTests().catch(console.error);

export {};
