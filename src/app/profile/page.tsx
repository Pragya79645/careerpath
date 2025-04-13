"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { User, Briefcase, GraduationCap, Award, TrendingUp, Clock, CheckCircle, Edit, Github, Linkedin, Globe, Plus, Code, Palette, Database, GitBranch, Rocket, Lock } from 'lucide-react'

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-6 items-start md:items-center"
      >
        <div className="relative">
          <Avatar className="h-24 w-24 border-2 border-purple-500">
            <AvatarImage src="/placeholder.svg?height=96&width=96" />
            <AvatarFallback className="text-2xl">JS</AvatarFallback>
          </Avatar>
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background border-purple-500"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit Profile Picture</span>
          </Button>
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Jamie Smith</h1>
              <p className="text-muted-foreground">Frontend Developer | San Francisco, CA</p>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Edit className="mr-2 h-4 w-4" /> Edit Profile
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <a href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Github className="h-4 w-4" /> github.com/jamiesmith
            </a>
            <a href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Linkedin className="h-4 w-4" /> linkedin.com/in/jamiesmith
            </a>
            <a href="#" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Globe className="h-4 w-4" /> jamiesmith.dev
            </a>
          </div>
        </div>
      </motion.div>

      {/* Profile Tabs */}
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-8">
          {/* Career Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "overview" ? 1 : 0, y: activeTab === "overview" ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  Career Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-medium">Current Path</h3>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                      <Code className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">Frontend Developer</div>
                      <div className="text-sm text-muted-foreground">Started 6 months ago</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Overall Progress</h3>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <Progress
                    value={42}
                    className="h-2"
                    indicatorClassName="bg-gradient-to-r from-purple-500 to-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-1">8</div>
                    <div className="text-sm text-muted-foreground">Skills Acquired</div>
                  </div>
                  <div className="bg-blue-500/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-1">3</div>
                    <div className="text-sm text-muted-foreground">Milestones Completed</div>
                  </div>
                  <div className="bg-teal-500/10 rounded-lg p-4 text-center">
                    <div className="text-3xl font-bold text-teal-400 mb-1">12</div>
                    <div className="text-sm text-muted-foreground">Learning Hours</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "overview" ? 1 : 0, y: activeTab === "overview" ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-blue-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Completed React Fundamentals Course",
                      date: "2 days ago",
                      icon: CheckCircle,
                      iconColor: "text-green-500",
                      bgColor: "bg-green-500/10",
                    },
                    {
                      title: "Reached 'React Rockstar' milestone",
                      date: "1 week ago",
                      icon: Award,
                      iconColor: "text-purple-500",
                      bgColor: "bg-purple-500/10",
                    },
                    {
                      title: "Added new skill: TypeScript",
                      date: "2 weeks ago",
                      icon: Plus,
                      iconColor: "text-blue-500",
                      bgColor: "bg-blue-500/10",
                    },
                    {
                      title: "Completed Portfolio Project",
                      date: "3 weeks ago",
                      icon: CheckCircle,
                      iconColor: "text-green-500",
                      bgColor: "bg-green-500/10",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`${activity.bgColor} h-8 w-8 rounded-full flex items-center justify-center ${activity.iconColor} flex-shrink-0`}
                      >
                        <activity.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{activity.title}</div>
                        <div className="text-sm text-muted-foreground">{activity.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "overview" ? 1 : 0, y: activeTab === "overview" ? 0 : 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-teal-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Complete Advanced React Patterns",
                      description: "Learn context, hooks, and performance optimization",
                      progress: 25,
                    },
                    {
                      title: "Build a Full-Stack Project",
                      description: "Apply your React skills with a backend integration",
                      progress: 0,
                    },
                    {
                      title: "Learn Testing with Jest",
                      description: "Master unit and integration testing for React apps",
                      progress: 10,
                    },
                  ].map((recommendation, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{recommendation.title}</div>
                          <div className="text-sm text-muted-foreground">{recommendation.description}</div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            recommendation.progress > 0
                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {recommendation.progress > 0 ? `${recommendation.progress}%` : "Not Started"}
                        </Badge>
                      </div>
                      <Progress
                        value={recommendation.progress}
                        className="h-1"
                        indicatorClassName="bg-gradient-to-r from-teal-500 to-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "skills" ? 1 : 0, y: activeTab === "skills" ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-400" />
                  Skills Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Technical Skills */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Technical Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { skill: "HTML & CSS", level: 90 },
                        { skill: "JavaScript", level: 85 },
                        { skill: "React", level: 75 },
                        { skill: "TypeScript", level: 60 },
                        { skill: "Git", level: 70 },
                        { skill: "Responsive Design", level: 85 },
                      ].map((skill) => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Soft Skills */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Soft Skills</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { skill: "Communication", level: 80 },
                        { skill: "Problem Solving", level: 85 },
                        { skill: "Teamwork", level: 90 },
                        { skill: "Time Management", level: 75 },
                      ].map((skill) => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            <span className="text-sm text-muted-foreground">{skill.level}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                              style={{ width: `${skill.level}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Skill Gaps & Growth Opportunities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          skill: "Next.js",
                          description: "Server-side rendering with React",
                          priority: "High",
                          priorityColor: "bg-red-500/10 text-red-400 border-red-500/20",
                        },
                        {
                          skill: "Testing",
                          description: "Jest and React Testing Library",
                          priority: "Medium",
                          priorityColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                        },
                        {
                          skill: "GraphQL",
                          description: "Modern API query language",
                          priority: "Medium",
                          priorityColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
                        },
                      ].map((skill) => (
                        <Card key={skill.skill} className="border-purple-500/20">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{skill.skill}</h4>
                              <Badge variant="outline" className={skill.priorityColor}>
                                {skill.priority} Priority
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{skill.description}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "milestones" ? 1 : 0, y: activeTab === "milestones" ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-400" />
                  Career Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Connecting line */}
                  <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-muted"></div>

                  <div className="space-y-8">
                    {[
                      {
                        title: "Frontend Baddie",
                        description: "Mastered HTML, CSS, and JavaScript fundamentals",
                        date: "Completed on March 15, 2025",
                        status: "completed",
                        icon: Code,
                      },
                      {
                        title: "React Rockstar",
                        description: "Built dynamic UIs with React and state management",
                        date: "Completed on April 20, 2025",
                        status: "completed",
                        icon: Palette,
                      },
                      {
                        title: "API Architect",
                        description: "Connected frontend to backend services",
                        date: "In progress - 65% complete",
                        status: "in-progress",
                        icon: Database,
                      },
                      {
                        title: "DevOps Diva",
                        description: "Deploy and manage your applications",
                        date: "Locked - Complete previous milestone first",
                        status: "locked",
                        icon: GitBranch,
                      },
                      {
                        title: "Dev Queen",
                        description: "Become a full-stack developer with advanced skills",
                        date: "Locked - Complete previous milestone first",
                        status: "locked",
                        icon: Rocket,
                      },
                    ].map((milestone, index) => (
                      <div key={index} className="flex gap-4 relative">
                        <div
                          className={`h-14 w-14 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                            milestone.status === "completed"
                              ? "bg-gradient-to-r from-purple-500 to-blue-500"
                              : milestone.status === "in-progress"
                              ? "bg-gradient-to-r from-purple-500/70 to-blue-500/70"
                              : "bg-muted"
                          }`}
                        >
                          <milestone.icon
                            className={`h-6 w-6 ${milestone.status === "locked" ? "text-muted-foreground" : "text-white"}`}
                          />
                        </div>

                        <div className="flex-1">
                          <div
                            className={`p-4 rounded-lg ${
                              milestone.status === "completed"
                                ? "bg-purple-500/10 border border-purple-500/20"
                                : milestone.status === "in-progress"
                                ? "bg-blue-500/10 border border-blue-500/20"
                                : "bg-muted/30 border border-muted"
                            }`}
                          >
                            <h3 className="font-medium text-lg">{milestone.title}</h3>
                            <p className="text-muted-foreground">{milestone.description}</p>
                            <div className="mt-2 text-sm">
                              {milestone.status === "completed" && (
                                <span className="flex items-center gap-1 text-green-500">
                                  <CheckCircle className="h-4 w-4" /> {milestone.date}
                                </span>
                              )}
                              {milestone.status === "in-progress" && (
                                <div className="space-y-1">
                                  <span className="flex items-center gap-1 text-blue-500">
                                    <Clock className="h-4 w-4" /> {milestone.date}
                                  </span>
                                  <Progress
                                    value={65}
                                    className="h-1"
                                    indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                                  />
                                </div>
                              )}
                              {milestone.status === "locked" && (
                                <span className="flex items-center gap-1 text-muted-foreground">
                                  <Lock className="h-4 w-4" /> {milestone.date}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "learning" ? 1 : 0, y: activeTab === "learning" ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-400" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* Current Courses */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Current Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: "Advanced React Patterns",
                          provider: "Frontend Masters",
                          progress: 25,
                          lastActivity: "2 days ago",
                        },
                        {
                          title: "TypeScript for React Developers",
                          provider: "Udemy",
                          progress: 60,
                          lastActivity: "Yesterday",
                        },
                      ].map((course, index) => (
                        <Card key={index} className="border-blue-500/20">
                          <CardContent className="p-4 space-y-3">
                            <div>
                              <h4 className="font-medium">{course.title}</h4>
                              <p className="text-sm text-muted-foreground">{course.provider}</p>
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress
                                value={course.progress}
                                className="h-2"
                                indicatorClassName="bg-gradient-to-r from-blue-500 to-purple-500"
                              />
                            </div>
                            <div className="text-xs text-muted-foreground">Last activity: {course.lastActivity}</div>
                            <Button variant="outline" size="sm" className="w-full">
                              Continue Learning
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Completed Courses */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Completed Courses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          title: "React Fundamentals",
                          provider: "Frontend Masters",
                          completedDate: "April 18, 2025",
                        },
                        {
                          title: "CSS Grid & Flexbox",
                          provider: "CSS Tricks",
                          completedDate: "March 25, 2025",
                        },
                        {
                          title: "JavaScript: The Hard Parts",
                          provider: "Frontend Masters",
                          completedDate: "February 10, 2025",
                        },
                      ].map((course, index) => (
                        <Card key={index} className="border-green-500/20">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{course.title}</h4>
                                <p className="text-sm text-muted-foreground">{course.provider}</p>
                              </div>
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            </div>
                            <div className="text-xs text-muted-foreground">Completed on: {course.completedDate}</div>
                            <Button variant="outline" size="sm" className="w-full">
                              Review Materials
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Learning Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-purple-500/10 border-purple-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-purple-400 mb-1">12</div>
                        <div className="text-sm text-muted-foreground">Learning Hours</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-500/10 border-blue-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400 mb-1">5</div>
                        <div className="text-sm text-muted-foreground">Courses Completed</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-teal-500/10 border-teal-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-teal-400 mb-1">2</div>
                        <div className="text-sm text-muted-foreground">Courses In Progress</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-500/10 border-green-500/20">
                      <CardContent className="p-4 text-center">
                        <div className="text-3xl font-bold text-green-400 mb-1">8</div>
                        <div className="text-sm text-muted-foreground">Certificates Earned</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: activeTab === "projects" ? 1 : 0, y: activeTab === "projects" ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-400" />
                  Portfolio Projects
                </CardTitle>
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  <Plus className="mr-2 h-4 w-4" /> Add Project
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: "Personal Portfolio Website",
                      description: "A responsive portfolio website built with React and Tailwind CSS",
                      image: "/placeholder.svg?height=200&width=400",
                      tags: ["React", "Tailwind CSS", "Framer Motion"],
                      link: "#",
                      status: "completed",
                    },
                    {
                      title: "Weather Dashboard",
                      description: "A weather app that fetches data from a weather API",
                      image: "/placeholder.svg?height=200&width=400",
                      tags: ["React", "API Integration", "CSS"],
                      link: "#",
                      status: "completed",
                    },
                    {
                      title: "E-commerce Product Page",
                      description: "A product page with cart functionality and image gallery",
                      image: "/placeholder.svg?height=200&width=400",
                      tags: ["React", "Context API", "Styled Components"],
                      link: "#",
                      status: "in-progress",
                    },
                    {
                      title: "Task Management App",
                      description: "A drag-and-drop task management application",
                      image: "/placeholder.svg?height=200&width=400",
                      tags: ["React", "TypeScript", "Redux"],
                      link: "#",
                      status: "planned",
                    },
                  ].map((project, index) => (
                    <Card key={index} className="overflow-hidden border-purple-500/20">
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        <img
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                        />
                        {project.status === "in-progress" && (
                          <Badge className="absolute top-2 right-2 bg-blue-500 text-white border-none">
                            In Progress
                          </Badge>
                        )}
                        {project.status === "planned" && (
                          <Badge className="absolute top-2 right-2 bg-muted-foreground text-white border-none">
                            Planned
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-4 space-y-3">
                        <h3 className="font-medium text-lg">{project.title}</h3>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex justify-end">
                          <Button variant="outline" size="sm" asChild>
                            <a href={project.link}>View Project</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
