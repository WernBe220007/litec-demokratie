// Fetch the questions from the server
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        let currentQuestionIndex = 0;
        let correctAnswers = 0;
        let incorrectAnswers = 0;

        // Function to display a question
        function displayQuestion(question) {
            // Clear the body
            document.body.innerHTML = '';

            // Create a flex container
            let container = document.createElement('div');
            container.className = 'flex flex-col items-center justify-center min-h-screen';
            document.body.appendChild(container);

            // Create the question title
            let title = document.createElement('h1');
            title.textContent = question.title;
            title.className = 'text-2xl md:text-4xl font-bold mb-4 text-center';
            container.appendChild(title);

            // Create a div for the answers
            let answersDiv = document.createElement('div');
            answersDiv.className = 'flex flex-col items-left justify-center space-y-4';
            container.appendChild(answersDiv);

            // Create the answer radio buttons
            question.answers.forEach((answer, index) => {
                let label = document.createElement('label');
                label.className = 'block mb-2 bg-white shadow-md rounded-lg p-4 cursor-pointer';

                let radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = 'answer';
                radio.value = index;
                radio.className = 'mr-2';
                radio.style.display = 'none'; // Hide the default radio button
                label.appendChild(radio);

                let text = document.createTextNode(answer);
                label.appendChild(text);

                // Add a click event listener to the label
                label.addEventListener('click', () => {
                    // Remove the 'bg-blue-200' class from all labels
                    document.querySelectorAll('label').forEach((label) => {
                        label.classList.remove('bg-blue-200');
                    });

                    // Add the 'bg-blue-200' class to the clicked label
                    label.classList.add('bg-blue-200');
                });

                answersDiv.appendChild(label);
            });

            // Create the "Next" button
            let nextButton = document.createElement('button');
            nextButton.textContent = 'Weiter';
            nextButton.className = 'px-8 py-4 text-2xl bg-blue-500 text-white m-4 absolute bottom-0 right-0 rounded-full';
            container.appendChild(nextButton);

            // Create the progress bar
            let progressBar = document.createElement('div');
            progressBar.className = 'h-1 bg-gray-200 absolute bottom-0 left-0 w-full';
            document.body.appendChild(progressBar);

            let progress = document.createElement('div');
            progress.className = 'h-full bg-blue-500';
            progress.style.width = `${(currentQuestionIndex / data.questions.length) * 100}%`;
            progressBar.appendChild(progress);

            // Add an event listener to the "Next" button
            nextButton.addEventListener('click', () => {
                let selectedAnswer = document.querySelector('input[name="answer"]:checked').value;
                if (selectedAnswer == question.correctIndex) {
                    correctAnswers++;
                    displayInterimPage(true, question.answers[question.correctIndex]);
                } else {
                    incorrectAnswers++;
                    displayInterimPage(false, question.answers[question.correctIndex]);
                }
            });
        }

        function displayInterimPage(isCorrect, correctAnswer) {
            // Clear the body
            document.body.innerHTML = '';

            // Create a flex container
            let container = document.createElement('div');
            container.className = 'flex flex-col items-center justify-center min-h-screen';
            document.body.appendChild(container);
            // Checkmark or X svg
            let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('class', 'h-16 md:h-24 w-16 md:w-24 mb-4');
            svg.setAttribute('viewBox', '0 0 24 24');
            let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            if (isCorrect) {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'green');
                path.setAttribute('d', 'M5 13l4 4L19 7');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'red');
                path.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
            svg.appendChild(path);
            container.appendChild(svg);

            // Create the result title
            let title = document.createElement('h1');
            title.textContent = isCorrect ? 'Das ist richtig!' : 'Das ist leider falsch.';
            title.className = `text-2xl md:text-4xl font-bold mb-4 text-center ${isCorrect ? 'text-green-500' : 'text-red-500'}`;
            container.appendChild(title);

            // If the answer is incorrect, show the correct answer
            if (!isCorrect) {
                let correctAnswerText = document.createElement('p');
                correctAnswerText.textContent = `Die richtige Antwort war: ${correctAnswer}`;
                correctAnswerText.className = 'text-center';
                container.appendChild(correctAnswerText);
            }

            // Create the "Next" button
            let nextButton = document.createElement('button');
            nextButton.textContent = 'Weiter';
            nextButton.className = 'px-8 py-4 text-2xl bg-blue-500 text-white m-4 absolute bottom-0 right-0 rounded-full';
            container.appendChild(nextButton);

            // Create the progress bar
            let progressBar = document.createElement('div');
            progressBar.className = 'h-1 bg-gray-200 absolute bottom-0 left-0 w-full';
            document.body.appendChild(progressBar);

            let progress = document.createElement('div');
            progress.className = 'h-full bg-blue-500';
            progress.style.width = `${(currentQuestionIndex / data.questions.length) * 100}%`;
            progressBar.appendChild(progress);

            // Add an event listener to the "Next" button
            nextButton.addEventListener('click', () => {
                currentQuestionIndex++;
                if (currentQuestionIndex < data.questions.length) {
                    displayQuestion(data.questions[currentQuestionIndex]);
                } else {
                    displayResults();
                }
            });
        }

        // Function to display the results
        function displayResults() {
            // Clear the body
            document.body.innerHTML = '';

            // Create a flex container
            let container = document.createElement('div');
            container.className = 'flex flex-col items-center justify-center min-h-screen';
            document.body.appendChild(container);

            // Create the congratulations title
            let title = document.createElement('h1');
            title.textContent = 'Gratulation!';
            title.className = 'text-2xl md:text-4xl font-bold mb-4 text-center';
            container.appendChild(title);

            // Create the results text
            let results = document.createElement('p');
            results.textContent = `Sie haben ${correctAnswers} Fragen korrekt und ${incorrectAnswers} Fragen inkorrekt beantwortet.`;
            results.className = 'text-center';
            container.appendChild(results);

            // Calculate the percentage of correct answers
            let percentage = (correctAnswers / data.questions.length) * 100;

            // Create the percentage text
            let percentageText = document.createElement('p');
            percentageText.textContent = `Das entspricht einer Quote von ${percentage}%`;
            percentageText.className = 'text-center';
            container.appendChild(percentageText);

            // Home button, redirects to index.html
            let homeButton = document.createElement('a');
            homeButton.textContent = 'Zurück zur Startseite';
            homeButton.href = 'index.html';
            homeButton.className = 'px-8 py-4 text-2xl bg-blue-500 text-white m-4 rounded-full';
            container.appendChild(homeButton);
        }

        // Display the first question
        displayQuestion(data.questions[currentQuestionIndex]);
    });