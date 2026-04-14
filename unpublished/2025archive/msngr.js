// Example: Sending a message to Claude from your Zettelkasten app
async function getClassificationSuggestions(noteContent) {
  try {
    await window.Poe.sendUserMessage(
      "@Claude-3.7-Sonnet Suggest classifications for this note in JSON format: " + noteContent,
      {
        handler: "classificationHandler",
        stream: false,
        openChat: false
      }
    );
  } catch (err) {
    console.error("Error:", err);
    showOfflineFallback();
  }
}

// Process the response
window.Poe.registerHandler("classificationHandler", (result) => {
  if (result.status === "complete" && result.responses.length > 0) {
    const response = result.responses[0];
    // Process the AI's suggestions
    updateClassificationUI(response.content);
  }
});