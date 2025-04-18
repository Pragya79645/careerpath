"use client"
import type React from "react"
import { useState } from "react"
import { getAuth } from "firebase/auth"
import { doc, setDoc, getFirestore } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { extractTextFromPDF } from "../../../utils/parsePDF"
import { extractDetailsWithGrok } from "../../../utils/extractDetailswithGrok"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Briefcase,
  Award,
  BookOpen,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

// Define TypeScript interfaces for our data structures
interface ResumeData {
  name: string
  email: string
  phone: string
  location?: string
  education: string[]
  skills: string[]
  experience: Array<
    | {
        company?: string
        title?: string
        dates?: string
        description?: string
      }
    | string
  >
  certifications?: string[]
}

interface CareerPath {
  title: string
  description: string
  requiredSkills: string[]
  missingSkills: string[]
  roadmap: Array<{
    step: string
    description: string
  }>
}

interface CareerAnalysis {
  careerPaths: CareerPath[]
}

interface ImprovementScores {
  content: number
  format: number
  impact: number
  atsCompatibility: number
}

interface ImprovementSuggestions {
  overallAssessment: string
  contentImprovements: string[]
  formatImprovements: string[]
  scores: ImprovementScores
}

interface SkillChartData {
  skill: string
  current: number
  required: number
  missing: number
}

