const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore')


const highScore = JSON.parse(localStorage.getItem('highScores')) || [];
const MAX_HIGHSCORE = 5; // top 5

finalScore.textContent = mostRecentScore

username.addEventListener('keyup', ()=>{
    saveScoreBtn.disabled = !username.value
})
const saveScore = (e) =>{
    e.preventDefault()

    const score = {
        score: mostRecentScore,
        name: username.value
    };

    highScore.push(score); // push/save scores in array
    highScore.sort((a, b) =>  b.score - a.score) // sort array in decreasing order
    highScore.splice(MAX_HIGHSCORE); // set a limit to highscores
    
    localStorage.setItem('highScores', JSON.stringify(highScore));
    
    window.location.assign('index.html')
}