// src/components/results/ResultTabs.jsx
import { useState } from 'react'
import { ResultImageGallery } from './ResultImageGallery'
import { DetectionTable } from './DetectionTable'

export const ResultTabs = ({ result }) => {
  const [activeTab, setActiveTab] = useState('images')

  if (!result) return null

  return (
    <div className="result-tabs-container">
      <div className="result-tabs">
        <button
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          Annotated Images
        </button>
        <button
          className={`tab-btn ${activeTab === 'detections' ? 'active' : ''}`}
          onClick={() => setActiveTab('detections')}
        >
          Detection Table
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'images' && <ResultImageGallery resultImages={result.result_images} />}
        {activeTab === 'detections' && <DetectionTable resultImages={result.result_images} />}
      </div>
    </div>
  )
}
