'use client';

import React, { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { extractTextFromPDF } from '../../../utils/parsePDF';
import { extractDetailsWithGrok } from '../../../utils/extractDetailswithGrok';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Define TypeScript interfaces for our data structures
interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location?: string;
  education: string[];
  skills: string[];
  experience: Array<{
    company?: string;
    title?: string;
    dates?: string;
    description?: string;
  } | string>;
  certifications?: string[];
}

interface CareerPath {
  title: string;
  description: string;
  requiredSkills: string[];
  missingSkills: string[];
  roadmap: Array<{
    step: string;
    description: string;
  }>;
}

interface CareerAnalysis {
  careerPaths: CareerPath[];
}

interface ImprovementScores {
  content: number;
  format: number;
  impact: number;
  atsCompatibility: number;
}

interface ImprovementSuggestions {
  overallAssessment: string;
  contentImprovements: string[];
  formatImprovements: string[];
  scores: ImprovementScores;
}

interface SkillChartData {
  skill: string;
  current: number;
  required: number;
  missing: number;
}

const ResumeUpload: React.FC = () => {
  const { currentUser } = getAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null);
  const [selectedCareerPath, setSelectedCareerPath] = useState(0);
  const [activeTab, setActiveTab] = useState('resume'); // 'resume', 'career', 'improvements'
  const [skillsData, setSkillsData] = useState<SkillChartData[]>([]);
  const [improvementSuggestions, setImprovementSuggestions] = useState<ImprovementSuggestions | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    console.log("Selected File:", selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a PDF resume.');
      return;
    }

    if (!currentUser) {
      setMessage('❌ You must be signed in to upload.');
      return;
    }

    if (file.type !== 'application/pdf') {
      setMessage('❌ Please upload a PDF file.');
      return;
    }

    setUploading(true);
    setMessage('Processing your resume...');
    setError(null);
    setResumeData(null);
    setCareerAnalysis(null);
    setImprovementSuggestions(null);

    try {
      // Test Groq API connectivity first
      setMessage('Testing Groq API connection...');

      try {
        const testRes = await fetch('/api/grok-extract', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ resumeText: 'Test resume text' }),
        });

        if (!testRes.ok) {
          const errorData = await testRes.json();
          throw new Error(`API connection test failed: ${testRes.status}`);
        }

        setMessage('API connection successful. Extracting text from PDF...');
      } catch (e: any) {
        setError(`Groq API connectivity issue: ${e.message}`);
        setUploading(false);
        return;
      }

      // Extract text from PDF
      let extractedText;
      try {
        extractedText = await extractTextFromPDF(file);
        console.log("Extracted text from PDF:", extractedText.substring(0, 100) + '...');
      } catch (pdfError: any) {
        setError(`PDF Text Extraction Error: ${pdfError.message}`);
        setUploading(false);
        return;
      }

      // Parse resume data and get career analysis with Groq
      setMessage('Analyzing resume with AI...');
      try {
        const groqResult = await extractDetailsWithGrok(extractedText);

        // Set state with results
        setResumeData(groqResult.parsed);
        setCareerAnalysis(groqResult.careerAnalysis);
        setImprovementSuggestions(groqResult.improvementSuggestions);

        // Prepare data for skills chart
        if (groqResult.parsed.skills && groqResult.careerAnalysis.careerPaths) {
          const skillsChartData = prepareSkillsChartData(
            groqResult.parsed.skills,
            groqResult.careerAnalysis.careerPaths[0].requiredSkills,
            groqResult.careerAnalysis.careerPaths[0].missingSkills
          );
          setSkillsData(skillsChartData);
        }

        // Save to Firestore
        await setDoc(doc(db, 'users', currentUser.uid), {
          email: currentUser.email,
          parsedText: extractedText,
          resumeData: groqResult.parsed,
          careerAnalysis: groqResult.careerAnalysis,
          improvementSuggestions: groqResult.improvementSuggestions,
          uploadedAt: new Date(),
        });

        setMessage('✅ Resume analyzed successfully!');
        setActiveTab('resume');
      } catch (groqError: any) {
        setError(`Groq Analysis Error: ${groqError.message}`);
        setUploading(false);
        return;
      }
    } catch (err: any) {
      console.error(err);
      setError(`Error: ${err.message}`);
    }

    setUploading(false);
  };

  const prepareSkillsChartData = (
    currentSkills: string[], 
    requiredSkills: string[], 
    missingSkills: string[]
  ): SkillChartData[] => {
    // Create radar chart data for skills comparison
    const allSkills = [...new Set([...currentSkills, ...requiredSkills])];

    return allSkills.map(skill => {
      const hasSkill = currentSkills.includes(skill);
      const isRequired = requiredSkills.includes(skill);
      const isMissing = missingSkills.includes(skill);

      return {
        skill,
        current: hasSkill ? 100 : 0,
        required: isRequired ? 100 : 0,
        missing: isMissing ? 100 : 0,
      };
    });
  };

  const updateSkillsData = (careerPathIndex: number) => {
    if (!careerAnalysis?.careerPaths || !resumeData?.skills) return;

    const skillsChartData = prepareSkillsChartData(
      resumeData.skills || [],
      careerAnalysis.careerPaths[careerPathIndex]?.requiredSkills || [],
      careerAnalysis.careerPaths[careerPathIndex]?.missingSkills || []
    );

    setSkillsData(skillsChartData);
  };

  const handleCareerPathSelect = (index: number) => {
    setSelectedCareerPath(index);
    updateSkillsData(index);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">
            Resume Analysis & Career Path Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="flex-grow border-b border-gray-300"></div>
            <span className="px-4 text-gray-500 font-medium">Upload Your Resume</span>
            <div className="flex-grow border-b border-gray-300"></div>
          </div>

          <div className="bg-muted/40 p-6 rounded-xl">
            <div className="mb-4">
              <label htmlFor="resumeUpload" className="block text-sm font-medium mb-2">
                Upload your resume (PDF format)
              </label>
              <div className="flex items-center">
                <input
                  id="resumeUpload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary/10 file:text-primary
                    hover:file:bg-primary/20"
                />
              </div>
            </div>

            <Button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full"
              size="lg"
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Analyze Resume & Generate Career Paths'
              )}
            </Button>

            {message && !error && (
              <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
            )}

            {error && (
              <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded">
                <p className="font-bold">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {resumeData && (
        <Card>
          <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="resume" className="flex-1">Resume Details</TabsTrigger>
              <TabsTrigger value="career" className="flex-1">Career Paths</TabsTrigger>
              <TabsTrigger value="improvements" className="flex-1">Resume Improvements</TabsTrigger>
            </TabsList>
            
            <CardContent className="pt-6">
              <TabsContent value="resume">
                <h2 className="text-xl font-bold mb-6">Your Resume Details</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><span className="font-medium">Name:</span> {resumeData.name}</p>
                      <p><span className="font-medium">Email:</span> {resumeData.email}</p>
                      <p><span className="font-medium">Phone:</span> {resumeData.phone}</p>
                      {resumeData.location && (
                        <p><span className="font-medium">Location:</span> {resumeData.location}</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {resumeData.education?.map((edu, index) => (
                          <li key={index}>{edu}</li>
                        )) || <li>No education data found</li>}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      )) || <p>No skills data found</p>}
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg text-primary">Experience</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {resumeData.experience?.map((exp, index) => (
                        <li key={index} className="border-l-4 border-primary/20 pl-4">
                          {typeof exp === 'string' ? (
                            exp
                          ) : (
                            <div>
                              <p className="font-semibold">{exp.title} {exp.company && `at ${exp.company}`}</p>
                              {exp.dates && <p className="text-sm text-muted-foreground">{exp.dates}</p>}
                              {exp.description && <p>{exp.description}</p>}
                            </div>
                          )}
                        </li>
                      )) || <li>No experience data found</li>}
                    </ul>
                  </CardContent>
                </Card>

                {resumeData.certifications && resumeData.certifications.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg text-primary">Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-5 space-y-2">
                        {resumeData.certifications.map((cert, index) => (
                          <li key={index}>{cert}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="career">
                {careerAnalysis && careerAnalysis.careerPaths ? (
                  <>
                    <h2 className="text-xl font-bold mb-6">Career Path Analysis</h2>
                    
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {careerAnalysis.careerPaths.map((path, index) => (
                          <Button 
                            key={index}
                            variant={selectedCareerPath === index ? "default" : "outline"}
                            onClick={() => handleCareerPathSelect(index)}
                          >
                            {path.title}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">
                          {careerAnalysis.careerPaths[selectedCareerPath]?.title || "Career Path"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="mb-6 text-muted-foreground">
                          {careerAnalysis.careerPaths[selectedCareerPath]?.description || "No description available"}
                        </p>

                        <div className="mb-8">
                          <h4 className="font-bold mb-4">Skills Analysis</h4>

                          <div className="h-96 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <RadarChart outerRadius={150} width={500} height={300} data={skillsData}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="skill" />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                <Radar name="Current Skills" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                <Radar name="Required Skills" dataKey="required" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                <Legend />
                                <Tooltip />
                              </RadarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-bold mb-3 text-destructive">Missing Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {careerAnalysis.careerPaths[selectedCareerPath]?.missingSkills?.map((skill, index) => (
                              <Badge key={index} variant="destructive">
                                {skill}
                              </Badge>
                            )) || <p>No missing skills data</p>}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-bold mb-3 text-green-700">Skill Development Roadmap</h4>
                          <div className="space-y-4">
                            {careerAnalysis.careerPaths[selectedCareerPath]?.roadmap?.map((step, index) => (
                              <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                                <h5 className="font-bold">{step.step}</h5>
                                <p className="text-muted-foreground">{step.description}</p>
                              </div>
                            )) || <p>No roadmap data available</p>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="improvements">
                {improvementSuggestions ? (
                  <>
                    <h2 className="text-xl font-bold mb-6">Resume Improvement Suggestions</h2>

                    <Card className="mb-6 border-green-200 bg-green-50">
                      <CardHeader>
                        <CardTitle className="text-lg text-green-700">Overall Assessment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{improvementSuggestions.overallAssessment}</p>
                      </CardContent>
                    </Card>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Content Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {improvementSuggestions.contentImprovements?.map((item, index) => (
                            <li key={index} className="flex">
                              <span className="text-primary mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          )) || <li>No content improvement suggestions</li>}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="mb-6">
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Format Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {improvementSuggestions.formatImprovements?.map((item, index) => (
                            <li key={index} className="flex">
                              <span className="text-primary mr-2">•</span>
                              <span>{item}</span>
                            </li>
                          )) || <li>No format improvement suggestions</li>}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg text-primary">Effectiveness Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              width={500}
                              height={300}
                              data={[
                                { category: 'Content', score: improvementSuggestions.scores?.content || 0 },
                                { category: 'Format', score: improvementSuggestions.scores?.format || 0 },
                                { category: 'Impact', score: improvementSuggestions.scores?.impact || 0 },
                                { category: 'ATS Compatibility', score: improvementSuggestions.scores?.atsCompatibility || 0 },
                              ]}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="category" />
                              <YAxis domain={[0, 10]} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="score" fill="#8884d8" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
};

export default ResumeUpload;
