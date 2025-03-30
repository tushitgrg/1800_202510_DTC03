const Createpost = async(e)=>{
    e.preventDefault()
    const titleInput = document.getElementById("post-title")
    const catInput = document.getElementById("post-category")
    const contentInput = document.getElementById("post-content")
    firebase.auth().onAuthStateChanged(async (user) => {
        const docref =await  db.collection("posts").add({
            category: catInput.value.split(','),
            content: contentInput.value,
            is_reply: false,
            username: user.displayName,
            postedAt: firebase.firestore.FieldValue.serverTimestamp(),
            likes:0,
            liked_by:[],
            userid: user.uid,
            replies : [""],
            title: titleInput.value
        })
       window.location.href= `/forum/post.html?id=${docref.id}`
    })
}
window.addEventListener('DOMContentLoaded',  () => {
document.getElementById('Createpostbtn').addEventListener('click',async(e)=>{

await Createpost(e)
})
})