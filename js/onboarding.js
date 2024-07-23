document.addEventListener('DOMContentLoaded', () => {
  let currentStep = 0;
  let responses = [];

  const onboardingData = [
    {
      type: 'info',
      title: "Bienvenid@ a Mindful Science",
      content: "¡Empecemos! Ayúdanos, te ayudamos. Responda estas pocas preguntas para personalizar tu experiencia."
    },
    {
      type: 'question',
      questionType: 'single',
      question: "¿Tienes experiencia de meditación?",
      answers: ["Ninguna", "Poca", "Mucha"]
    },
    {
      type: 'question',
      questionType: 'multiple',
      question: "¿Qué es lo que más necesitas ahora mismo?",
      answers: ["Encontrar una mayor calma", "Reducir mi estrés y nerviosismo", "Dormir mejor y descansar", "Reducir mi ansiedad", "Mejorar mi concentración", "Otro"]
    },
    {
      type: 'question',
      questionType: 'single',
      question: "¿Cuál es tu mejor momento del día para meditar?",
      answers: ["En la mañana", "En la tarde", "En la noche"]
    },
    // Add more questions and answers as needed
  ];

  function showStep(step) {
    document.querySelectorAll('.step').forEach((element, index) => {
      element.classList.toggle('active', index === step);
    });
    // Hide "Skip for now" button after the first step
    const skipButton = document.getElementById('skip-btn');
    if (step > 0) {
      skipButton.style.display = 'none';
    } else {
      skipButton.style.display = 'inline-block';
    }
    // Hide or show the "Continue" button based on step type
    const continueButton = document.getElementById('continue-btn');
    if (onboardingData[step].type === 'info') {
      continueButton.style.display = 'inline-block';
    } else {
      continueButton.style.display = 'none';
      checkIfAnyOptionSelected();
    }
  }

  function generateSteps(data) {
    const app = document.getElementById('onboarding-app');
    data.forEach((item, index) => {
      const step = document.createElement('div');
      step.className = 'step';
      if (index === 0) step.classList.add('active');

      if (item.type === 'info') {
        const title = document.createElement('h1');
        title.innerText = item.title;
        step.appendChild(title);

        const content = document.createElement('p');
        content.innerText = item.content;
        step.appendChild(content);
      } else if (item.type === 'question') {
        const question = document.createElement('h2');
        question.innerText = item.question;
        step.appendChild(question);

        item.answers.forEach(option => {
          const label = document.createElement('label');
          const input = document.createElement('input');
          input.type = item.questionType === 'multiple' ? 'checkbox' : 'radio';
          input.name = `step-${index}`;
          input.value = option;
          input.id = `option-${index}-${option}`;
          input.addEventListener('change', () => {
            checkIfAnyOptionSelected();
          });
          label.appendChild(input);
          const customLabel = document.createElement('span');
          customLabel.innerText = option;
          customLabel.setAttribute('for', input.id);
          label.appendChild(customLabel);
          step.appendChild(label);
          step.appendChild(document.createElement('br'));
        });
      }

      app.appendChild(step);
    });
  }

  function checkIfAnyOptionSelected() {
    const currentStepElement = document.querySelectorAll('.step')[currentStep];
    const selectedOptions = currentStepElement.querySelectorAll('input:checked, input[type="radio"]:checked');
    const continueButton = document.getElementById('continue-btn');
    if (selectedOptions.length > 0) {
      continueButton.style.display = 'inline-block';
    } else {
      continueButton.style.display = 'none';
    }
  }

  function collectResponses() {
    responses = [];
    document.querySelectorAll('.step').forEach((step, index) => {
      if (onboardingData[index].type === 'question') {
        const selectedOptions = Array.from(step.querySelectorAll('input:checked, input[type="radio"]:checked')).map(input => input.value);
        responses.push({ step: index, responses: selectedOptions });
      }
    });
  }

  function saveResponses() {
    collectResponses();
    const data = {
      action: 'save_onboarding_data',
      security: onboarding_ajax.nonce,
      responses: JSON.stringify(responses) // Encode as JSON string
    };

    fetch(onboarding_ajax.ajax_url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      body: new URLSearchParams(data).toString()
    })
    .then(response => response.json())
    .then(response => {
      if (response.success) {
        window.location.href = dashboardURL;
      } else {
        alert('Failed to save responses.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  function validateStep() {
    const currentStepElement = document.querySelectorAll('.step')[currentStep];
    if (onboardingData[currentStep].type === 'info') {
      return true;
    } else {
      const selectedOptions = currentStepElement.querySelectorAll('input:checked, input[type="radio"]:checked');
      return selectedOptions.length > 0;
    }
  }

  document.getElementById('continue-btn').addEventListener('click', () => {
    if (validateStep()) {
      if (currentStep < onboardingData.length - 1) {
        currentStep++;
        showStep(currentStep);
      } else {
        saveResponses();
      }
    } else {
      alert('Por favor seleccione al menos una opción para continuar.'); // Updated message
    }
  });

  document.getElementById('skip-btn').addEventListener('click', () => {
    window.location.href = skipURL;
  });

  generateSteps(onboardingData);
  showStep(currentStep); // Initialize the first step correctly
});