const ResumeUpload: React.FC = () => {
  const { currentUser } = getAuth()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [resumeData, setResumeData] = useState<ResumeData | null>(null)
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysis | null>(null)
  const [selectedCareerPath, setSelectedCareerPath] = useState(0)
  const [activeTab, setActiveTab] = useState("resume") // 'resume', 'career', 'improvements'
  const [skillsData, setSkillsData] = useState<SkillChartData[]>([])
  const [improvementSuggestions, setImprovementSuggestions] = useState<ImprovementSuggestions | null>(null)
  const [processingStage, setProcessingStage] = useState<number>(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    console.log("Selected File:", selectedFile)
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage("❌ Please select a PDF resume.")
      return
    }

    if (!currentUser) {
      setMessage("❌ You must be signed in to upload.")
      return
    }

    if (file.type !== "application/pdf") {
      setMessage("❌ Please upload a PDF file.")
      return
    }

    setUploading(true)
    setMessage("Processing your resume...")
    setError(null)
    setResumeData(null)
    setCareerAnalysis(null)
    setImprovementSuggestions(null)
    setProcessingStage(1)

    try {
      // Test Groq API connectivity first
      setMessage("Testing Groq API connection...")

      try {
        const testRes = await fetch("/api/grok-extract", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resumeText: "Test resume text" }),
        })

        if (!testRes.ok) {
          const errorData = await testRes.json()
          throw new Error(`API connection test failed: ${testRes.status}`)
        }

        setMessage("API connection successful. Extracting text from PDF...")
        setProcessingStage(2)
      } catch (e: any) {
        setError(`Groq API connectivity issue: ${e.message}`)
        setUploading(false)
        return
      }

      // Extract text from PDF
      let extractedText
      try {
        extractedText = await extractTextFromPDF(file)
        console.log("Extracted text from PDF:", extractedText.substring(0, 100) + "...")
        setProcessingStage(3)
      } catch (pdfError: any) {
        setError(`PDF Text Extraction Error: ${pdfError.message}`)
        setUploading(false)
        return
      }

      // Parse resume data and get career analysis with Groq
      setMessage("Analyzing resume with AI...")
      try {
        const groqResult = await extractDetailsWithGrok(extractedText)
        setProcessingStage(4)

        // Set state with results
        setResumeData(groqResult.parsed)
        setCareerAnalysis(groqResult.careerAnalysis)
        setImprovementSuggestions(groqResult.improvementSuggestions)

        // Prepare data for skills chart
        if (groqResult.parsed.skills && groqResult.careerAnalysis.careerPaths) {
          const skillsChartData = prepareSkillsChartData(
            groqResult.parsed.skills,
            groqResult.careerAnalysis.careerPaths[0].requiredSkills,
            groqResult.careerAnalysis.careerPaths[0].missingSkills,
          )
          setSkillsData(skillsChartData)
        }

        // Save to Firestore
        try {
          // Ensure db is properly initialized
          const firestore = db || getFirestore()

          await setDoc(doc(firestore, "users", currentUser.uid), {
            email: currentUser.email,
            parsedText: extractedText,
            resumeData: groqResult.parsed,
            careerAnalysis: groqResult.careerAnalysis,
            improvementSuggestions: groqResult.improvementSuggestions,
            uploadedAt: new Date(),
          })
          console.log("Successfully saved to Firestore")
        } catch (firestoreError) {
          console.error("Firestore save error:", firestoreError)
          // Continue with the process even if Firestore save fails
          // This prevents the analysis from failing if only the save fails
        }

        setMessage("✅ Resume analyzed successfully!")
        setActiveTab("resume")
        setProcessingStage(5)
      } catch (groqError: any) {
        setError(`Groq Analysis Error: ${groqError.message}`)
        setUploading(false)
        return
      }
    } catch (err: any) {
      console.error(err)
      setError(`Error: ${err.message}`)
    }

    setUploading(false)
  }

  const prepareSkillsChartData = (
    currentSkills: string[],
    requiredSkills: string[],
    missingSkills: string[],
  ): SkillChartData[] => {
    // Create radar chart data for skills comparison
    const allSkills = [...new Set([...currentSkills, ...requiredSkills])]

    return allSkills.map((skill) => {
      const hasSkill = currentSkills.includes(skill)
      const isRequired = requiredSkills.includes(skill)
      const isMissing = missingSkills.includes(skill)

      return {
        skill,
        current: hasSkill ? 100 : 0,
        required: isRequired ? 100 : 0,
        missing: isMissing ? 100 : 0,
      }
    })
  }

  const updateSkillsData = (careerPathIndex: number) => {
    if (!careerAnalysis?.careerPaths || !resumeData?.skills) return

    const skillsChartData = prepareSkillsChartData(
      resumeData.skills || [],
      careerAnalysis.careerPaths[careerPathIndex]?.requiredSkills || [],
      careerAnalysis.careerPaths[careerPathIndex]?.missingSkills || [],
    )

    setSkillsData(skillsChartData)
  }

  const handleCareerPathSelect = (index: number) => {
    setSelectedCareerPath(index)
    updateSkillsData(index)
  }

  const getProcessingStageText = () => {
    switch (processingStage) {
      case 1:
        return "Connecting to AI service..."
      case 2:
        return "Extracting text from PDF..."
      case 3:
        return "Analyzing resume content..."
      case 4:
        return "Generating career insights..."
      case 5:
        return "Analysis complete!"
      default:
        return "Preparing..."
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-700">
              Resume Analyzer & Career Compass
            </CardTitle>
            <CardDescription className="text-center text-base max-w-xl mx-auto mt-2">
              Upload your resume to get AI-powered insights, career path recommendations, and improvement suggestions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center">
              <motion.div
                className="w-full max-w-md mx-auto p-8 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mb-6 text-center">
                  <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold">Upload Your Resume</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">PDF format recommended</p>
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="resumeUpload"
                    className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl border-slate-300 dark:border-slate-700 hover:border-violet-400 dark:hover:border-violet-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FileText className="w-10 h-10 mb-3 text-slate-400" />
                      <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">PDF (MAX. 10MB)</p>
                    </div>
                    <input id="resumeUpload" type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                  </label>
                  {file && (
                    <div className="mt-3 flex items-center p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      <span className="text-sm font-medium truncate">{file.name}</span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleUpload}
                  disabled={uploading || !file}
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all duration-300"
                  size="lg"
                >
                  {uploading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      Analyze Resume
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                  <span
                    className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-300 ease-in-out"
                    style={{ width: uploading ? `${processingStage * 20}%` : "0%" }}
                  ></span>
                </Button>

                {uploading && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
                      <span>{getProcessingStageText()}</span>
                      <span>{processingStage * 20}%</span>
                    </div>
                    <Progress value={processingStage * 20} className="h-1.5" />
                  </div>
                )}

                {message && !error && !uploading && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg text-sm flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <p>{message}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Error</p>
                      <p>{error}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {resumeData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg overflow-hidden bg-white dark:bg-slate-900">
            <Tabs defaultValue="resume" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-slate-200 dark:border-slate-800">
                <TabsList className="w-full h-16 bg-transparent p-0 rounded-none">
                  <TabsTrigger
                    value="resume"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Resume Details</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="career"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Career Paths</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger
                    value="improvements"
                    className="flex-1 h-full data-[state=active]:border-b-2 data-[state=active]:border-violet-500 data-[state=active]:text-violet-700 dark:data-[state=active]:text-violet-400 rounded-none"
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Award className="w-4 h-4" />
                      <span>Improvements</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>

              <CardContent className="p-6 md:p-8">
                <TabsContent value="resume" className="mt-0">
                  <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card className="h-full bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30 border-0 shadow-md overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-violet-700 dark:text-violet-400 flex items-center">
                              <User className="w-5 h-5 mr-2" />
                              Contact Information
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center">
                              <User className="w-4 h-4 mr-3 text-slate-400" />
                              <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Name</p>
                                <p className="font-medium">{resumeData.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Mail className="w-4 h-4 mr-3 text-slate-400" />
                              <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                                <p className="font-medium">{resumeData.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-3 text-slate-400" />
                              <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                                <p className="font-medium">{resumeData.phone}</p>
                              </div>
                            </div>
                            {resumeData.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-3 text-slate-400" />
                                <div>
                                  <p className="text-sm text-slate-500 dark:text-slate-400">Location</p>
                                  <p className="font-medium">{resumeData.location}</p>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                      >
                        <Card className="h-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-0 shadow-md overflow-hidden">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-blue-700 dark:text-blue-400 flex items-center">
                              <BookOpen className="w-5 h-5 mr-2" />
                              Education
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-3">
                              {resumeData.education?.map((edu, index) => (
                                <motion.li
                                  key={index}
                                  className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                >
                                  {edu}
                                </motion.li>
                              )) || <li>No education data found</li>}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400 flex items-center">
                            <Award className="w-5 h-5 mr-2" />
                            Skills
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {resumeData.skills?.map((skill, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors px-3 py-1 text-sm"
                                >
                                  {skill}
                                </Badge>
                              </motion.div>
                            )) || <p>No skills data found</p>}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-amber-700 dark:text-amber-400 flex items-center">
                            <Briefcase className="w-5 h-5 mr-2" />
                            Experience
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-4">
                            {resumeData.experience?.map((exp, index) => (
                              <motion.li
                                key={index}
                                className="p-4 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                              >
                                {typeof exp === "string" ? (
                                  exp
                                ) : (
                                  <div>
                                    <p className="font-semibold text-amber-800 dark:text-amber-300">
                                      {exp.title} {exp.company && `at ${exp.company}`}
                                    </p>
                                    {exp.dates && (
                                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{exp.dates}</p>
                                    )}
                                    {exp.description && (
                                      <p className="mt-2 text-slate-700 dark:text-slate-300">{exp.description}</p>
                                    )}
                                  </div>
                                )}
                              </motion.li>
                            )) || <li>No experience data found</li>}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {resumeData.certifications && resumeData.certifications.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                      >
                        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-indigo-700 dark:text-indigo-400 flex items-center">
                              <Award className="w-5 h-5 mr-2" />
                              Certifications
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {resumeData.certifications.map((cert, index) => (
                                <motion.li
                                  key={index}
                                  className="p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                >
                                  {cert}
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="career" className="mt-0">
                  {careerAnalysis && careerAnalysis.careerPaths ? (
                    <div className="space-y-8">
                      <div className="flex flex-wrap gap-3 mb-4">
                        {careerAnalysis.careerPaths.map((path, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleCareerPathSelect(index)}
                            className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                              selectedCareerPath === index
                                ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
                                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                            }`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                          >
                            {path.title}
                          </motion.button>
                        ))}
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="space-y-8"
                      >
                        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-xl text-violet-700 dark:text-violet-400">
                              {careerAnalysis.careerPaths[selectedCareerPath]?.title || "Career Path"}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="mb-6 text-slate-700 dark:text-slate-300 leading-relaxed">
                              {careerAnalysis.careerPaths[selectedCareerPath]?.description ||
                                "No description available"}
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-slate-900">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                              Skills Analysis
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-96 w-full p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <RadarChart outerRadius={150} width={500} height={300} data={skillsData}>
                                  <PolarGrid strokeOpacity={0.2} />
                                  <PolarAngleAxis dataKey="skill" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#94a3b8" }} />
                                  <Radar
                                    name="Current Skills"
                                    dataKey="current"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.6}
                                  />
                                  <Radar
                                    name="Required Skills"
                                    dataKey="required"
                                    stroke="#10b981"
                                    fill="#10b981"
                                    fillOpacity={0.6}
                                  />
                                  <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                      paddingTop: "20px",
                                      fontSize: "14px",
                                    }}
                                  />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                                      borderRadius: "8px",
                                      border: "none",
                                      boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                    }}
                                  />
                                </RadarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-red-200 to-red-500 dark:from-red-950/30 dark:to-pink-950/30">
                          <CardHeader className="pb-2">
                            <CardTitle className=" text-red-800 dark:text-red-400 font-bold text-2xl">Missing Skills</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-4">
                              {careerAnalysis.careerPaths[selectedCareerPath]?.missingSkills?.map((skill, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 0.1 + index * 0.03 }}
                                >
                                  <Badge variant="destructive" className="px-3 py-1 text-sm">
                                    {skill}
                                  </Badge>
                                </motion.div>
                              )) || <p>No missing skills data</p>}
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
                          <CardHeader className="pb-2">
                            <CardTitle className=" text-emerald-700 dark:text-emerald-400 text-2xl font-bold">
                              Skill Development Roadmap
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {careerAnalysis.careerPaths[selectedCareerPath]?.roadmap?.map((step, index) => (
                                <motion.div
                                  key={index}
                                  className="relative pl-6 pb-6 last:pb-0"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                                >
                                  <div className="absolute top-0 left-0 h-full w-0.5 bg-emerald-200 dark:bg-emerald-800"></div>
                                  <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-emerald-500 -translate-x-1/2 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{index + 1}</span>
                                  </div>
                                  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-lg shadow-sm">
                                    <h5 className="font-bold text-emerald-700 dark:text-emerald-400">{step.step}</h5>
                                    <p className="text-slate-700 dark:text-slate-300 mt-2">{step.description}</p>
                                  </div>
                                </motion.div>
                              )) || <p>No roadmap data available</p>}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-64 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="improvements" className="mt-0">
                  {improvementSuggestions ? (
                    <div className="space-y-8">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-green-700 dark:text-green-400">
                              Overall Assessment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {improvementSuggestions.overallAssessment}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                        >
                          <Card className="h-full border-0 shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg text-blue-700 dark:text-blue-400">
                                Content Improvement
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                {improvementSuggestions.contentImprovements?.map((item, index) => (
                                  <motion.li
                                    key={index}
                                    className="flex p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                  >
                                    <span className="text-blue-500 mr-2 font-bold">•</span>
                                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                  </motion.li>
                                )) || <li>No content improvement suggestions</li>}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                        >
                          <Card className="h-full border-0 shadow-md overflow-hidden bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-lg text-purple-700 dark:text-purple-400">
                                Format Improvement
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="space-y-3">
                                {improvementSuggestions.formatImprovements?.map((item, index) => (
                                  <motion.li
                                    key={index}
                                    className="flex p-3 rounded-lg bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shadow-sm"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                  >
                                    <span className="text-purple-500 mr-2 font-bold">•</span>
                                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                                  </motion.li>
                                )) || <li>No format improvement suggestions</li>}
                              </ul>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                      >
                        <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-slate-900">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg text-slate-800 dark:text-slate-200">
                              Effectiveness Score
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="h-64 w-full p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                  width={500}
                                  height={300}
                                  data={[
                                    { category: "Content", score: improvementSuggestions.scores?.content || 0 },
                                    { category: "Format", score: improvementSuggestions.scores?.format || 0 },
                                    { category: "Impact", score: improvementSuggestions.scores?.impact || 0 },
                                    {
                                      category: "ATS Compatibility",
                                      score: improvementSuggestions.scores?.atsCompatibility || 0,
                                    },
                                  ]}
                                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                                  <XAxis dataKey="category" tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                  <YAxis domain={[0, 10]} tick={{ fill: "#94a3b8", fontSize: 12 }} />
                                  <Tooltip
                                    contentStyle={{
                                      backgroundColor: "rgba(255, 255, 255, 0.9)",
                                      borderRadius: "8px",
                                      border: "none",
                                      boxShadow:
                                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                                    }}
                                  />
                                  <Legend
                                    iconType="circle"
                                    wrapperStyle={{
                                      paddingTop: "20px",
                                      fontSize: "14px",
                                    }}
                                  />
                                  <Bar dataKey="score" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} barSize={40}>
                                    <defs>
                                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={1} />
                                      </linearGradient>
                                    </defs>
                                  </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="space-y-6">
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
        </motion.div>
      )}
    </div>
  )
}

export default ResumeUpload
