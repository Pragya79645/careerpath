'use client';

import { useState, useRef, useEffect, SetStateAction } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowDownCircle, Share2, BookOpen, Clock, Search, Download, ChevronRight } from "lucide-react";

export default function TargetCompanyRoadmap() {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const roadmapRef = useRef<HTMLDivElement>(null);
  const [estimatedReadTime, setEstimatedReadTime] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Calculate reading time when roadmap changes
  useEffect(() => {
    if (roadmap) {
      // Average reading speed: 200 words per minute
      const words = roadmap.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / 200);
      setEstimatedReadTime(`${minutes} min read`);
    }
  }, [roadmap]);

  const handleSubmit = async () => {
    if (!company || !role) {
      return alert('Please fill in all fields');
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/company-roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to generate roadmap');
      }

      const data = await res.json();
      setRoadmap(data.roadmap);
      
      // Set the first section as active by default
      const firstSectionMatch = data.roadmap.match(/## \d+\.\s*(.*)/);
      if (firstSectionMatch && firstSectionMatch[1]) {
        setActiveSection(firstSectionMatch[1].trim());
      }
      
      // Scroll to results
      setTimeout(() => {
        if (roadmapRef.current) {
          roadmapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    } catch (error) {
      console.error('Error details:', error);
      setError('Sorry, we could not generate a roadmap. Please check your internet connection and try again later.');
      setRoadmap('');
    } finally {
      setLoading(false);
    }
  };

  // Extract table of contents from the markdown
  const tableOfContents = roadmap
    ? roadmap
        .split('\n')
        .filter(line => line.match(/^## \d+\./))
        .map(line => {
          const match = line.match(/## \d+\.\s*(.*)/);
          return match ? match[1].trim() : '';
        })
    : [];

  const scrollToSection = (section: string | null) => {
      setActiveSection(section);
    if (typeof section === 'string') {
      const element = document.getElementById(section.replace(/\s+/g, '-').toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // Ensure the section exists before scrolling
    if (typeof section === 'string') {
      const element = document.getElementById(section.replace(/\s+/g, '-').toLowerCase());
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

 

 

  // Custom renderer for ReactMarkdown
  const customRenderers = {
    h2: (({ children }: { children: React.ReactNode }) => {
      const text = children ? children.toString() : '';
      const match = text.match(/\d+\.\s*(.*)/);
      const sectionTitle = match ? match[1] : text;
      const id = sectionTitle.replace(/\s+/g, '-').toLowerCase();
      
      return (
        <h2 
          id={id} 
          className="text-2xl font-bold text-violet-800 mt-10 mb-6 pb-3 border-b border-violet-100"
        >
          {text}
        </h2>
      );
    }) as React.FC,
    ul: (({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc ml-6 my-5 space-y-3">
        {children}
      </ul>
    )) as React.FC,
    li: (({ children }: { children: React.ReactNode }) => (
      <li className="text-gray-700">{children}</li>
    )) as React.FC,
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10 bg-gray-50 min-h-screen">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
          Target Your Dream Company
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Get a personalized roadmap with actionable steps to land your ideal role
        </p>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label htmlFor="company" className="block text-lg font-medium text-gray-700  items-center">
              <Search className="h-5 w-5 mr-2 text-violet-500" />
              Target Company
            </label>
            <input
              id="company"
              className="w-full p-4 text-lg border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
              placeholder="e.g., Google, Microsoft, Amazon"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="role" className="block text-lg font-medium text-gray-700  items-center">
              <BookOpen className="h-5 w-5 mr-2 text-violet-500" />
              Target Role
            </label>
            <input
              id="role"
              className="w-full p-4 text-lg border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
              placeholder="e.g., Software Engineer, Product Manager"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !company.trim() || !role.trim()}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-lg font-medium py-4 px-6 rounded-xl transition duration-300 shadow-lg shadow-violet-200 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Your Personalized Roadmap...
            </>
          ) : (
            <>
              <ArrowDownCircle className="mr-2 h-5 w-5" />
              Generate Career Roadmap
            </>
          )}
        </button>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg text-red-700">
            <p>{error}</p>
          </div>
        )}
      </div>

      {roadmap && (
        <div ref={roadmapRef} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              {role} at {company}: Career Roadmap
            </h2>
            <div className="flex items-center text-white/80 text-sm mt-3 space-x-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{estimatedReadTime}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>{tableOfContents.length} sections</span>
              </div>
            </div>
            
            <div className="flex mt-4 space-x-3">
             
              <button 
                onClick={toggleSidebar} 
                className="md:hidden bg-white/20 hover:bg-white/30 text-white rounded-lg py-1.5 px-3 text-sm flex items-center transition-colors"
              >
                <ChevronRight className={`h-4 w-4 mr-1.5 transition-transform ${sidebarOpen ? 'rotate-90' : ''}`} />
                {sidebarOpen ? 'Hide' : 'Show'} Sections
              </button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row">
            {/* Table of Contents Sidebar - Hidden on mobile unless toggled */}
            <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:w-72 bg-violet-50 p-5 md:p-6 lg:p-8 md:shrink-0 border-r border-violet-100`}>
              <h3 className="font-semibold text-violet-800 mb-4 text-lg">Contents</h3>
              <nav className="space-y-2">
                {tableOfContents.map((section, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSection(section)}
                    className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all ${
                      activeSection === section
                        ? 'bg-violet-100 text-violet-800 font-medium shadow-sm'
                        : 'text-gray-600 hover:bg-violet-50 hover:text-violet-800'
                    }`}
                  >
                    <span className="inline-flex h-6 w-6 bg-violet-200 rounded-2xl text-violet-800 text-xs font-semibold items-center justify-center ">
                      {index + 1}
                    </span>
                    {section}
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 p-6 lg:p-8 overflow-auto">
              <div className="prose prose-violet prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-headings:text-violet-900 prose-a:text-violet-600 max-w-none">
                <ReactMarkdown components={customRenderers}>{roadmap}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}