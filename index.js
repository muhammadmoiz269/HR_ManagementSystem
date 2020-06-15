var firestore=firebase.firestore();
var auth=firebase.auth();


var username=document.querySelector(".username")
var password=document.querySelector(".password")
var signin=document.querySelector(".signin")

var innerbtn=document.querySelector(".innerButton")




//using database but its not a professional approach

// var fetchUser= async()=>{
        

//         var user=await firestore.collection("User").get()
//         {

            
//             user.forEach(doc => {
//                 var data=doc.data();
//                 if(data.user_Name===username.value && data.user_pass===password.value)
//                 {
//                    window.open("http://127.0.0.1:5500/adminpanel.html");
//                    username.value="";
//                    password.value="";


//                 }               
                 
//             });

//         }

// }
        //sign in Button
signin.addEventListener("click", async(e)=>
{
   
    e.preventDefault();
   
    try {
        var signInEm=username.value;
        var signInPs=password.value;
        
            var loggeduser=await auth.signInWithEmailAndPassword(signInEm,signInPs);
            
            
        
            location.assign("./adminpanel.html")
           

            //fetching UserInfo
            var userInfo=await firestore.collection("Admin").doc(loggeduser.user.uid).get();
           
    
    
        }
        
     catch (error){

        alert(error.message);
        
    }
    username.value="";
    password.value="";

})
        //Google SignIn
var googleSignIn= async ()=>{
try {
    var googleProvider = new firebase.auth.GoogleAuthProvider();

    //destructering 
  
    var {additionalUserInfo:{isNewUser},user:{displayName,uid,email}}= await firebase.auth().signInWithPopup(googleProvider);
    //if new user then store data in firestore
    if(isNewUser)
    {

      //store user data in firestore
         var UserInformation={
            fullName:displayName,
            email,
            createAt: new Date()
           }
        //    console.log(UserInformation)
           await firestore.collection("Admin").doc(uid).set(UserInformation);

           
        //   console.log("done")
    }
    else{
        // console.log("welcome")

        
    }
    location.assign("./adminpanel.html")
    

 
   
    
} catch (error) {
    alert(error)
    
}
}
innerbtn.addEventListener("click",googleSignIn)







