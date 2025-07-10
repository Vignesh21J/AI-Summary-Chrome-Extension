document.getElementById("summarize").addEventListener("click", () => {
    // console.log("Popup script loaded");

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '<div class= "loader"></div>';

    const summaryType = document.getElementById("summary-type").value;
    

    // 1. Get the user's API Key
    chrome.storage.sync.get(["geminiApiKey"], ({ geminiApiKey }) => {

        if (!geminiApiKey) {
        resultDiv.textContent = "API key not found. Please enter it in settings.";
        return;
        }

        // 2. Ask content.js for the page text
        chrome.tabs.query({active: true, currentWindow: true}, ([tab]) => {
            chrome.tabs.sendMessage(
                tab.id, 
                { type: "GET_ARTICLE_TEXT" }, 
                async ({text}) => {
                    
                    if(!text) {
                        resultDiv.textContent = "Couldn't extract text from this page..";
                        return;
                    }

                    // 3. Send text to Gemini
                    try {
                        const summary = await getGeminiSummary(text, summaryType, geminiApiKey);
                        resultDiv.textContent = summary;
                    } catch (error) {
                        resultDiv.textContent = "Gemini error: " + error.message;
                    }
            });
            // chrome.tabs.sendMessage(tab.id, { type: "GET_ARTICLE_TEXT" }, async (response) => {
            //     const text = response?.text;

            //     if (!text) {
            //         resultDiv.textContent = "Couldn't extract text from this page..";
            //         return;
            //     }

            //     try {
            //         const summary = await getGeminiSummary(text, summaryType, geminiApiKey);
            //         resultDiv.textContent = summary;
            //     } catch (error) {
            //         console.error(error);
            //         resultDiv.textContent = "Gemini error: " + error.message;
            //     }
            // });

        })
    });


})



async function getGeminiSummary(rawText, type, apiKey) {

    // Truncate very long texts to avoid API limits (typically around 30K tokens)
    const maxLength = 20000;

    const text = rawText.length > maxLength ? rawText.slice(0, maxLength) + "..." : rawText;

    const promptMap = {
        brief: `Provide a summary of the article in 2-3 sentences:\n\n${text}`,
        detailed: `Give a detailed summary:\n\n${text}`,
        bullets: `Summarize in 5-7 bullet points (start each line with "- "):\n\n${text}`,
    };

    const prompt = promptMap[type] || promptMap.brief;

    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{parts: [{ text: prompt }] }],
                generationConfig: {temperature: 0.2},
            }),
        }
    );

    if(!res.ok) {
        const { error } = await res.json();
        throw new Error(error?.message || "Request failed");
    }

    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No summary available.";
}   


document.getElementById("copy-btn").addEventListener("click", () => {
    const summaryText = document.getElementById("result").innerText;

    if(summaryText || summaryText.trim() !== "") {
        navigator.clipboard.writeText(summaryText).then(() => {

            const copyBtn = document.getElementById("copy-btn");
            const originalText = copyBtn.innerText;

            copyBtn.innerText = "Copied!";

            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);

        })
        .catch((err) => {
            console.error("Failed to copy text: ", err);
        });
    }
})

