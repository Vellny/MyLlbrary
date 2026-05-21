import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  BookOpen, 
  Tag, 
  FileText, 
  Bot, 
  Feather
} from 'lucide-react';
import './CreateBook.css';

const AVAILABLE_GENRES = [
  'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Thriller', 
  'Horror', 'Adventure', 'LGBTQ+', 'Slice of Life', 
  'School Life', 'Action', 'Comedy', 'Drama'
];

const GENRE_COVERS: Record<string, string> = {
  'Fantasy': 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?auto=format&fit=crop&q=80&w=800',
  'Sci-Fi': 'https://images.unsplash.com/photo-1555679427-1f6dfcce943b?auto=format&fit=crop&q=80&w=800',
  'Horror': 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&q=80&w=800',
  'Romance': 'https://images.unsplash.com/photo-1629196914212-e56598c92a2a?auto=format&fit=crop&q=80&w=800',
  'Mystery': 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?auto=format&fit=crop&q=80&w=800',
  'LGBTQ+': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800',
  'Slice of Life': 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
  'School Life': 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800',
  'Action': 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
  'Comedy': 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&q=80&w=800',
  'Drama': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800'
};

export default function CreateBook() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Manual States
  const [title, setTitle] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverUrl, setCoverUrl] = useState('');

  // AI Generation States
  const [useAI, setUseAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
  const [showApiSettings, setShowApiSettings] = useState(false);

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  // Simulated AI Generator Wizard (Supports real Google Gemini Live API)
  const handleAIGeneration = async () => {
    if (!aiPrompt.trim()) return alert('Please enter a story prompt first!');
    setIsGenerating(true);
    setGenerationStep(1);

    // 1. If live Gemini API Key exists, perform high-fidelity LLM generation
    if (apiKey.trim()) {
      try {
        localStorage.setItem('gemini_api_key', apiKey.trim());
        
        // Advance step display during live API wait time
        setTimeout(() => setGenerationStep(2), 1200); // Character building
        setTimeout(() => setGenerationStep(3), 2800); // Prose weaving
        setTimeout(() => setGenerationStep(4), 4500); // Cover forging

        const promptText = `You are a professional co-writer for MyLibrary novel platform.
        Given the prompt: "${aiPrompt}"
        And selected target genres: ${selectedGenres.join(', ')}
        
        Generate a beautiful novel outline. You MUST respond with a single JSON object (and no other text or markdown block formatting). The JSON object must match this schema EXACTLY:
        {
          "title": "A highly creative, unique novel title derived from the prompt",
          "synopsis": "A captivating, beautiful back-cover novel synopsis of 3-4 sentences",
          "chapterContent": "An immersive, beautifully written first chapter of the story, containing at least 3-4 rich paragraphs separated by newlines."
        }`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: promptText }]
            }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const result = await response.json();
        const jsonText = result.candidates[0].content.parts[0].text;
        const parsed = JSON.parse(jsonText);

        setGenerationStep(5); // Publishing
        
        setTimeout(() => {
          finalizeAndSave(parsed.title, parsed.synopsis, parsed.chapterContent);
        }, 1200);
        
        return; // Return early on successful live API compilation
      } catch (err) {
        console.error("Gemini Live Integration Error, falling back to Local Simulation:", err);
        alert("Failed to connect to Google Gemini API (possibly invalid key, quota limit, or network issue). Running in local simulation mode instead!");
        // Continue to fallback below
      }
    }

    // 2. Local Simulation Mode (Fallback or default)
    // Extract significant keywords from the prompt k1, k2, k3
    const cleanedPrompt = aiPrompt.replace(/[^a-zA-Z\s]/g, '');
    const words = cleanedPrompt.split(/\s+/).map(w => w.toLowerCase()).filter(w => w.length > 3 && w !== 'with' && w !== 'about' && w !== 'from' && w !== 'that' && w !== 'this');
    
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    
    const k1 = words[0] ? cap(words[0]) : 'Starlight';
    const k2 = words[1] ? cap(words[1]) : 'Chronicle';
    const k3 = words[2] ? cap(words[2]) : 'Voyager';

    // Procedural Title patterns
    const titlePatterns = [
      `The Legend of the ${k1} ${k2}`,
      `Whispers of the ${k1}`,
      `The ${k1} of ${k2}`,
      `Crown of the ${k1} ${k3}`,
      `The ${k1} Protocol`,
      `Shadows of ${k2}`,
      `The Last ${k1} ${k3}`,
      `Rise of the ${k1}`
    ];
    
    // Choose pattern procedurally using length as seed
    const seed = (words.join('').length) || Date.now();
    const finalTitle = titlePatterns[seed % titlePatterns.length];

    // Procedural Synopsis patterns
    const synopsisPatterns = [
      `In a world ruled by the secrets of the ${k1}, a young explorer must embark on a perilous path. Guided only by the whispers of the ${k2}, they must face their fears before the final eclipse.`,
      `A cosmic shift has awakened the ancient power of the ${k1}. As the sovereign factions vie for control, an outcast pilot known as the ${k3} must weave through the corporate sectors to protect their family.`,
      `Bound by a secret pact, the magical disciples of the ${k2} must safeguard the sacred ruins. But when the corrupted ${k1} returns, a forbidden love threatens to break the peace treaty forever.`
    ];
    const finalSynopsis = synopsisPatterns[seed % synopsisPatterns.length] + ` (Inspired by prompt: "${aiPrompt}")`;

    const steps = [
      { step: 1, delay: 1500 }, // Brainstorming
      { step: 2, delay: 3000 }, // Character building
      { step: 3, delay: 4800 }, // Prose weaving
      { step: 4, delay: 6200 }, // Cover forging
      { step: 5, delay: 7500 }, // Publishing
    ];

    steps.forEach(({ step, delay }) => {
      setTimeout(() => {
        setGenerationStep(step);
        if (step === 5) {
          setTimeout(() => {
            finalizeAndSave(finalTitle, finalSynopsis);
          }, 1200);
        }
      }, delay);
    });
  };

  const handleManualPublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !synopsis.trim()) {
      return alert('Please fill in the title and synopsis fields.');
    }
    finalizeAndSave(title, synopsis);
  };

  const finalizeAndSave = (novelTitle: string, novelSynopsis: string, customChapterContent?: string) => {
    // Select cover image
    const primaryGenre = selectedGenres[0] || 'Fantasy';
    const coverImage = coverUrl.trim() || GENRE_COVERS[primaryGenre] || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800';

    const newBookId = Date.now().toString();

    // If AI generated chapter content, include it as chapter 1
    const hasAIChapter = !!customChapterContent;
    const chaptersList = hasAIChapter
      ? [{ id: newBookId + '_c1', title: 'Chapter 1: The Awakening Spark', date: 'Just now', read: false }]
      : [];

    const newBook = {
      id: newBookId,
      title: novelTitle,
      author: user?.name || 'Local Author',
      synopsis: novelSynopsis,
      coverImage: coverImage,
      tags: selectedGenres.length > 0 ? selectedGenres : ['Fantasy', 'Adventure'],
      stats: { reads: '0', rating: '5.0', chapters: hasAIChapter ? 1 : 0 },
      chaptersList: chaptersList
    };

    // Save to localStorage
    const saved = localStorage.getItem('user_authored_books');
    const books = saved ? JSON.parse(saved) : [];
    books.unshift(newBook);
    localStorage.setItem('user_authored_books', JSON.stringify(books));

    // Also auto-add to bookshelf so they can read immediately
    const shelfSaved = localStorage.getItem('bookshelf_books');
    const shelf = shelfSaved ? JSON.parse(shelfSaved) : [];
    if (!shelf.includes(newBookId)) {
      shelf.unshift(newBookId);
      localStorage.setItem('bookshelf_books', JSON.stringify(shelf));
    }

    // Only save chapter content if AI generated it
    if (hasAIChapter) {
      const mockChaptersKey = newBookId + '_c1';
      const readerChaptersSaved = localStorage.getItem('user_reader_chapters');
      const readerChapters = readerChaptersSaved ? JSON.parse(readerChaptersSaved) : {};
      readerChapters[mockChaptersKey] = customChapterContent;
      localStorage.setItem('user_reader_chapters', JSON.stringify(readerChapters));
    }

    setIsGenerating(false);
    // Navigate to book detail page so the author can start writing their first chapter
    navigate(`/book/${newBookId}`);
  };

  return (
    <div className="create-book-page">
      <div className="create-book-header">
        <h1 className="create-book-title text-gradient">Create New Novel</h1>
        <p className="create-book-subtitle">Share your magical world with thousands of readers around the globe.</p>
      </div>

      <div className="create-card glass-panel">
        {/* Toggle AI Mode */}
        <div className={`ai-panel ${useAI ? 'active' : ''}`}>
          <div className="ai-header">
            <div className="ai-title-wrapper">
              <Bot size={22} className="ai-spark-icon" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>AI Co-Writer Engine</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Draft your story seamlessly with AI assistance</span>
              </div>
            </div>
            <label className="ai-switch-label">
              <input 
                type="checkbox" 
                checked={useAI} 
                onChange={(e) => setUseAI(e.target.checked)} 
              />
              <span className="ai-slider"></span>
            </label>
          </div>

          {useAI && (
            <>
              <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
                <label className="form-label" style={{ color: '#c14bf3' }}>
                  <Sparkles size={16} /> Describe your story idea
                </label>
                <textarea 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ex: A fantasy story about a shadow magician who accidentally bonds with a celestial star..."
                  className="form-input ai-prompt-input"
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div className="form-group" style={{ animation: 'fadeIn 0.3s ease' }}>
                <label className="form-label">
                  📷 Custom Cover Image URL (Optional)
                </label>
                <input 
                  type="text" 
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Paste cover URL (or leave blank for procedural AI art)..." 
                  className="form-input ai-prompt-input"
                />
              </div>

              {/* Gemini API Key Settings Subpanel */}
              <div className="gemini-api-settings-panel glass-panel" style={{ marginTop: '1rem', padding: '1rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div 
                  className="api-settings-trigger" 
                  onClick={() => setShowApiSettings(!showApiSettings)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    ⚙️ Gemini API Settings
                  </span>
                  <span style={{ fontSize: '0.8rem', color: apiKey ? '#10b981' : '#a855f7', fontWeight: 700, background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {apiKey ? '🟢 Live Gemini Mode' : '🟣 Simulation Mode'}
                  </span>
                </div>

                {showApiSettings && (
                  <div className="api-settings-content" style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', animation: 'fadeIn 0.2s ease' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                      Paste your Gemini API Key here to generate <strong>real full-length chapters</strong> with Google's advanced AI models! Keys are stored securely in your browser and never sent elsewhere.
                    </p>
                    <input 
                      type="password"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        localStorage.setItem('gemini_api_key', e.target.value);
                      }}
                      placeholder="Paste Gemini API Key (AIzaSy...)"
                      className="form-input"
                      style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem', background: 'rgba(0,0,0,0.2)' }}
                    />
                    {apiKey && (
                      <button 
                        onClick={() => {
                          setApiKey('');
                          localStorage.removeItem('gemini_api_key');
                        }}
                        className="setting-btn"
                        style={{ alignSelf: 'flex-start', fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Clear Saved Key
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <form onSubmit={handleManualPublish} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Manual Entry Form - Disabled/Pre-filled if AI is chosen */}
          {!useAI && (
            <>
              <div className="form-group">
                <label className="form-label">
                  <BookOpen size={16} /> Novel Title
                </label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="The Chronicles of Oakhaven..." 
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <FileText size={16} /> Synopsis
                </label>
                <textarea 
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  placeholder="Detail the adventures, characters, and conflicts..." 
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  📷 Custom Cover Image URL (Optional)
                </label>
                <input 
                  type="text" 
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image URL" 
                  className="form-input"
                />
              </div>
            </>
          )}

          {/* Genre Multi-Select */}
          <div className="form-group">
            <label className="form-label">
              <Tag size={16} /> Target Genres
            </label>
            <div className="genre-tags-grid">
              {AVAILABLE_GENRES.map(genre => (
                <span 
                  key={genre} 
                  onClick={() => toggleGenre(genre)}
                  className={`genre-tag-pill ${selectedGenres.includes(genre) ? 'active' : ''}`}
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          {useAI ? (
            <button 
              type="button" 
              onClick={handleAIGeneration}
              className="publish-btn ai"
            >
              <Sparkles size={20} />
              Generate Novel with AI Co-Writer
            </button>
          ) : (
            <button 
              type="submit" 
              className="publish-btn manual"
            >
              <Feather size={20} />
              Publish Novel Manually
            </button>
          )}
        </form>
      </div>

      {/* AI Simulation Generation Modal */}
      {isGenerating && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-card glass-panel">
            <div className="ai-modal-icon-wrapper">
              <div className="ai-glow-ring"></div>
              <Bot size={36} style={{ color: 'var(--accent-color)' }} />
            </div>

            <div>
              <h2 className="ai-modal-title text-gradient">AI Spark Crafting...</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>Forging neural narrative paths</p>
            </div>

            <div className="ai-steps-container">
              <div className={`ai-step-row ${generationStep === 1 ? 'active' : ''} ${generationStep > 1 ? 'completed' : ''}`}>
                <div className="ai-step-bullet"></div>
                <span>Brainstorming cosmic story arcs... 🧠</span>
              </div>
              <div className={`ai-step-row ${generationStep === 2 ? 'active' : ''} ${generationStep > 2 ? 'completed' : ''}`}>
                <div className="ai-step-bullet"></div>
                <span>Structuring complex character profiles... 👥</span>
              </div>
              <div className={`ai-step-row ${generationStep === 3 ? 'active' : ''} ${generationStep > 3 ? 'completed' : ''}`}>
                <div className="ai-step-bullet"></div>
                <span>Weaving AI narrative prose... ✍️</span>
              </div>
              <div className={`ai-step-row ${generationStep === 4 ? 'active' : ''} ${generationStep > 4 ? 'completed' : ''}`}>
                <div className="ai-step-bullet"></div>
                <span>Forging cover art with neural brush... 🎨</span>
              </div>
              <div className={`ai-step-row ${generationStep === 5 ? 'active' : ''} ${generationStep > 5 ? 'completed' : ''}`}>
                <div className="ai-step-bullet"></div>
                <span>Publishing Novel to the Web! 🚀</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
