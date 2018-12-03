	
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
            if(childValue===false){
              fall.innerHTML = "None on Record";
            }
            else{
              var date = moment().format("YYYY-MM-DD");
              fall.innerHTML = date;
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

      case "add":
        searchSet = additionalTitles;
      break;
    }

    for (var i = 0; i<searchSet.length; i++){
      if(searchSet[i]===title){
        return i;
      }
    }
    return null;
  }

  function makeRowA(rowIndex){
    var newRow = levelA.insertRow(rowIndex);
    for (var i = 0; i<levelATitles.length; i++){
      var cell = newRow.insertCell(0);
    }
    return newRow;
  }

function makeRowB(rowIndex){
    var newRow = levelB.insertRow(rowIndex);
    for (var i = 0; i<levelBTitles.length; i++){
      var cell = newRow.insertCell(0);
    }
    return newRow;
  }

function makeRowC(rowIndex){
    var newRow = levelC.insertRow(rowIndex);
    for (var i = 0; i<levelCTitles.length; i++){
      var cell = newRow.insertCell(0);
    }
    return newRow;
  }

  function makeRowD(rowIndex){
    var newRow = levelD.insertRow(rowIndex);
    for (var i = 0; i<levelDTitles.length; i++){
      var cell = newRow.insertCell(0);
    }
    return newRow;
  }

  function makeRowAdditional(rowIndex){
    var newRow = additional.insertRow(rowIndex);
    for (var i = 0; i<additionalTitles.length; i++){
      var cell = newRow.insertCell(0);
    }
    return newRow;
  }

  function displayAExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
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
          var additionalItems = false;
          levelALabel.style.display = "block";
          levelA.style.display = "table";


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue
            if(exercises.val()==="YES"){
              exerciseValue = "Complete"
            }
            else if(exercises.val()==="NO"){
              exerciseValue = "Incomplete";
            }

            var titleIndex = searchForTitle(exerciseName, level);
            if(titleIndex==null && exerciseName !="Level"){
              if(!additionalItems){
                var additionalRow = makeRowAdditional(additionalIndex);
                additionalRow.deleteCell(0);
                var additionalDate = additionalRow.insertCell(0);
                additionalDate.innerHTML = date;
                additionalItems = true;
              }
              
              addAdditionalItem(exerciseName, exerciseValue, date);
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            dateCell.innerHTML = date;
            levelAIndex++;
            if (additionalItems){
              additionalIndex++;
            }
        }

      });
    });
  }
  
  function displayBExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
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
          var additionalItems = false;
          levelBLabel.style.display = "block";
          levelB.style.display = "table";


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue
            if(exercises.val()==="YES"){
              exerciseValue = "Complete"
            }
            else if(exercises.val()==="NO"){
              exerciseValue = "Incomplete";
            }

            var titleIndex = searchForTitle(exerciseName, level);
            if(titleIndex==null && exerciseName !="Level"){
              if(!additionalItems){
                var additionalRow = makeRowAdditional(additionalIndex);
                additionalRow.deleteCell(0);
                var additionalDate = additionalRow.insertCell(0);
                additionalDate.innerHTML = date;
                additionalItems = true;
              }
              
              addAdditionalItem(exerciseName, exerciseValue, date);
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            dateCell.innerHTML = date;
            levelBIndex++;
            if (additionalItems){
              additionalIndex++;
            }
        }

      });
    });
  }

  function displayCExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
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
          var row = makeRowC(levelAIndex);
          var additionalItems = false;
          levelCLabel.style.display = "block";
          levelC.style.display = "table";


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue
            if(exercises.val()==="YES"){
              exerciseValue = "Complete"
            }
            else if(exercises.val()==="NO"){
              exerciseValue = "Incomplete";
            }

            var titleIndex = searchForTitle(exerciseName, level);
            if(titleIndex==null && exerciseName !="Level"){
              if(!additionalItems){
                var additionalRow = makeRowAdditional(additionalIndex);
                additionalRow.deleteCell(0);
                var additionalDate = additionalRow.insertCell(0);
                additionalDate.innerHTML = date;
                additionalItems = true;
              }
              
              addAdditionalItem(exerciseName, exerciseValue, date);
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            dateCell.innerHTML = date;
            levelCIndex++;
            if (additionalItems){
              additionalIndex++;
            }
        }

      });
    });
  }

  function displayDExercises(){
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dates){
        var date = dates.key;
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
          var row = makeRowD(levelAIndex);
          var additionalItems = false;
          levelDLabel.style.display = "block";
          levelD.style.display = "table";


          dates.forEach(function(exercises){
            var exerciseName = exercises.key;
            var exerciseValue
            if(exercises.val()==="YES"){
              exerciseValue = "Complete"
            }
            else if(exercises.val()==="NO"){
              exerciseValue = "Incomplete";
            }

            var titleIndex = searchForTitle(exerciseName, level);
            if(titleIndex==null && exerciseName !="Level"){
              if(!additionalItems){
                var additionalRow = makeRowAdditional(additionalIndex);
                additionalRow.deleteCell(0);
                var additionalDate = additionalRow.insertCell(0);
                additionalDate.innerHTML = date;
                additionalItems = true;
              }
              
              addAdditionalItem(exerciseName, exerciseValue, date);
            }
            else{
              row.deleteCell(titleIndex);
              var exercisecell = row.insertCell(titleIndex);
              exercisecell.innerHTML = exerciseValue;
            }
          });
          row.deleteCell(0);
            var dateCell = row.insertCell(0);
            dateCell.innerHTML = date;
            levelDIndex++;
            if (additionalItems){
              additionalIndex++;
            }
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


  function addAdditionalItem(key, value, date){
  additionalLabel.style.display = "block";
          additionalExercises.style.display = "table";
  var titleIndex = searchForTitle(key, "add");
  if(titleIndex==null){
    additionalTitles.push(key);
    addTitleColumn(additional, additionalTitles, additionalIndex);
    titleIndex = searchForTitle(key, "add");
    var row = additional.rows[additionalIndex];
    row.cells[titleIndex].innerHTML = value;
  }
  else{
    var row = additional.rows[additionalIndex];
    row.cells[titleIndex].innerHTML = value;
  }

}

function addTitleColumn(table, titles, rowIndex){
  var titleRow = table.rows[0];
  var newTitle = titleRow.insertCell(titles.length-1);
  newTitle.innerHTML = titles[titles.length-1];
  
  for(var i=1; i<rowIndex+1; i++){
    var row = table.rows[i];
    for(var j=row.cells.length; j<titles.length;j++){
      console.log(titles[titles.length-1], i, j);
      var newCell = row.insertCell(j);
    }
    
  }


}
