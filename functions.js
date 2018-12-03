	function removeElements(){
		var node = document.getElementById("topsection");
		while(node.firstChild){
			node.removeChild(node.firstChild);
		}
	}

  function initialize(){
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCRCQuWxeEUFXN6E_4Z7MDK2eTSjeVN3kQ",
      authDomain: "balanceproject-e98c1.firebaseapp.com",
      databaseURL: "https://balanceproject-e98c1.firebaseio.com",
      projectId: "balanceproject-e98c1",
      storageBucket: "balanceproject-e98c1.appspot.com",
      messagingSenderId: "166117576541"
    };

    firebase.initializeApp(config);
  }

  function getRefs(){
    //Sets up database references and gets the number of exercises uploaded
      database = firebase.database();
      //userdbRef = database.ref('Physician/'+physician+'/'+username);
      //uploadRef =  database.ref('Physician/'+physician+'/'+username+'/Exercises/AdminInfo/uploadCount');
      //uploadRef.on('value', function(snapshot) {
        //uploadCount = snapshot.val();
        //document.write(uploadCount);
  
   // });
  }

  function signOut(){
    localStorage.clear();
    firebase.auth().signOut()
      .catch(function (err) {
   // Handle errors
 });
  }

  function getUser(){
      firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    return user.uid;
    // ...
  } else {

    window.open("../index.html", "_self");
  }

});
  }

  function removeAllElements(){
    var node = document.getElementById("topsection");
    while(node.firstChild){
      node.removeChild(node.firstChild);
    }
  }

  function getPhysicians(){
    var clinicians = document.getElementById("clinician");
    var userId = firebase.auth().currentUser.uid;
	 return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
  	var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
  		database.ref("physicians").once('value', function(snapshot) {
      	snapshot.forEach(function(childSnapshot) {
        var childValue = childSnapshot.value;
        var childKey = childSnapshot.key;
        clinicians.options.add(new Option("0", "0", 0));
      });
    });
	});
    
  }


  function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    var intlCode = (match[1] ? '+1 ' : '')
    return [intlCode, '(', match[2], ')-', match[3], '-', match[4]].join('')
  }
  return null
}


  function daysBetween(date1, date2) {

 // adjust diff for for daylight savings
 var hoursToAdjust = Math.abs(date1.getTimezoneOffset() /60) - Math.abs(date2.getTimezoneOffset() /60);
 // apply the tz offset
 date2.addHours(hoursToAdjust); 

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)

    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}

// you'll want this addHours function too 

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}
  


