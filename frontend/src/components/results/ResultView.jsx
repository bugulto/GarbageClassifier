import { ResultSummary } from './ResultSummary'
import { ClassSummaryCards } from './ClassSummaryCards'

export const ResultView = ({ result }) => {
  if (!result) return null

  return (
    <div className="result-view">
      <ResultSummary result={result} />
      <ClassSummaryCards summary={result.summary} />
    </div>
  )
}
