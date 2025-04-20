import { Groq } from "groq-sdk"
import { NextResponse } from "next/server"

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { resumeText } = body

    // Validate input
    if (!resumeText) {
      return NextResponse.json({ error: "Resume text is required" }, { status: 400 })
    }

    console.log("Processing resume text:", resumeText.substring(0, 100) + "...")

    // First extract the basic info from the resume
    const parseCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a resume parsing assistant. Extract key information from the resume text provided. Format your response as a JSON object.",
        },
        {
          role: "user",
          content: `Parse the following resume and extract the following information in JSON format:
          1. name
          2. email
          3. phone
          4. location (if available)
          5. education (as an array of strings)
          6. skills (as an array of strings)
          7. experience (as an array of objects, each with company, title, dates, and description fields)
          8. certifications (as an array of strings, if available)
          
          Resume text:
          ${resumeText}`,
        },
      ],
      temperature: 0.1,
      response_format: { type: "json_object" },
    })

    const parsedResumeData = JSON.parse(parseCompletion.choices[0].message.content)
    console.log("Successfully parsed resume data")

    // Next, generate career path analysis
    const careerAnalysisCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a career counselor AI. Analyze the resume and provide career path recommendations with skill gap analysis.",
        },
        {
          role: "user",
          content: `Based on the following resume information, provide 3 potential career paths for this person. For each career path, include:
          1. A title for the career path
          2. A brief description of why this career path is suitable
          3. A list of requiredSkills for this career path (as an array of strings)
          4. A list of missingSkills (skills the person needs to develop) (as an array of strings)
          5. A development roadmap with specific steps to acquire the missing skills (as an array of objects with step and description fields)
          
          Format your response as a JSON object with a "careerPaths" array.
          
          Resume information:
          ${JSON.stringify(parsedResumeData, null, 2)}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    const careerAnalysis = JSON.parse(careerAnalysisCompletion.choices[0].message.content)
    console.log("Successfully generated career analysis")

    // Lastly, generate resume improvement suggestions
    const improvementCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a resume improvement expert. Analyze the resume and provide specific suggestions for improvement.",
        },
        {
          role: "user",
          content: `Analyze the following resume information and provide specific suggestions for improvement. Include:
          1. overallAssessment (a string with overall assessment)
          2. contentImprovements (as an array of specific suggestions)
          3. formatImprovements (as an array of specific suggestions)
          4. scores object with effectiveness scores on a scale of 1-10 for: content, format, impact, and atsCompatibility
          
          Format your response as a JSON object.
          
          Resume information:
          ${JSON.stringify(parsedResumeData, null, 2)}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    const improvementSuggestions = JSON.parse(improvementCompletion.choices[0].message.content)
    console.log("Successfully generated improvement suggestions")

    // Generate industry insights
    const industryInsightsCompletion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an industry trends analyst. Provide insights about job market trends related to the candidate's skills and experience.",
        },
        {
          role: "user",
          content: `Based on the following resume information, provide industry insights including:
          1. marketDemand (object with demandLevel as string ["High", "Medium", "Low"] and description)
          2. salaryRange (object with min and max values in USD)
          3. growthAreas (array of strings describing growth areas in the candidate's field)
          4. industryTrends (array of objects with trend and description fields)
          5. topEmployers (array of strings listing top employers in the candidate's field)
          
          Format your response as a JSON object.
          
          Resume information:
          ${JSON.stringify(parsedResumeData, null, 2)}`,
        },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    })

    const industryInsights = JSON.parse(industryInsightsCompletion.choices[0].message.content)
    console.log("Successfully generated industry insights")

    // Return the combined results
    return NextResponse.json({
      parsed: parsedResumeData,
      careerAnalysis: careerAnalysis,
      improvementSuggestions: improvementSuggestions,
      industryInsights: industryInsights,
    })
  } catch (error: any) {
    console.error("Error in Groq API:", error)
    return NextResponse.json({ error: `Failed to process resume: ${error.message}` }, { status: 500 })
  }
}

// This prevents Next.js from handling OPTIONS requests incorrectly
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
