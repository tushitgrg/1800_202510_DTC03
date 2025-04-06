// Extract query parameters from the URL and retrieve the assessment ID ("id")
const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const aid = searchParams.get("id");

/**
 * Retrieves an assessment from Firestore based on the provided assessment ID.
 *
 * This asynchronous function queries the "assessments" collection for a document matching
 * the given ID. It logs the assessment's AI data to the console and returns the AI part of the assessment.
 *
 * @param {string} postid - The Firestore document ID of the assessment.
 * @returns {Promise<Object>} A promise that resolves to the AI data from the assessment.
 */
const getAssessment = async (postid) => {
  let data = undefined;
  await db
    .collection("assessments")
    .doc(postid)
    .get()
    .then((doc) => {
      data = doc.data();
      // Log the AI portion of the assessment to the console for debugging
      console.dir(data.ai);
    });
  return data.ai;
};

/**
 * Appends the assessment details to the DOM.
 *
 * This function takes the assessment object and updates various UI elements with its data,
 * including the mental score, progress bar, score category, key struggles, insights, strengths,
 * and recommended actions.
 *
 * @param {Object} assessment - The assessment object containing evaluation details.
 */
const appendAssessment = (assessment) => {
  // Update the mental score text and progress bar width/position based on the mental score
  $(".scoretxt").text(assessment.dimensionScores.mental);
  $(".progress-fill").css("width", `${assessment.dimensionScores.mental}%`);
  $("#progresstxt").css("left", `${assessment.dimensionScores.mental}%`);
  $("#scoreCategory").text(assessment.scoreCategory);

  // Append each key struggle as a list item
  for (let i = 0; i < assessment.keyStruggles.length; i++) {
    $("#strugglesList").append(
      `<li>${assessment.keyStruggles[i].description}</li>`,
    );
  }

  // Append each insight as a styled card
  for (let i = 0; i < assessment.insights.length; i++) {
    const h = `
      <div class="bg-white p-4 rounded-lg border border-yellow-100">
        <h4 class="font-medium text-gray-800 mb-2">${assessment.insights[i].title}</h4>
        <p class="text-sm text-gray-600">${assessment.insights[i].description}</p>
      </div>`;
    $("#insightsDiv").append(h);
  }

  // Append each strength as a badge
  for (let i = 0; i < assessment.strengths.length; i++) {
    const h = `
      <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
        ${assessment.strengths[i]}
      </span>`;
    $("#strengthsDiv").append(h);
  }

  // Append each recommended action as a styled card
  for (let i = 0; i < assessment.recommendedActions.length; i++) {
    const h = `
      <div class="flex items-center bg-white p-3 rounded-lg border border-cyan-100">
        <div class="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold">1</div>
        <div class="ml-3">
          <h4 class="font-medium text-gray-800">${assessment.recommendedActions[i].title}</h4>
          <p class="text-sm text-gray-600">${assessment.recommendedActions[i].description}</p>
        </div>
      </div>`;
    $("#recommendedActionsDiv").append(h);
  }
};

// Once the DOM content is loaded, fetch the assessment data and update the UI
window.addEventListener("DOMContentLoaded", async () => {
  getAssessment(aid).then((assessment) => {
    appendAssessment(assessment);
  });
});
