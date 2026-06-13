import { ResultSummary } from './ResultSummary'
import { ClassSummaryCards } from './ClassSummaryCards'
import { ResultImageGallery } from './ResultImageGallery'
import { DetectionTable } from './DetectionTable'

export const ResultView = ({ result }) => {
  if (!result) return null

  return (
    <div className="result-view">
      <h2>Results</h2>
      <ResultSummary result={result} />
      <ClassSummaryCards summary={result.summary} />
      <ResultImageGallery resultImages={result.result_images} />
      <DetectionTable resultImages={result.result_images} />
    </div>
  )
}
