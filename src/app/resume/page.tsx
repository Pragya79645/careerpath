"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ResumeAnalyzer() {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploaded, setIsUploaded] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    setIsUploaded(true)
  }

  const handleFileChange = () => {
    setIsUploaded(true)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Resume Analyzer</h1>
        <p className="text-muted-foreground">Upload your resume and get personalized career recommendations</p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!isUploaded ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card
              className={`border-2 border-dashed ${
                isDragging ? "border-purple-500 bg-purple-500/5" : "border-border"
              } transition-colors duration-300`}
            >
              <CardContent
                className="flex flex-col items-center justify-center p-12"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="h-20 w-20 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 flex items-center justify-center mb-6">
                  <Upload className="h-10 w-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Drop that resume, queen 👑</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Drag and drop your resume file here, or click the button below to browse your files
                </p>
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                  onClick={handleFileChange}
                >
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <Card className="border-green-500/20 bg-green-500/5">
              <CardContent className="p-4 flex items-center gap-4">
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Resume uploaded successfully!</h3>
                  <p className="text-sm text-muted-foreground">resume.pdf • 2.4MB</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Resume Analysis</h2>
                    <p className="text-muted-foreground">Here's what we found in your resume</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Personal Info</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Name</div>
                        <div>Jamie Smith</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Email</div>
                        <div>jamie.smith@example.com</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Phone</div>
                        <div>(555) 123-4567</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Location</div>
                        <div>San Francisco, CA</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Skills Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">HTML</Badge>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">CSS</Badge>
                      <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20">JavaScript</Badge>
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">React</Badge>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">UI Design</Badge>
                      <Badge className="bg-teal-500/10 text-teal-400 border-teal-500/20">Figma</Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Career Matches</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white">
                            1
                          </div>
                          <div>
                            <div className="font-medium">Frontend Developer</div>
                            <div className="text-sm text-muted-foreground">92% match</div>
                          </div>
                        </div>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Excellent Match</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500/80 to-blue-500/80 flex items-center justify-center text-white">
                            2
                          </div>
                          <div>
                            <div className="font-medium">UX/UI Designer</div>
                            <div className="text-sm text-muted-foreground">87% match</div>
                          </div>
                        </div>
                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">Good Match</Badge>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-purple-500/5 to-blue-500/5">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500/60 to-blue-500/60 flex items-center justify-center text-white">
                            3
                          </div>
                          <div>
                            <div className="font-medium">Product Manager</div>
                            <div className="text-sm text-muted-foreground">76% match</div>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Potential Match</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Improvement Areas</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Add more specific project details</div>
                          <div className="text-sm text-muted-foreground">
                            Quantify your achievements with metrics and results
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium">Highlight React experience</div>
                          <div className="text-sm text-muted-foreground">Emphasize your React projects and skills</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    size="lg"
                  >
                    Give Me The Glow-Up Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
