const input = document.querySelector('input').value;
const button = document.querySelector('button');
const choices = [];

button.addEventListener('click', (event) => {
    event.preventDefault();

    choices.push(input);

    console.log(choices);
});

