const paramsString = window.location.search;
const searchParams = new URLSearchParams(paramsString);
const aid = searchParams.get('id')
const getAssessment = async (postid) => {


    data = undefined
    await db.collection("assessments").doc(postid).get().then((doc) => {
        data = doc.data()
      
        console.dir(data.ai)

    })
    return data.ai
}

const appendAssessment =(assessment)=>{
 

    $(".scoretxt").text(assessment.dimensionScores.mental)
    $(".progress-fill").css("width",`${assessment.dimensionScores.mental}%`)
    $("#progresstxt").css("left", `${assessment.dimensionScores.mental}%`)
    $("#scoreCategory").text(assessment.scoreCategory)
    for(let i=0; i<assessment.keyStruggles.length; i++){
        $("#strugglesList").append(`<li> ${assessment.keyStruggles[i].description}</li>`)
    }
    
                        for(let i=0; i<assessment.insights.length; i++){
                            h = `  <div class="bg-white p-4 rounded-lg border border-yellow-100">
                            <h4 class="font-medium text-gray-800 mb-2">${assessment.insights[i].title}</h4>
                            <p class="text-sm text-gray-600">${assessment.insights[i].description}</p>
                        </div>`
                        $('#insightsDiv').append(h)
                        }   
                        for(let i=0; i<assessment.strengths.length; i++){
                            h = `       <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">${assessment.strengths[i]}</span>`
                        $('#strengthsDiv').append(h)
                        } 
                        for(let i=0; i<assessment.recommendedActions.length; i++){
                            h = `     <div class="flex items-center bg-white p-3 rounded-lg border border-cyan-100">
                                <div class="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-cyan-600 font-bold">1</div>
                                <div class="ml-3">
                                    <h4 class="font-medium text-gray-800">${assessment.recommendedActions[i].title}</h4>
                                    <p class="text-sm text-gray-600">${assessment.recommendedActions[i].description}</p>
                                </div>
                            </div>  `
                        $('#recommendedActionsDiv').append(h)
                        } 
}

window.addEventListener('DOMContentLoaded', async () => {
    getAssessment(aid).then((assessment)=>{
        appendAssessment(assessment)
    
    })
})

