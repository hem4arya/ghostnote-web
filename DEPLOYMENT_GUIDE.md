# 🔍 GhostNote Advanced Search System - Deployment Guide

## Quick Start

### Option 1: Automated Deployment (Recommended)

**Windows (PowerShell):**
```powershell
.\deploy-search.ps1
```

**macOS/Linux (Bash):**
```bash
chmod +x deploy-search.sh
./deploy-search.sh
```

### Option 2: Manual Deployment

1. **Apply Database Migrations:**
   ```bash
   supabase db push
   ```

2. **Deploy Edge Functions:**
   ```bash
   supabase functions deploy hybrid-search
   supabase functions deploy advanced-search
   supabase functions deploy search-notes
   supabase functions deploy generate-embedding
   ```

## ✅ Deployment Verification

### 1. Test Database Schema
```sql
-- Check if new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('tags', 'categories', 'note_tags', 'search_performance', 'user_interactions');

-- Check if new columns exist
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'notes' 
AND column_name IN ('search_vector', 'word_count', 'trending_score', 'creator_trust_score');

-- Verify indexes are created
SELECT indexname FROM pg_indexes 
WHERE tablename = 'notes' 
AND indexname LIKE 'idx_notes_%';
```

### 2. Test Edge Functions
```bash
# Test hybrid search function
curl -X POST 'https://your-project.supabase.co/functions/v1/hybrid-search' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"query": "test search", "search_type": "hybrid"}'
```

### 3. Test Frontend Component
Add the component to a page:
```tsx
import HybridSmartSearch from '@/components/HybridSmartSearch';

function SearchPage() {
  return <HybridSmartSearch />;
}
```

## 🔧 Configuration

### Environment Variables
Ensure these are set in your Supabase project:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for functions)

### Database Configuration
For optimal performance with 100k+ notes:
```sql
-- Increase work memory for search operations
ALTER SYSTEM SET work_mem = '256MB';

-- Optimize for SSD storage
ALTER SYSTEM SET random_page_cost = 1.1;

-- Increase effective cache size
ALTER SYSTEM SET effective_cache_size = '8GB';

-- Reload configuration
SELECT pg_reload_conf();
```

## 📊 Monitoring & Maintenance

### Daily Tasks
```sql
-- Update popularity metrics
SELECT update_popularity_metrics();
```

### Weekly Tasks
```sql
-- Reindex search vectors
SELECT reindex_search_vectors();

-- Check index usage
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public' 
ORDER BY idx_scan DESC;
```

### Monthly Tasks
```sql
-- Maintain index health
SELECT maintain_search_indexes();

-- Analyze table statistics
ANALYZE notes;
ANALYZE user_interactions;
ANALYZE search_performance;
```

### Performance Monitoring
```sql
-- Monitor search performance
SELECT 
  search_type,
  AVG(execution_time_ms) as avg_time,
  COUNT(*) as query_count,
  AVG(results_count) as avg_results
FROM search_performance 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY search_type;

-- Find slow queries
SELECT query, execution_time_ms, results_count, created_at
FROM search_performance 
WHERE execution_time_ms > 200 
ORDER BY execution_time_ms DESC 
LIMIT 10;

-- Popular search terms
SELECT query, COUNT(*) as frequency
FROM search_performance 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY query 
ORDER BY frequency DESC 
LIMIT 10;
```

## 🚀 Performance Optimization

### Index Tuning
```sql
-- Check index bloat
SELECT 
  schemaname, tablename, indexname,
  pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
  idx_scan, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- Reindex if needed
REINDEX INDEX CONCURRENTLY idx_notes_search_vector_gin;
REINDEX INDEX CONCURRENTLY idx_notes_embedding_ivfflat;
```

### Query Optimization
```sql
-- Check query plans for search functions
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM hybrid_search_notes('test query', NULL, NULL, 0, 999999, 0.3, 20, 'hybrid');
```

## 🔄 Scaling for Large Datasets

### For 100k+ Notes:
1. **Partition by Date:**
   ```sql
   -- Create monthly partitions
   CREATE TABLE notes_y2025m01 PARTITION OF notes
   FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
   ```

2. **Read Replicas:**
   - Route search queries to read replicas
   - Keep writes on primary database

3. **Connection Pooling:**
   - Configure pgBouncer in Supabase
   - Use connection pooling in application

### For 1M+ Notes:
1. **Separate Search Database:**
   - Dedicated search cluster
   - Real-time synchronization

2. **External Search Engine:**
   - Consider Elasticsearch or Algolia
   - Hybrid approach with PostgreSQL

## 🛠️ Troubleshooting

### Common Issues

**Issue: Search returns no results**
```sql
-- Check if search vectors are populated
SELECT COUNT(*) FROM notes WHERE search_vector IS NOT NULL;

-- Manually trigger search vector update
SELECT update_search_vector() FROM notes LIMIT 1;
```

**Issue: Slow search performance**
```sql
-- Check index usage
SELECT * FROM pg_stat_user_indexes WHERE indexname LIKE 'idx_notes_%';

-- Analyze table statistics
ANALYZE notes;
```

**Issue: High memory usage**
```sql
-- Reduce work_mem temporarily
SET work_mem = '64MB';

-- Check current settings
SELECT name, setting, unit FROM pg_settings 
WHERE name IN ('work_mem', 'shared_buffers', 'effective_cache_size');
```

### Error Logs
Monitor Supabase logs for:
- Function execution errors
- Database connection issues
- Performance warnings

## 📈 Performance Expectations

| Dataset Size | Search Time | Throughput | Memory Usage |
|-------------|-------------|------------|--------------|
| 10k notes   | < 50ms     | 1000 RPS  | 512MB       |
| 100k notes  | < 100ms    | 500 RPS   | 2GB         |
| 1M notes    | < 200ms    | 200 RPS   | 8GB         |

## 🆘 Support

If you encounter issues:

1. **Check the logs** in Supabase Dashboard
2. **Verify configurations** using the SQL queries above
3. **Test with smaller datasets** first
4. **Monitor resource usage** during peak times

## 📚 Additional Resources

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Performance Tuning Guide](https://wiki.postgresql.org/wiki/Performance_Optimization)

---

🎉 **Congratulations!** Your advanced search system is now deployed and ready to handle intelligent, scalable searches for GhostNote!