function displayTopInfo(){
  var name = document.getElementById("name");
  var email = document.getElementById("email");
  var tel = document.getElementById("tel");
  var fall = document.getElementById("fall");
  var level = document.getElementById("level");
  name.innerHTML = localStorage.getItem("name");



  userRef.once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var childValue = childSnapshot.val();
        switch(childKey){
          case "email": 
            email.innerHTML = childValue;
          break;
          case "tel":
            childValue = formatPhoneNumber(childValue);
            tel.innerHTML = childValue;
          break;
          case "level":
            level.innerHTML = childValue;
          break;
          case "fall":
            if(childValue===0){
              fall.innerHTML = "None on Record";
            }
            else{
              fall.innerHTML = childValue;
            }
          break;
        }
      });
    });

 }


 
  function displayTitles(titles, table){
    var titleRow = table.insertRow(0);
    for (var i = 0; i<titles.length; i++){
      var cell = titleRow.insertCell(i);
      cell.innerHTML = titles[i];
    }

  }

  function searchForTitle(title, table){
    var searchSet;

    switch (table){
      case "A":
        searchSet = levelATitles;
      break;

      case "B":
        searchSet = levelBTitles;
      break;

      case "C":
        searchSet = levelCTitles;
      break;

      case "D":
        searchSet = levelDTitles;
      break;
    }

    for (var i = 0; i<searchSet.length; i++){
      if(searchSet[i]===title){
        return i;
      }
    }
    return null;
  }

  function sortExercises(){
    var level;
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dateSnapshot){
        var exerciseDate = dateSnapshot.key;
        var row;

        dateSnapshot.forEach(function(levelSnapshot){
          var exerciseName = levelSnapshot.key;
          var exerciseCount = levelSnapshot.val();
            if(exerciseName.toUpperCase() === 'LEVEL'){
              level = exerciseCount;
              switch(level){
                case "A":
                  row = levelA.insertRow(levelAIndex);
                  makeRowA(row);
                  levelALabel.style.display = "block";
                  levelA.style.display = "table";
                  
                break;
                case "B":
                  row = levelB.insertRow(levelBIndex);
                  makeRowB(row);
                  levelBLabel.style.display = "block";
                  levelB.style.display = "table";
                  
                break;
                case "C":
                  row = levelC.insertRow(levelCIndex);
                  makeRowC(row);
                  levelCLabel.style.display = "block";
                  levelC.style.display = "table";
                  
                break;
                case "D":
                  row = levelD.insertRow(levelDIndex);
                  makeRowD(row);
                  levelDLabel.style.display = "block";
                  levelD.style.display = "table";
                  
                break;
              }
            }

        });

        dateSnapshot.forEach(function(exerciseSnapshot){
          var exerciseName = exerciseSnapshot.key;
          var exerciseCount = exerciseSnapshot.val();
          if(exerciseCount === true){
              exerciseCount = "Yes";
            }
            else if(exerciseCount === false){
              exerciseCount = "No";
            }
          var index = searchForTitle(exerciseName, level);
          if(index === null){
            
          }
          else{
            row.deleteCell(index);
            var exercisecell = row.insertCell(index);
            exercisecell.innerHTML = exerciseCount;
            if(exerciseName === "Fell?"){
              if(exerciseCount === "Yes"){
                exercisecell.style.backgroundColor = "#FF7C7C";
              }
              else if(exerciseCount === "No"){
                exercisecell.style.backgroundColor = "#90FF7C";
              }
            }
          }
          
        });
        row.deleteCell(0);
        var dateCell = row.insertCell(0);
        dateCell.innerHTML = exerciseDate;
      });

      switch(level){
                case "A":
                  levelAIndex++;
                break;
                case "B":
                  levelBIndex++;
                break;
                case "C":
                  levelCIndex++;
                break;
                case "D":
                  levelDIndex++;
                break;
              }
    });

  }

  function makeRowA(rowIndex){
    var newRow = levelA.insertRow(rowIndex);
    for (var i = 0; i<levelATitles.length; i++){
      var cell = newRow.insertCell(0);
      console.log(i);
    }
    return newRow;
  }

function makeRowB(rowIndex){
    var newRow = levelB.insertRow(rowIndex);
    for (var i = 0; i<levelBTitles.length; i++){
      var cell = newRow.insertCell(0);
      console.log(i);
    }
    return newRow;
  }

