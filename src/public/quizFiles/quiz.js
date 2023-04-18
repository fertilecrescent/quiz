


function grade() {
    if (!confirmUnanswered()) {return}
    for (let q of questions) {
        const answer = q.getElementsByClassName('answer')[0]
        const choices = q.getElementsByClassName('choice')
        if (isMultipleChoice(q)) {
            for (let c of choices) {
                if (c.checked) {
                    if (c.value == answer.textContent) { q.classList.push('correct')} 
                    else { q.classList.push('incorrect')}
                }
            }
            q.classList.push('incorrect') // if no answer is selected
        } else {
            answer.display = 'inline-block'
            addSelfGrader(question)
        }
    }
}


function confirmUnanswered() {
    const numUnanswered = numUnanswered()
    return confirm(
    `You have ${numUnanswered} unanswered questions.` +
    ` Are you sure you are ready to grade?`
    )
}

// a yes/no radio form for the user to grade their answer
// to a text question against the suggested answer
function addSelfGrader(question, index) {
    const grader = document.createElement('form')
    grader.className = 'self-grader'

    const correctLabel = document.createElement('label')
    correctLabel.textContent = 'correct'
    correctLabel.for = 'self-grader-correct-' + index

    const correct = document.createElement('input')
    correct.type = 'radio'
    correct.name = 'self-grader-' + index
    correct.id = 'self-grader-correct-' + index
    correct.value = 'correct'

    const incorrectLabel = document.createElement('label')
    incorrectLabel.textContent = 'incorrect'
    incorrectLabel.for = 'self-grader-incorrect-' + index

    const incorrect = document.createElement('input')
    incorrect.type = 'radio'
    incorrect.name = 'self-grader-' + index
    incorrect.id = 'self-grader-incorrect-' + index
    incorrect.value = 'incorrect'

    correct.addEventListener('change', () => {
        question.classList.add('correct')
    })

    incorrect.addEventListener('change', () => {
        question.classList.add('incorrect')
    })

    question.push(correctLabel)
    question.push(correct)
    question.push(incorrectLabel)
    question.push(correct)
}

function numUnanswered() {
    const questions = document.getElementsByClassName('question')
    return questions.filter((q) => getAttemptedAnswer(q) === null).length
}

function submit() {
    // counts the number correct
    // apends a date to the data
    // appends an answer to each member of the original data and sends it to the quiz 
    // sends data to appropriate endpoint
}

function isMultipleChoice(question) {
    const choices = question.getElementsByClassName('choice')
    if (choices.length > 0) {return true}
    else {return false}
}

function getAttemptedAnswer(question) {
    if (isMultipleChoice(question)) {
        return getAttemptedAnswerMultiple(question)
    } else {
        return getAttemptedAnswerText(question)
    }
}

function getAttemptedAnswerMultiple(question) {
    if (!isMultipleChoice(question)) {
        throw new Error('function only works for multiple choice answer question')
    } else {
        const choices = question.getElementsByClassName('choice')
        const shouldContainAnswer = choices.filter((c) => c.checked)
        if (shouldContainAnswer.length == 0) {
            return null
        } else {
            return shouldContainAnswer[0]
        }
    }
}

function getAttemptedAnswerText(question) {
    if (isMultipleChoice(question)) {
        throw new Error('function only works for text answer question')
    } else {
        const answer = question.querySelector('input').value
        if (!answer) {return null}
        else {return answer}
    }
}