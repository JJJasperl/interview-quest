// client/src/components/JobPostForm.jsx
import React, { useState, useEffect } from "react";
import { generateQuestions, extractJobDetails } from "../services/api";

function JobPostForm({ setQuestions, setIsLoading, setError, currentSearch }) {
  const [jobPost, setJobPost] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  // Initial setup from currentSearch
  useEffect(() => {
    if (currentSearch) {
      setJobPost(currentSearch.jobPost || "");
      setCompany(currentSearch.company || "");
      setJobTitle(currentSearch.jobTitle || "");
    }
  }, [currentSearch]);

  // Handle job post changes
  const handleJobPostChange = (e) => {
    setJobPost(e.target.value);
  };

  // Handle company name changes
  const handleCompanyChange = (e) => {
    setCompany(e.target.value);
  };

  // Handle job title changes
  const handleJobTitleChange = (e) => {
    setJobTitle(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobPost.trim()) {
      setError("Please enter a job posting");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, try to extract company and job title details
      setIsExtracting(true);
      let finalCompany = company;
      let finalJobTitle = jobTitle;

      try {
        const result = await extractJobDetails(jobPost);

        if (result.company) {
          finalCompany = result.company;
          setCompany(result.company);
        }

        if (result.jobTitle) {
          finalJobTitle = result.jobTitle;
          setJobTitle(result.jobTitle);
        }
      } catch (error) {
        console.error("Error extracting details:", error);
      } finally {
        setIsExtracting(false);
      }

      // Ensure we have non-empty values
      finalCompany = finalCompany?.trim() || "Unknown Company";
      finalJobTitle = finalJobTitle?.trim() || "Unknown Position";

      // Generate questions
      const data = await generateQuestions(jobPost);

      // Return both the questions and form data
      setQuestions(data.questions, {
        company: finalCompany,
        jobTitle: finalJobTitle,
        jobPost,
      });
    } catch (err) {
      console.error("Error generating questions:", err);
      setError(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="job-post-form-container">
      <form onSubmit={handleSubmit} className="job-post-form">
        <div className="form-group job-details">
          <div className="input-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              value={company}
              onChange={handleCompanyChange}
              placeholder="Company name"
            />
          </div>

          <div className="input-group">
            <label htmlFor="jobTitle">Position</label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={handleJobTitleChange}
              placeholder="Job title"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="jobPost">
            Job Description{" "}
            {isExtracting && (
              <span className="extracting-indicator">Analyzing...</span>
            )}
          </label>
          <textarea
            id="jobPost"
            value={jobPost}
            onChange={handleJobPostChange}
            placeholder="Paste job description here..."
            rows={12}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Generate Questions</button>
          <button
            type="button"
            onClick={() => {
              setJobPost("");
              setCompany("");
              setJobTitle("");
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobPostForm;
