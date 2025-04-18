// components/CareerSuggestions.tsx
import React, { useState } from 'react';

interface RoadmapStep {
  step: string;
  description: string;
}

interface CareerPath {
  title: string;
  description: string;
  missingSkills: string[];
  roadmap: RoadmapStep[];
}

interface CareerAnalysisProps {
  careerAnalysis: {
    careerPaths: CareerPath[];
  };
  resumeData: any;
}

const CareerSuggestions: React.FC<CareerAnalysisProps> = ({ careerAnalysis, resumeData }) => {
  const [selectedCareer, setSelectedCareer] = useState(0);

  if (!careerAnalysis || !careerAnalysis.careerPaths) {
    return null;
  }

  const { careerPaths } = careerAnalysis;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Career Path Suggestions</h2>
      
      <div className="flex mb-6">
        {careerPaths.map((path, index) => (
          <button
            key={index}
            className={`flex-1 p-3 text-center ${
              selectedCareer === index
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            } ${index > 0 ? 'ml-2' : ''}`}
            onClick={() => setSelectedCareer(index)}
          >
            {path.title}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-2">{careerPaths[selectedCareer].title}</h3>
        <p className="text-gray-700 mb-4">{careerPaths[selectedCareer].description}</p>
        
        <div className="mb-4">
          <h4 className="font-bold text-lg mb-2">Missing Skills</h4>
          <div className="flex flex-wrap">
            {careerPaths[selectedCareer].missingSkills.map((skill, index) => (
              <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full mr-2 mb-2">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-lg mb-2">Skill Development Roadmap</h4>
          <div className="space-y-4">
            {careerPaths[selectedCareer].roadmap.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-bold">{step.step}</h5>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-xl font-bold mb-2">Your Current Profile</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold">Skills</h4>
            <div className="flex flex-wrap mt-2">
              {resumeData.skills.map((skill: string, index: number) => (
                <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full mr-2 mb-2">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-bold">Education</h4>
            <ul className="list-disc list-inside mt-2">
              {resumeData.education.map((edu: string, index: number) => (
                <li key={index} className="text-gray-700">{edu}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSuggestions;