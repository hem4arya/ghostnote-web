# GhostNote Advanced Search Indexing Strategy

## Overview

This document outlines a comprehensive, scalable search indexing strategy designed to handle 100k+ notes with minimal search lag. The strategy combines multiple PostgreSQL indexing techniques optimized for Supabase.

## Core Indexing Strategy

### 1. Multi-Modal Search Approach

The system implements three complementary search methods:

- **Semantic Search**: Vector embeddings for meaning-based matching
- **Full-Text Search**: PostgreSQL's built-in tsvector for exact term matching  
- **Fuzzy Search**: Trigram matching for typo-tolerant searches

### 2. Database Schema Optimization

#### Enhanced Notes Table
```sql
-- Core content fields
title TEXT
body TEXT
tags TEXT[]
category TEXT
author TEXT
keywords TEXT[]

-- Search optimization fields
search_vector tsvector        -- Pre-computed full-text search vector
embedding vector(384)         -- Semantic search embeddings
slug TEXT                     -- URL-friendly identifier
word_count INTEGER           -- Content length metadata
reading_time_minutes INTEGER -- Estimated reading time
last_indexed_at TIMESTAMP    -- Index maintenance tracking

-- Performance metrics
purchase_count INTEGER
view_count INTEGER
rating DECIMAL(3,2)
review_count INTEGER
trending_score DECIMAL(5,2)
```

#### Normalized Tag/Category System
```sql
-- Separate tags table for consistency and performance
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE,
  slug VARCHAR(50) UNIQUE,
  usage_count INTEGER DEFAULT 0
);

-- Junction table for many-to-many relationships
CREATE TABLE note_tags (
  note_id BIGINT REFERENCES notes(id),
  tag_id BIGINT REFERENCES tags(id),
  PRIMARY KEY (note_id, tag_id)
);

-- Categories table for better organization
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE,
  slug VARCHAR(100) UNIQUE,
  note_count INTEGER DEFAULT 0
);
```

## Comprehensive Indexing Strategy

### 1. Primary Search Indexes

#### Full-Text Search (GIN Index)
```sql
CREATE INDEX idx_notes_search_vector_gin ON notes USING gin(search_vector);
```
- **Purpose**: Lightning-fast exact term matching
- **Performance**: Sub-millisecond searches on 100k+ records
- **Use Case**: Searches like "React performance optimization"

#### Semantic Search (IVFFlat Index)
```sql
CREATE INDEX idx_notes_embedding_ivfflat ON notes 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```
- **Purpose**: Meaning-based similarity search
- **Performance**: Optimized for vector similarity comparisons
- **Use Case**: Finding related content even with different terminology

### 2. Fuzzy Search Indexes (Trigram)

```sql
-- Enable fuzzy matching for typos and partial matches
CREATE INDEX idx_notes_title_trgm ON notes USING gin (title gin_trgm_ops);
CREATE INDEX idx_notes_body_trgm ON notes USING gin (body gin_trgm_ops);
CREATE INDEX idx_notes_author_trgm ON notes USING gin (author gin_trgm_ops);
```
- **Purpose**: Typo-tolerant search
- **Performance**: Handles misspellings and partial matches
- **Use Case**: "Reakt tutorial" still finds "React tutorial"

### 3. Array Indexes (GIN)

```sql
-- Efficient array operations for tags and keywords
CREATE INDEX idx_notes_tags_gin ON notes USING gin(tags);
CREATE INDEX idx_notes_keywords_gin ON notes USING gin(keywords);
```
- **Purpose**: Fast tag/keyword filtering
- **Performance**: Supports ANY/ALL array operations
- **Use Case**: "Find notes tagged with React AND JavaScript"

### 4. Composite Indexes for Common Query Patterns

```sql
-- Most frequent search pattern: public + category + popularity
CREATE INDEX idx_notes_public_category_popularity 
ON notes(is_public, category, purchase_count DESC, view_count DESC) 
WHERE is_public = true;

-- Price range filtering
CREATE INDEX idx_notes_price_range 
ON notes(price, is_public) WHERE is_public = true;

-- Recent popular content
CREATE INDEX idx_notes_recent_popular 
ON notes(created_at DESC, trending_score DESC) 
WHERE is_public = true;
```

### 5. Partial Indexes for Optimization

```sql
-- Index only public notes (90%+ of queries)
CREATE INDEX idx_notes_public_only 
ON notes(id, title, category, author, price, rating) 
WHERE is_public = true;

-- High-quality content index
CREATE INDEX idx_notes_high_quality 
ON notes(rating DESC, review_count DESC) 
WHERE is_public = true AND rating >= 4.0;
```

## Hybrid Search Function

The system implements a unified search function that combines all three search methods:

```sql
CREATE FUNCTION hybrid_search_notes(
  search_query TEXT,
  query_embedding vector(384) DEFAULT NULL,
  category_filter TEXT DEFAULT NULL,
  min_rating DECIMAL(3,2) DEFAULT 0.0,
  max_price DECIMAL(10,2) DEFAULT 999999.99,
  match_threshold FLOAT DEFAULT 0.3,
  match_count INT DEFAULT 20,
  search_type TEXT DEFAULT 'hybrid'
)
```

### Scoring Algorithm
- **Semantic Score (50%)**: Vector similarity relevance
- **Full-Text Score (30%)**: Exact term matching relevance  
- **Fuzzy Score (20%)**: Typo-tolerant matching relevance

