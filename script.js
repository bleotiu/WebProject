const htmlPath = window.location.pathname;
const htmlName = htmlPath.split("/").pop();
const standardFooter = document.getElementById("footer").innerText;

function isWord(s){
    if (s.length < 1)
        return false;
    var ok = 1;
    for(var it = 0; it < s.length; ++it){
        if (s[it].toLowerCase() == s[it].toUpperCase())
            ok = 0;
    }
    if (ok == 0)
        return false;
    return true;
}

function printWordCounter(){
    var htmlText = document.getElementsByTagName("html")[0].innerText;
    var wordList = htmlText.split('\n').join(' ').split(' ');
    var counter = 0;
    for (var it = 0; it < wordList.length; ++it){
        if (isWord(wordList[it]) == true)
            ++counter;
    }
    var footer = document.getElementById("footer");
    footer.innerText = standardFooter + "\n" + counter.toString() + " words on the page!";
}

if (htmlName == "workgen.html"){ ///The Web Application Page
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
            printWordCounter()
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
            name.innerText = exercises[i].name + ' : ' + exercises[i].desc;
            name.className = "workgen-p";

            //  Create edit&delete buttons.
            let editButton = document.createElement('button');
            editButton.addEventListener('click', function () {
                editExercise(exercises[i])
            });
            editButton.innerText = 'Edit ';
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
        printWordCounter();
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
        printWordCounter();
    }

    ///Listeners
    addButton.addEventListener('click', postExercise);
    generateButton.addEventListener('click', generateWorkout);
    showButton.addEventListener('click', showAll);

    //getExercises();
}

if (htmlName == "contact.html"){
    var decoded = false;

    function addToChar (c, k){
        //console.log(String.fromCharCode(c.charCodeAt(0) + k))
        return String.fromCharCode(c.charCodeAt(0) + k);
    }

    function changeState (state, word){
        if (word == "/head"){
            return false;
        }
        if (word == "/footer"){
            return false;
        }
        //console.log(word.length)
        if (word.length >= 4){
            //console.log(word)
            var temp = "";
            for (var it = 0; it < 4; ++it)
                temp = temp + word[it];
            //console.log(temp);
            if (temp == "head")
                return true;
            if (temp == "foot")
                return true;
        }
        return state;
    }

    function encode(){
        var doc = document.getElementsByTagName("html")[0];
        var newHTML = "";
        var blocked = false;
        var currentName;
        for (var it = 0; it < doc.innerHTML.length; ++it){
            if (doc.innerHTML[it] == '<'){
                currentName = "";
                newHTML = newHTML + doc.innerHTML[it];
                ++it;
                while (doc.innerHTML[it] != '>'){
                    currentName = currentName + doc.innerHTML[it];
                    newHTML = newHTML + doc.innerHTML[it];
                    ++it;
                }
                //console.log(currentName)
                blocked = changeState(blocked, currentName);
                newHTML = newHTML + doc.innerHTML[it];
            }
            else{
                if (doc.innerHTML[it] == ' ' || doc.innerHTML[it] == '\n')
                    newHTML = newHTML + doc.innerHTML[it];
                else{
                    if (blocked == false)
                        newHTML = newHTML + addToChar(doc.innerHTML[it], 3);
                    else
                        newHTML = newHTML + doc.innerHTML[it];
                }
            }
        }
        doc.innerHTML = newHTML;
        decoded = false;
    }

    function decode(){
        //console.log("bun");
        if (decoded == false){
            var doc = document.getElementsByTagName("html")[0];
            var newHTML = "";
            var blocked = false;
            var currentName;
            for (var it = 0; it < doc.innerHTML.length; ++it){
                if (doc.innerHTML[it] == '<'){
                    currentName = "";
                    newHTML = newHTML + doc.innerHTML[it];
                    ++it;
                    while (doc.innerHTML[it] != '>'){
                        currentName = currentName + doc.innerHTML[it];
                        newHTML = newHTML + doc.innerHTML[it];
                        ++it;
                    }
                    blocked = changeState(blocked, currentName);
                    newHTML = newHTML + doc.innerHTML[it];
                }
                else{
                    if (doc.innerHTML[it] == ' ' || doc.innerHTML[it] == '\n')
                        newHTML = newHTML + doc.innerHTML[it];
                    else{
                        if (blocked == false)
                            newHTML = newHTML + addToChar(doc.innerHTML[it], -3);
                        else
                            newHTML = newHTML + doc.innerHTML[it];
                    }
                }
            }
            doc.innerHTML = newHTML;
            decoded = true;
        }
    }

    function checkPassword(e){
        if (e.keyCode == 13){
            var currentDate = new Date();
            var year = String(currentDate.getFullYear());
            var month = String(currentDate.getMonth() + 1).padStart(2, '0');
            var day = String(currentDate.getDate()).padStart(2, '0');
            correctPassword = year[2] + year[3] + "#" + day + "#" + month;
            //console.log(correctPassword)
            password = document.getElementById("password");
            var s = password.value;
            //console.log(s);
            if (s == correctPassword){
                decode();
            }
        }
    }

    encode()
    //password.addEventListener("onkeypress", checkPassword(event));
}

if (htmlName == "about.html"){
    function moveImage(image, x, y){
        //console.log(x);
        //var image = document.getElementById("biceps");
        image.style.position = "absolute";
        image.style.top = x + 'px';
        image.style.left = y + 'px';
    }


    var image = document.getElementById("biceps");
    var X = 250, Y = 250, radians = 0, radius = 200, speed = 0.01, ticks = 0;
    var newX, newY;

    function randomValue(){
        return Math.floor(Math.random() * Math.floor(314));
    }

    function spinImage(){
        newX = Math.floor(X + radius * Math.sin(radians));
        newY = Math.floor(Y + radius * Math.cos(radians));
        moveImage(image, newX, newY);
        clearTimeout();
        setTimeout(spinImage, 2);
        radians += speed;
        ++ticks;
        if (radians > 3141592)
            radians = 0;
        if (ticks > 500){
            X = randomValue();
            Y = randomValue();
            radius = randomValue();
            ticks = 0;
        }
    }
    spinImage();
    
    var hideButton = document.getElementById("hideButton");
    var hidden = true;
    function hideImages(){
        console.log("merge");
        if(hidden == false){
            imageList = document.getElementsByTagName("img");
            for (var it = 0; it < imageList.length; ++it)
                imageList[it].style.visibility = 'hidden';
            hidden = true;
        }
        else{
            imageList = document.getElementsByTagName("img");
            for (var it = 0; it < imageList.length; ++it)
                imageList[it].style.visibility = 'visible';
            hidden = false;
        }
    }

    hideButton.addEventListener("click", hideImages);
}

let menuList = document.getElementById("menulist");
for (var it = 0; it < menuList.childNodes.length; ++it){
    var item = menuList.childNodes[it];
    if (item.nodeName == "LI"){
        var currentReference = item.firstChild.href.split("/").pop();
        if (currentReference == htmlName){
            item.firstChild.className = "current";
        }
    }
}


printWordCounter();
