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
    exerciseRef.once('value', function(snapshot){
      snapshot.forEach(function(dateSnapshot){
        var exerciseDate = dateSnapshot.key;
        var level;
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
                  
                break;
                case "B":
                  row = levelB.insertRow(levelBIndex);
                  makeRowB(row);
                  
                break;
                case "C":
                  row = levelC.insertRow(levelCIndex);
                  makeRowC(row);
                  
                break;
                case "D":
                  row = levelD.insertRow(levelDIndex);
                  makeRowD(row);
                  
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

  function makeRowA(row){
    for (var i = 0; i<levelATitles.length; i++){
      var cell = row.insertCell(0);
    }
  }

  function makeRowB(rowIndex){
    for (var i = 0; i<levelBTitles.length; i++){
      var row = levelB.insertRow(rowIndex);
      var cell = row.insertCell(0);
    }
  }

  function makeRowC(rowIndex){
    for (var i = 0; i<levelCTitles.length; i++){
      var row = levelC.insertRow(rowIndex);
      var cell = row.insertCell(0);
    }
  }

  function makeRowD(rowIndex){
    for (var i = 0; i<levelDTitles.length; i++){
      var row = levelD.insertRow(rowIndex);
      var cell = row.insertCell(0);
    }
  }

    function getUploads(){
    displayTitles(["Date Last Modified:", "View Contents", "Download File:"], uploads);
    var rowIndex = 1;
    database.ref(user+"/dataUploads").once('value', function(snapshot){
      snapshot.forEach(function(childSnapshot){
        var childKey = childSnapshot.key;
        var childValue = childSnapshot.val();
        console.log(childKey);
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