"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

// Import the new structured editor
import Editor from './editor';

const CreateNotePageNew = () => {
  const [title, setTitle] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving note with title:', title);
  };

  const handleWordCountChange = (words: number, chars: number) => {
    setWordCount(words);
    setCharCount(chars);
  };

  return (
    <div className="min-h-screen bg-ghost-black p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-2xl border-ghost-purple/20 bg-ghost-dark/95">
          <CardHeader className="border-b border-ghost-purple/20 bg-ghost-dark/90">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-2xl font-bold text-white">
                Create New Note
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-400">
                  {wordCount} words • {charCount} characters
                </div>
                <Button 
                  onClick={handleSave} 
                  className="bg-ghost-purple hover:bg-ghost-purple/80 text-white"
                >
                  Save Note
                </Button>
              </div>
            </div>
            <Input
              type="text"
              placeholder="Enter note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold border-0 p-0 focus:ring-0 shadow-none bg-transparent text-white placeholder-gray-400"
            />
          </CardHeader>
          <CardContent className="p-0">
            <Editor
              onWordCountChange={handleWordCountChange}
              placeholder="Start writing your note..."
              showToolbar={true}
              showWordCount={false} // We're showing it in the header instead
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateNotePageNew; 