## Scalability Strategy (100k+ Notes)

### 1. Automatic Index Maintenance

#### Search Vector Updates
```sql
-- Trigger automatically updates search vectors on content changes
CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE OF title, body, author, category, tags
  ON notes FOR EACH ROW
  EXECUTE FUNCTION update_search_vector();
```

#### Periodic Maintenance Functions
```sql
-- Run daily: Update popularity metrics
SELECT update_popularity_metrics();

-- Run weekly: Reindex search vectors
SELECT reindex_search_vectors();

-- Run monthly: Maintain index health
SELECT maintain_search_indexes();
```

### 2. Performance Optimizations

#### Query Optimization
- **Partial Indexes**: Only index public notes (reduces index size by ~80%)
- **Composite Indexes**: Cover most common query patterns
- **Index-Only Scans**: Include frequently accessed columns in indexes

#### Memory Management
```sql
-- Configure PostgreSQL for search performance
SET work_mem = '256MB';          -- Increase sort memory for large result sets
SET random_page_cost = 1.1;      -- Optimize for SSD storage
SET effective_cache_size = '8GB'; -- Adjust based on available RAM
```

#### Connection Pooling
- Use Supabase's built-in connection pooling
- Configure appropriate pool sizes for search workload
- Implement query result caching for popular searches

### 3. Horizontal Scaling Strategies

#### Read Replicas
- Route search queries to read replicas
- Keep write operations on primary database
- Implement eventual consistency for search indexes

#### Partitioning (For 1M+ Notes)
```sql
-- Partition by creation date for very large datasets
CREATE TABLE notes_y2025m01 PARTITION OF notes
FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

CREATE TABLE notes_y2025m02 PARTITION OF notes
FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');
```

#### Caching Strategy
```sql
-- Cache popular searches in Redis/Memcached
-- Cache key format: "search:{query_hash}:{filters_hash}"
-- TTL: 15 minutes for fresh content
-- Invalidation: On content updates affecting cached results
```

## Performance Monitoring

### 1. Search Analytics

```sql
-- Track search performance metrics
CREATE TABLE search_performance (
  query TEXT,
  search_type TEXT,
  results_count INTEGER,
  execution_time_ms INTEGER,
  created_at TIMESTAMP
);
```

### 2. Index Usage Monitoring

```sql
-- Monitor index effectiveness
SELECT schemaname, tablename, indexname, idx_tup_read, idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_tup_read DESC;
```

### 3. Query Performance Analysis

```sql
-- Enable query timing
SET track_io_timing = on;

-- Analyze slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE query LIKE '%notes%'
ORDER BY mean_time DESC;
```

## Implementation Checklist

### Phase 1: Core Indexing (Week 1)
- [ ] Deploy advanced indexing migration
- [ ] Update search functions to use new indexes
- [ ] Configure automatic search vector updates
- [ ] Test search performance with sample data

### Phase 2: Optimization (Week 2)
- [ ] Implement hybrid search function
- [ ] Add search analytics tracking
- [ ] Configure maintenance functions
- [ ] Set up monitoring dashboards

### Phase 3: Scalability (Week 3)
- [ ] Implement caching layer
- [ ] Configure connection pooling
- [ ] Set up read replica routing
- [ ] Load test with 100k+ records

### Phase 4: Production Optimization (Week 4)
- [ ] Fine-tune index parameters
- [ ] Optimize query patterns
- [ ] Implement search result caching
- [ ] Monitor and adjust based on usage patterns

## Expected Performance Metrics

| Dataset Size | Search Time | Throughput | Memory Usage |
|-------------|-------------|------------|--------------|
| 10k notes   | < 50ms     | 1000 RPS  | 512MB       |
| 100k notes  | < 100ms    | 500 RPS   | 2GB         |
| 1M notes    | < 200ms    | 200 RPS   | 8GB         |

## Maintenance Schedule

| Task | Frequency | Impact | Downtime |
|------|-----------|--------|----------|
| Update popularity metrics | Daily | Low | None |
| Reindex search vectors | Weekly | Medium | < 1min |
| Vacuum/Analyze | Weekly | Medium | None |
| Full reindex | Monthly | High | 5-10min |

## Troubleshooting

### Common Issues

1. **Slow Search Performance**
   - Check index usage with `EXPLAIN ANALYZE`
   - Verify statistics are up-to-date with `ANALYZE`
   - Consider index rebuilding if fragmented

2. **High Memory Usage**
   - Reduce `work_mem` if experiencing OOM
   - Implement result pagination
   - Add query result caching

3. **Index Bloat**
   - Monitor index size growth
   - Schedule regular `VACUUM` operations
   - Consider `REINDEX CONCURRENTLY` for large indexes

### Performance Tuning

```sql
-- Check index usage statistics
SELECT * FROM pg_stat_user_indexes WHERE schemaname = 'public';

-- Monitor table and index sizes
SELECT tablename, 
       pg_size_pretty(pg_total_relation_size(tablename::regclass)) as size
FROM pg_tables WHERE schemaname = 'public';

-- Identify unused indexes
SELECT schemaname, tablename, indexname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes 
WHERE idx_scan = 0 AND schemaname = 'public';
```

This indexing strategy provides a robust foundation for scaling GhostNote's search capabilities to handle hundreds of thousands of notes while maintaining sub-100ms search response times.
