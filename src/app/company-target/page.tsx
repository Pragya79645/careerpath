"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  Building,
  CheckCircle,
  AlertTriangle,
  Code,
  Users,
  MessageSquare,
  BookOpen,
  Briefcase,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react"

export default function CompanyTargetPage() {
  const [companyName, setCompanyName] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [activeTab, setActiveTab] = useState("skills")

  const handleSearch = () => {
    if (!companyName) return

    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
      setShowResults(true)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Target a Company</h1>
        <p className="text-muted-foreground mb-8">
          Enter the company you wish to target and we'll generate a personalized roadmap to help you get hired
        </p>

        <Card className="border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter company name (e.g., Google, Microsoft, etc.)"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="pl-10 border-purple-500/20"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={isSearching || !companyName}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
              >
                {isSearching ? "Searching..." : "Get Me Into This Company"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Badge
                variant="outline"
                className="cursor-pointer bg-purple-500/5 hover:bg-purple-500/10"
                onClick={() => setCompanyName("Google")}
              >
                Google
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer bg-purple-500/5 hover:bg-purple-500/10"
                onClick={() => setCompanyName("Microsoft")}
              >
                Microsoft
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer bg-purple-500/5 hover:bg-purple-500/10"
                onClick={() => setCompanyName("Apple")}
              >
                Apple
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer bg-purple-500/5 hover:bg-purple-500/10"
                onClick={() => setCompanyName("Amazon")}
              >
                Amazon
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer bg-purple-500/5 hover:bg-purple-500/10"
                onClick={() => setCompanyName("Meta")}
              >
                Meta
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="relative h-20 w-20">
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-75"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>
            <p className="mt-4 text-lg">Analyzing {companyName}'s hiring patterns and requirements...</p>
          </motion.div>
        )}

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Card className="border-purple-500/20 md:w-1/3">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle>{companyName}</CardTitle>
                      <p className="text-sm text-muted-foreground">Tech Company • 10,000+ employees</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Company Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      {companyName} is a leading technology company known for innovation in software, cloud computing,
                      and AI. They have a rigorous hiring process that emphasizes technical skills, problem-solving, and
                      cultural fit.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Match Analysis</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>Overall Match</span>
                          <span className="font-medium">65%</span>
                        </div>
                        <Progress
                          value={65}
                          className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Technical</span>
                            <span>70%</span>
                          </div>
                          <Progress value={70} className="h-1 bg-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Experience</span>
                            <span>60%</span>
                          </div>
                          <Progress value={60} className="h-1 bg-teal-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Culture</span>
                            <span>75%</span>
                          </div>
                          <Progress value={75} className="h-1 bg-purple-500" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span>Education</span>
                            <span>55%</span>
                          </div>
                          <Progress value={55} className="h-1 bg-yellow-500" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Hiring Process</h3>
                    <ol className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                          1
                        </div>
                        <span>Online Application</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                          2
                        </div>
                        <span>Technical Phone Screen</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                          3
                        </div>
                        <span>Technical Assessment</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                          4
                        </div>
                        <span>Onsite Interviews (4-5 rounds)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 text-xs">
                          5
                        </div>
                        <span>Offer & Negotiation</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <div className="flex-1">
                <Card className="border-purple-500/20 mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-400" />
                      Personalized Roadmap for {companyName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <p className="mb-4">
                      Based on your profile and {companyName}'s hiring requirements, we've created a customized roadmap
                      to help you land your dream job.
                    </p>

                    <Tabs defaultValue="skills" className="w-full" onValueChange={setActiveTab}>
                      <TabsList className="grid grid-cols-4 mb-4">
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="interview">Interview</TabsTrigger>
                        <TabsTrigger value="application">Application</TabsTrigger>
                      </TabsList>

                      {/* Skills Tab */}
                      <TabsContent value="skills" className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: activeTab === "skills" ? 1 : 0, y: activeTab === "skills" ? 0 : 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-medium text-lg mb-3">Required Skills for {companyName}</h3>

                          <div className="space-y-4">
                            {[
                              {
                                skill: "JavaScript (Advanced)",
                                description: `${companyName} looks for advanced JavaScript knowledge, including ES6+ features, closures, and async patterns.`,
                                status: "partial",
                                priority: "High",
                              },
                              {
                                skill: "React & State Management",
                                description: `${companyName} uses React extensively. Focus on hooks, context API, and state management libraries.`,
                                status: "partial",
                                priority: "High",
                              },
                              {
                                skill: "Data Structures & Algorithms",
                                description: `${companyName}'s interviews heavily focus on DS&A problems. Practice regularly on LeetCode.`,
                                status: "missing",
                                priority: "Critical",
                              },
                              {
                                skill: "System Design",
                                description: `${companyName} expects engineers to understand scalable system design principles.`,
                                status: "missing",
                                priority: "Medium",
                              },
                              {
                                skill: "Testing",
                                description: `${companyName} values test-driven development. Learn Jest and React Testing Library.`,
                                status: "missing",
                                priority: "Medium",
                              },
                            ].map((item, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                  item.status === "complete"
                                    ? "border-green-500/20 bg-green-500/5"
                                    : item.status === "partial"
                                      ? "border-yellow-500/20 bg-yellow-500/5"
                                      : "border-red-500/20 bg-red-500/5"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {item.status === "complete" ? (
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                                  ) : item.status === "partial" ? (
                                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                  ) : (
                                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                  )}
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium">{item.skill}</h4>
                                      <Badge
                                        variant="outline"
                                        className={
                                          item.priority === "Critical"
                                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                                            : item.priority === "High"
                                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                              : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                        }
                                      >
                                        {item.priority} Priority
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{item.description}</p>

                                    {item.status === "partial" && (
                                      <div className="mt-2 space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                          <span>Your proficiency</span>
                                          <span>60%</span>
                                        </div>
                                        <Progress value={60} className="h-1 bg-yellow-500" />
                                      </div>
                                    )}

                                    <div className="mt-3 flex flex-wrap gap-2">
                                      <Button size="sm" variant="outline" className="text-xs h-7">
                                        View Resources
                                      </Button>
                                      <Button size="sm" className="text-xs h-7 bg-purple-500 hover:bg-purple-600">
                                        Start Learning
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      </TabsContent>

                      {/* Projects Tab */}
                      <TabsContent value="projects" className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: activeTab === "projects" ? 1 : 0, y: activeTab === "projects" ? 0 : 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-medium text-lg mb-3">{companyName}-Specific Projects</h3>
                          <p className="text-muted-foreground mb-4">
                            Build these projects to demonstrate skills that {companyName} values in candidates.
                          </p>

                          <div className="space-y-4">
                            {[
                              {
                                title: `${companyName} Clone`,
                                description: `Create a simplified version of ${companyName}'s main product to showcase your understanding of their technology stack.`,
                                skills: ["React", "State Management", "API Integration"],
                                difficulty: "Advanced",
                                timeEstimate: "4-6 weeks",
                              },
                              {
                                title: "Real-time Collaborative App",
                                description: `${companyName} values real-time collaboration features. Build a simple collaborative tool with WebSockets.`,
                                skills: ["WebSockets", "React", "State Synchronization"],
                                difficulty: "Intermediate",
                                timeEstimate: "2-3 weeks",
                              },
                              {
                                title: "Performance Optimization Challenge",
                                description: `${companyName} cares about performance. Take an existing app and optimize it for speed and efficiency.`,
                                skills: ["Performance Profiling", "Code Splitting", "Memoization"],
                                difficulty: "Intermediate",
                                timeEstimate: "1-2 weeks",
                              },
                            ].map((project, index) => (
                              <Card key={index} className="border-blue-500/20">
                                <CardContent className="p-4 space-y-3">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{project.title}</h4>
                                    <Badge
                                      variant="outline"
                                      className={
                                        project.difficulty === "Advanced"
                                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                      }
                                    >
                                      {project.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{project.description}</p>
                                  <div className="flex flex-wrap gap-2">
                                    {project.skills.map((skill) => (
                                      <Badge key={skill} variant="outline">
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Estimated time: {project.timeEstimate}
                                  </div>
                                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                                    Start Project
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </motion.div>
                      </TabsContent>

                      {/* Interview Tab */}
                      <TabsContent value="interview" className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: activeTab === "interview" ? 1 : 0,
                            y: activeTab === "interview" ? 0 : 10,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-medium text-lg mb-3">{companyName} Interview Preparation</h3>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <Card className="border-purple-500/20">
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Code className="h-5 w-5 text-purple-400" />
                                  <h4 className="font-medium">Technical Interview</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {companyName}'s technical interviews focus on algorithms, data structures, and system
                                  design.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                  Practice Questions
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="border-purple-500/20">
                              <CardContent className="p-4 space-y-2">
                                <div className="flex items-center gap-2">
                                  <Users className="h-5 w-5 text-purple-400" />
                                  <h4 className="font-medium">Behavioral Interview</h4>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Prepare for questions about teamwork, conflict resolution, and past experiences.
                                </p>
                                <Button variant="outline" size="sm" className="w-full">
                                  Behavioral Questions
                                </Button>
                              </CardContent>
                            </Card>
                          </div>

                          <h4 className="font-medium mb-3">Common Interview Questions at {companyName}</h4>
                          <div className="space-y-3">
                            {[
                              {
                                question: "Implement a function to reverse a linked list",
                                type: "Technical",
                                difficulty: "Medium",
                              },
                              {
                                question: "Design a URL shortening service like bit.ly",
                                type: "System Design",
                                difficulty: "Hard",
                              },
                              {
                                question: "Tell me about a time you had a conflict with a team member",
                                type: "Behavioral",
                                difficulty: "Medium",
                              },
                              {
                                question: "Implement a LRU cache with O(1) operations",
                                type: "Technical",
                                difficulty: "Hard",
                              },
                              {
                                question: "How would you improve our product?",
                                type: "Product Sense",
                                difficulty: "Medium",
                              },
                            ].map((item, index) => (
                              <div key={index} className="p-3 rounded-lg border border-purple-500/20 bg-purple-500/5">
                                <div className="flex items-center justify-between">
                                  <div className="font-medium">{item.question}</div>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="bg-blue-500/10 text-blue-400 border-blue-500/20"
                                    >
                                      {item.type}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={
                                        item.difficulty === "Hard"
                                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                      }
                                    >
                                      {item.difficulty}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-6">
                            <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                              Schedule Mock Interview
                            </Button>
                          </div>
                        </motion.div>
                      </TabsContent>

                      {/* Application Tab */}
                      <TabsContent value="application" className="space-y-4">
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: activeTab === "application" ? 1 : 0,
                            y: activeTab === "application" ? 0 : 10,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <h3 className="font-medium text-lg mb-3">Application Tips for {companyName}</h3>

                          <div className="space-y-4 mb-6">
                            <Card className="border-purple-500/20">
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-medium">Resume Optimization</h4>
                                <p className="text-sm text-muted-foreground">
                                  Tailor your resume specifically for {companyName} by highlighting relevant skills and
                                  experiences.
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">Use keywords from {companyName}'s job descriptions</p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">Quantify achievements with metrics and results</p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">
                                      Highlight projects that align with {companyName}'s products
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Optimize Your Resume
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="border-purple-500/20">
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-medium">Networking Strategy</h4>
                                <p className="text-sm text-muted-foreground">
                                  Connect with current {companyName} employees on LinkedIn and attend company events to
                                  build relationships.
                                </p>
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">Find alumni from your school who work at {companyName}</p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">Attend {companyName} tech talks and recruiting events</p>
                                  </div>
                                  <div className="flex items-start gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                                    <p className="text-sm">
                                      Join online communities where {companyName} employees participate
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Find Connections
                                </Button>
                              </CardContent>
                            </Card>

                            <Card className="border-purple-500/20">
                              <CardContent className="p-4 space-y-3">
                                <h4 className="font-medium">Application Timeline</h4>
                                <p className="text-sm text-muted-foreground">
                                  {companyName}'s hiring process typically takes 4-6 weeks from application to offer.
                                </p>
                                <div className="relative pt-2">
                                  <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-purple-500/20"></div>
                                  <div className="space-y-4">
                                    {[
                                      { stage: "Application Submission", time: "Day 0" },
                                      { stage: "Resume Screening", time: "1-2 weeks" },
                                      { stage: "Technical Phone Screen", time: "2-3 weeks" },
                                      { stage: "Technical Assessment", time: "3-4 weeks" },
                                      { stage: "Onsite Interviews", time: "4-5 weeks" },
                                      { stage: "Offer & Negotiation", time: "5-6 weeks" },
                                    ].map((stage, index) => (
                                      <div key={index} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs mt-0.5">
                                          {index + 1}
                                        </div>
                                        <div>
                                          <div className="font-medium">{stage.stage}</div>
                                          <div className="text-xs text-muted-foreground">{stage.time}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <div className="flex justify-between">
                            <Button variant="outline" className="flex items-center gap-1">
                              <ArrowRight className="h-4 w-4" /> View Open Positions
                            </Button>
                            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                              Create Application Plan
                            </Button>
                          </div>
                        </motion.div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-purple-500/20">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3">
                        <BookOpen className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="font-medium">Learning Resources</h3>
                      <p className="text-sm text-muted-foreground mb-3">{companyName}-specific courses and materials</p>
                      <Button variant="outline" size="sm" className="w-full">
                        View Resources <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/20">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3">
                        <MessageSquare className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="font-medium">Community</h3>
                      <p className="text-sm text-muted-foreground mb-3">Connect with others targeting {companyName}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        Join Community <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-purple-500/20">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-3">
                        <Briefcase className="h-6 w-6 text-purple-400" />
                      </div>
                      <h3 className="font-medium">Job Alerts</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Get notified about new {companyName} openings
                      </p>
                      <Button variant="outline" size="sm" className="w-full">
                        Set Up Alerts <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
