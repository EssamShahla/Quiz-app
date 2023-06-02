let countSpan = document.querySelector(".quiz-app .count span");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let bullets = document.querySelector(".bullets");
let bulletsContainer = document.querySelector(".bullets .spans");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;
// I use the xmlHttpRequest to get the questions from json object (native request not in ajax)
function getQuestions(){
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function (){
        if(this.readyState == 4 && this.status == 200){
            let JSObjectQuestions = JSON.parse(this.responseText);
            let questionsLength = JSObjectQuestions.length;
            // step of creating bullets and set questions count
            createBullets(questionsLength);

            // add Question Data
            addQuestionData(JSObjectQuestions[currentIndex] , questionsLength);

            // Start CountDown
            countdown(5, questionsLength);

            //
            submitButton.onclick = () =>{
                let theRightAnswer =JSObjectQuestions[currentIndex].right_answer;
                currentIndex++;

                // when clicking , check the answer
                checkAnswer(theRightAnswer , questionsLength);

                quizArea.innerHTML = "";
                answersArea.innerHTML = "";

                // Add questions Data
                addQuestionData(JSObjectQuestions[currentIndex] , questionsLength);

                // handle bullets when move to the next ques
                handleBullet();

                // Start CountDown
                clearInterval(countdownInterval);
                countdown(3, questionsLength);

                // show results
                showResults(questionsLength);
            }
        }
    }

    myRequest.open("GET" , "html_questions.json");
    myRequest.send();
}

getQuestions();

function createBullets(num){
    countSpan.innerHTML = num;


    //  create the bullets span DOM
    for(let i = 0 ; i < num ; i++){
        
        let theBullet = document.createElement("span");
        
        if(i == 0){
            theBullet.className ="on";
        }

        bulletsContainer.appendChild(theBullet);
    }
}

function addQuestionData(object , count){
    if(currentIndex < count){
        let questionTitle = document.createElement("h2");
    let questionText = document.createTextNode(object.title);
    
    //Append text to h2
    questionTitle.appendChild(questionText);
    // Append h2 to quiz-area
    quizArea.appendChild(questionTitle);

    //create the answers
    for(let i = 1 ; i<=4 ; i++){
        let mainDiv = document.createElement("div");

        mainDiv.className = "answer";

        //create radio input
        let radioInput = document.createElement("input");
        //add type + name + id + data-attribute
        radioInput.type = 'radio';
        radioInput.name = 'question';
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = object[`answer_${i}`];

        //create the label 
        let theLabel = document.createElement("label");
        theLabel.htmlFor = `answer_${i}`;
        //create label text
        let labelText = document.createTextNode(object[`answer_${i}`]);
        //add label text to the label
        theLabel.appendChild(labelText);
        //add the complete label div and the complete answer div to the answersArea
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLabel);
        answersArea.appendChild(mainDiv);
    };
    }
}

function checkAnswer(rightAnswer , count){
    let answers = document.getElementsByName('question');
    let theChoosenAnswer ;

    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked){
            theChoosenAnswer = answers[i].dataset.answer;
        }
    }
    if(theChoosenAnswer == rightAnswer){
        rightAnswers++;
    }
}

function handleBullet(){
    let bulletSpans = document.querySelectorAll(".bullets .spans span");
    let arrayOfSpans = Array.from(bulletSpans);

    arrayOfSpans.forEach((span , index) => {
        if(currentIndex === index){
            span.className = "on";
        }
    });
}

function showResults(count){
    let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    answersArea.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswers > count / 2 && rightAnswers < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
    } else if (rightAnswers === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}

function countdown(duration, count) {
    if (currentIndex < count) {
      let minutes, seconds;
      countdownInterval = setInterval(function () {
        minutes = parseInt(duration / 60);
        seconds = parseInt(duration % 60);
  
        minutes = minutes < 10 ? `0${minutes}` : minutes;
        seconds = seconds < 10 ? `0${seconds}` : seconds;
  
        countdownElement.innerHTML = `${minutes}:${seconds}`;
  
        if (--duration < 0) {
          clearInterval(countdownInterval);
          submitButton.click();
        }
      }, 1000);
    }
  }