import './Homepage.css'
import { useState } from 'react';
import ReactMarkdown from "react-markdown";


export default function Homepage() {

    const [rewriteText, setRewriteText] = useState("Your polished post");
    const [analysisText, setAnalysisText] = useState("Your post analysis will appear here... ");
    const [recommendationText, setRecommendationText] = useState("Your recommendations will appear here... ");
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    function parseSections(text = "") {
        if (typeof text !== "string" || text.trim() === "") {
            return [];
        }

        // Regex explanation:
        // (^|\n)                 -> start of string or new line
        // ([A-Z][\w\s/&+\-]{1,100}?) -> section title (multi-word, capital start)
        // :\s*                   -> colon separator
        // ([\s\S]*?)             -> non-greedy content
        // (?=\n[A-Z][\w\s/&+\-]{1,100}?:|\s*$) -> lookahead for next section or end
        const regex =
            /(^|\n)([A-Z][\w\s/&+\\-]{1,100}?):\s*([\s\S]*?)(?=\n[A-Z][\w\s/&+\\-]{1,100}?:|\s*$)/g;

        const sections = [];
        let match;
        while ((match = regex.exec(text)) !== null) {
            const title = match[2]?.trim() || "Untitled";
            let content = match[3]?.trim() || "";

            if (/^\[\s*["']?[\s\S]*["']?\s*\]$/.test(content)) {
                try {
                    const arr = JSON.parse(content.replace(/'/g, '"'));
                    if (Array.isArray(arr)) {
                        content = arr.map(item => `- ${item}`).join("\n");
                    }
                } catch {
                }
            }

            sections.push({ title, content });
        }

        // if nothing matched
        if (sections.length === 0 && text.trim()) {
            sections.push({ title: "Notes", content: text });
        }

        return sections;
    }


    function formatRecommendations(text) {
        const sections = parseSections(text);

        return sections.map(({ title, content }, idx) => (
            <div key={idx} className="mb-4">
                <h5 className="fw-bold mb-2" style={{ color: "#00b4d8" }}>
                    {title}
                </h5>
                <div className="prose">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        ));
    }


    const handleAnalyze = async () => {
        setLoading(true);
        if (!file) {
            alert("Please upload a file first!");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", file);

            
            const res = await fetch("http://localhost:8000/analyze", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Failed to fetch analysis");
            }

            const data = await res.json();

           
            setAnalysisText(data.analysis || "No analysis returned.");
            setRecommendationText(data.recommendations || "No recommendations returned.");
            setRewriteText(data.rewrite || "No rewrite returned.");
        } catch (error) {
            console.error("Error uploading file:", error);
            setAnalysisText("Error fetching analysis.");
            setRecommendationText("Error fetching recommendations.");
            setRewriteText("Error fetching rewrite.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='heading'>PostCraft</div>
            <h2>Upload your File/Image</h2>
            <div className="mb-3">
                <input
                    className="form-control"
                    type="file"
                    id="formFile"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={handleFileChange}
                    
                />
                <button
                    className="btn custom-btn mt-3"
                    onClick={handleAnalyze}
                    style={{ maxWidth: "400px", margin: "0 auto" }}

                >
                    Analyze
                </button>
                {loading && <p>Processing your file... Please wait.</p>}
            </div>

            <div className='conntainer my-3'>
                <h2 className="section-heading">Post Analysis</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="analysisText"> {formatRecommendations(analysisText)} </p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(analysisText)} >
                            Copy
                        </button>
                    </div>
                </div>

                <h2 className="section-heading">Recommendations</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="recommendationsText"> {formatRecommendations(recommendationText)} </p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(recommendationText)} >
                            Copy
                        </button>
                    </div>
                </div>
                
                <h2 className="section-heading">AI Rewrite</h2>
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <p id="rewriteText">
                            {formatRecommendations(rewriteText)}
                        </p>
                        <button className="btn custom-btn btn-sm"
                            onClick={() => handleCopy(rewriteText)} >
                            Copy
                        </button>
                    </div>
                </div>
            
            </div>
        </>
    )
}

