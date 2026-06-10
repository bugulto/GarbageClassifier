export const ResultSummary = ({ result }) => {
  return (
    <div className="result-summary">
      <h3>Job Summary</h3>
      <table className="summary-table">
        <tbody>
          <tr>
            <td><strong>Status</strong></td>
            <td>{result.message || result.status || 'Unknown'}</td>
          </tr>
          <tr>
            <td><strong>Job ID</strong></td>
            <td>{result.job_id}</td>
          </tr>
          <tr>
            <td><strong>Filename</strong></td>
            <td>{result.original_filename}</td>
          </tr>
          <tr>
            <td><strong>Input Type</strong></td>
            <td>{result.input_type}</td>
          </tr>
          <tr>
            <td><strong>Model</strong></td>
            <td>{result.model_type}</td>
          </tr>
          <tr>
            <td><strong>Total Detections</strong></td>
            <td>{result.total_detections}</td>
          </tr>
          <tr>
            <td><strong>Result Images</strong></td>
            <td>{result.total_result_images}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