function makeRowC(rowIndex){
    var newRow = levelC.insertRow(rowIndex);
    for (var i = 0; i<levelCTitles.length; i++){
      var cell = newRow.insertCell(0);
      console.log(i);
    }
    return newRow;
  }

  function makeRowD(rowIndex){
    var newRow = levelD.insertRow(rowIndex);
    for (var i = 0; i<levelDTitles.length; i++){
      var cell = newRow.insertCell(0);
      console.log(i);
    }
    return newRow;
  }

  function displayAExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
        console.log(dates.key);
        var level;
        dates.forEach(function(levels){
          var key = levels.key;
          var value = levels.val();
          //console.log(key);
          if(key == "Level"){
            level = value;
            //console.log("Level", level);
          }
        });
        if (level=="A"){
          var row = makeRowA(levelAIndex);
          levelAIndex++;
          levelALabel.style.display = "block";
          levelA.style.display = "table";
          console.log(levelAIndex);


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue = exercises.val();

            var titleIndex = searchForTitle(exerciseName, level);
            console.log(exerciseName, titleIndex);
            if(titleIndex==null && exerciseName !="Level"){
              console.log(exerciseName, "Not in Table");
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            console.log(date);
            dateCell.innerHTML = date;
        }

      });
    });
  }
  
  function displayBExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
        console.log(dates.key);
        var level;
        dates.forEach(function(levels){
          var key = levels.key;
          var value = levels.val();
          //console.log(key);
          if(key == "Level"){
            level = value;
            //console.log("Level", level);
          }
        });
        if (level=="B"){
          var row = makeRowB(levelBIndex);
          levelBIndex++;
          levelBLabel.style.display = "block";
          levelB.style.display = "table";
          console.log(levelBIndex);


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue = exercises.val();

            var titleIndex = searchForTitle(exerciseName, level);
            console.log(exerciseName, titleIndex);
            if(titleIndex==null && exerciseName !="Level"){
              console.log(exerciseName, "Not in Table");
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            console.log(date);
            dateCell.innerHTML = date;
        }

      });
    });
  }

  function displayCExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
        console.log(dates.key);
        var level;
        dates.forEach(function(levels){
          var key = levels.key;
          var value = levels.val();
          //console.log(key);
          if(key == "Level"){
            level = value;
            //console.log("Level", level);
          }
        });
        if (level=="C"){
          var row = makeRowC(levelCIndex);
          levelCIndex++;
          levelCLabel.style.display = "block";
          levelC.style.display = "table";
          console.log(levelCIndex);


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue = exercises.val();

            var titleIndex = searchForTitle(exerciseName, level);
            console.log(exerciseName, titleIndex);
            if(titleIndex==null && exerciseName !="Level"){
              console.log(exerciseName, "Not in Table");
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            console.log(date);
            dateCell.innerHTML = date;
        }

      });
    });
  }

  function displayDExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
        console.log(dates.key);
        var level;
        dates.forEach(function(levels){
          var key = levels.key;
          var value = levels.val();
          //console.log(key);
          if(key == "Level"){
            level = value;
            //console.log("Level", level);
          }
        });
        if (level=="D"){
          var row = makeRowD(levelDIndex);
          levelDIndex++;
          levelDLabel.style.display = "block";
          levelD.style.display = "table";
          console.log(levelDIndex);


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue = exercises.val();

            var titleIndex = searchForTitle(exerciseName, level);
            console.log(exerciseName, titleIndex);
            if(titleIndex==null && exerciseName !="Level"){
              console.log(exerciseName, "Not in Table");
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            console.log(date);
            dateCell.innerHTML = date;
        }

      });
    });
  }


    function getUploads(){
    displayTitles(["Date Last Modified:", "View Contents", "Download File:"], uploads);
    var rowIndex = 1;

    database.ref(user+"/dataUploads").once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var childValue = childSnapshot.val();

        if(childKey!=null){
          uploadData.style.display = "table";
          uploadDataLabel.style.display = "flex";
        }
        var row = uploads.insertRow(rowIndex);
        rowIndex++;
        var dateCell = row.insertCell(0);
        var contentsCell = row.insertCell(1);
        var downloadCell = row.insertCell(2);
        dateCell.innerHTML = childKey;

        var viewdatabtn = document.createElement('input');
        viewdatabtn.type = "button";
        viewdatabtn.className = "viewfilebtn";
        viewdatabtn.value = "View File";
        viewdatabtn.onclick = function() {viewFile(childValue, childKey)};
        contentsCell.appendChild(viewdatabtn);

        var downloadbtn = document.createElement('input');
        downloadbtn.type = "button";
        downloadbtn.className = "btn";
        downloadbtn.value = "Download";
        downloadbtn.onclick = function() {downloadFile(childValue)};
        downloadCell.appendChild(downloadbtn);

        var content = document.getElementById("content");


      });
    });
  }

  function viewFile(link, date){
    var storageRef = firebase.storage().ref(link);
    storageRef.getDownloadURL().then(function(url){
      console.log(url);
      localStorage.setItem("url", url);
      localStorage.setItem("date", date);
      window.open("viewUpload.html", "_self");

    });
  }

  function downloadFile(link){
    //console.log(link);
    var storageRef = firebase.storage().ref(link);
    storageRef.getDownloadURL().then(function(url){
      console.log(url);
      window.open(url, "_self");
    });

  }

  function storeDatabaseItem(path, name){
    console.log(path);
    var item = localStorage.getItem(path);
    if(item ===null){
      database.ref(path).once('value').then(function(snapshot){
        item = snapshot.val();
        console.log(item);
        localStorage.setItem(name, item);
        return snapshot.val();
      });
    }
    else{
      return item;
    }
  }

