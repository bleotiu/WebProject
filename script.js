const formName = document.getElementById('formName');
const formDesc = document.getElementById('formDesc');
const addButton = document.getElementById('addButton');
const showButton = document.getElementById('showButton');
let generateButton = document.getElementById('generateButton');
let updateButton = document.getElementById('updateButton');
let exlist = document.getElementById('exlist');
let listall = document.getElementById('listall');

//Fetch the exercise
function getExercises(){
	fetch('http://localhost:3000/exercises')
        .then(function (response) {
            // Trasform server response to get the exercises
            response.json().then(function (exercises) {
                appendExercisesToDOM(exercises);
            });
        });
} 

//post exercise
function postExercise(){
	//  Create a new post object.
    const postObject = {
        name: formName.value,
        desc: formDesc.value
    }

    fetch('http://localhost:3000/exercises', {
        method: 'post',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(postObject)
    }).then(function () {
        // Get the new exercise list
        getExercises();
        resetForm();
    });
}

function deleteExercise(id){
	//delete exercise
	fetch(`http://localhost:3000/exercises/${id}`, {
		method: 'DELETE',
	}).then(function(){
		//Get the new exercises list
		getExercises();
	});
}

//update exercise
function updateExercise(id){
	//  Create a new put object.
    const putObject = {
        name: formName.value,
        desc: formDesc.value
    }

    fetch(`http://localhost:3000/exercises/${id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(putObject)
    }).then(function () {
        //getExercises();
        showAll();
        addButton.disabled = false;
        updateButton.disabled = true;
        clearUpdateButtonEvents();
        resetForm();
    });
}

function editExercise(exercise){
	//  Copy exercise information to form.
    formName.value = exercise.name;
    formDesc.value = exercise.desc;
    // disable add button
    addButton.disabled = true;

    clearUpdateButtonEvents();

    updateButton.disabled = false;
    updateButton.addEventListener('click', function () {
        updateExercise(exercise.id)
    });
}

function appendExercisesToDOM(exercises) {
    while (listall.firstChild) {
        listall.removeChild(listall.firstChild);
    }

    // create and append tags
    for (let i = 0; i < exercises.length; i++) {
        //  Create new description&name objects.
        let name = document.createElement('p');
        name.innerText = exercises[i].name + ':' + exercises[i].desc;
        name.className = "workgen-p";

        //  Create edit&delete buttons.
        let editButton = document.createElement('button');
        editButton.addEventListener('click', function () {
            editExercise(exercises[i])
        });
        editButton.innerText = 'Edit';
        editButton.className = 'script-btn';
        let deleteButton = document.createElement('button')
        deleteButton.addEventListener('click', function () {
            deleteExercise(exercises[i].id)
        });
        deleteButton.innerText = 'Delete';
        deleteButton.className = 'script-btn';
        //  Create a container for the new nodes.
        let container = document.createElement('div');
        container.appendChild(name);
        container.appendChild(editButton);
        container.appendChild(deleteButton);

        listall.appendChild(container);
    }
}

//reset form
function resetForm() {
	formName.value = '';
	formDesc.value = '';
}


function clearUpdateButtonEvents() {
	let newUpdateButton = updateButton.cloneNode(true);
	updateButton.parentNode.replaceChild(newUpdateButton, updateButton);
	updateButton = document.getElementById('updateButton');
}

var exerciseList;
function showAll (){
	//delete what was before in listall
	while (listall.firstChild){
		listall.removeChild(listall.firstChild);
	}
	getExercises();
}

var workout;
function generateWorkout(){
	fetch('http://localhost:3000/exercises')
        .then(function (response) {
            // Trasform server response to get the exercises
            response.json().then(function (exercises) {
                exerciseList = exercises;
                randomWorkout (exerciseList);
            });
        });
}

function randomWorkout(exerciseList){
	while (exlist.firstChild){
		exlist.removeChild(exlist.firstChild);
	}
	var selected = new Array(exerciseList.length);
	var workSize = 4 + Math.floor(Math.random() * 4);
	if (workSize > exerciseList.length)
		workSize = exerciseList.length;
	for (let i = 0; i < exerciseList.length; i++)
		selected[i] = 0;
	for (let i = 0; i < workSize; i++){
		let x = Math.floor(Math.random() * exerciseList.length);
		while (selected[x] == 1){
			++x;
			if (x == exerciseList.length)
				x = 0;
		}
		let name = document.createElement('p');
		name.innerText = exerciseList[x].name + ' : ' + exerciseList[x].desc;
		name.className = "workgen-exlist-p";
		exlist.appendChild(name);
		selected[x] = 1;
	}
}

addButton.addEventListener('click', postExercise);
generateButton.addEventListener('click', generateWorkout);
showButton.addEventListener('click', showAll);

//getExercises();




