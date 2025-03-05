const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require("cors")
const app = express();
const PORT = 3000;

sampleprompt = `You are an empathetic mental health assessment assistant. I will provide you with a set of questions and the corresponding responses from a mental health assessment survey. Your task is to analyze these responses and provide a thoughtful, detailed summary of the individual's mental health status. Please follow these guidelines:

Overview Assessment:

Evaluate the overall mood and emotional state based on numerical ratings and descriptive responses.
Summarize the key emotional indicators from the responses.
Emotional & Behavioral Insights:

Identify signs of anxiety, depression, stress, or other emotional challenges as indicated by the selected options and open-ended answers.
Consider lifestyle factors such as sleep, appetite changes, physical activity, and social support in your analysis.
Pattern Recognition:

Look for recurring themes or patterns in the responses that might indicate potential areas of concern.
Highlight any discrepancies between self-reported feelings and behaviors (e.g., low mood paired with insufficient self-care).
Recommendations & Next Steps:

Offer compassionate suggestions for self-care strategies.
If needed, recommend that the individual seek further evaluation from a mental health professional.
Clearly state that your analysis is informational and not a clinical diagnosis.
Tone & Disclaimer:

Use a non-judgmental, supportive, and clear language throughout your analysis.
Include a disclaimer noting that your response is not a substitute for professional mental health advice.
Give me the result in form of text, nothing else, DONOT ADD ANY EXTRA LINE
`

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors())

const genAI = new GoogleGenerativeAI(process.env.GEMINIAPI);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });



app.post('/api',async(req,res)=>{
    const payload = req.body;
    console.log(payload)
    const result = await model.generateContent(sampleprompt + JSON.stringify(payload));
    res.json(result.response.text()) 
    console.log(result.response.text());

})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  