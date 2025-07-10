-- Enable the pgvector extension
create extension if not exists vector;

-- Create the notes table
create table notes (
  id bigserial primary key,
  title text,
  body text,
  tags text[],
  category text,
  author text,
  keywords text[],
  embedding vector(384) -- 384 is the dimension of the all-MiniLM-L6-v2 model
);

-- Create a function to match notes based on their embeddings
create or replace function match_notes (
  query_embedding vector(384),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  body text,
  tags text[],
  category text,
  author text,
  keywords text[],
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    notes.id,
    notes.title,
    notes.body,
    notes.tags,
    notes.category,
    notes.author,
    notes.keywords,
    1 - (notes.embedding <=> query_embedding) as similarity
  from notes
  where 1 - (notes.embedding <=> query_embedding) > match_threshold
  order by similarity desc
  limit match_count;
end;
$$;
