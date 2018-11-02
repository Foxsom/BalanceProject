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
    window.open("../noSign.html", "_self");
  }
});
  }

  function removeAllElements(){
    var node = document.getElementById("topsection");
    while(node.firstChild){
      node.removeChild(node.firstChild);
    }
  }

  