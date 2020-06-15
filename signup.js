var firestore=firebase.firestore();
var auth=firebase.auth();


var signupName=document.getElementById("signup-name")
var signupEmail=document.getElementById("signup-email")
var signupPass=document.getElementById("signup-pass")
var signupRepeat=document.getElementById("signup-repeat")
var regBtn=document.querySelector(".reg-btn")

var add=(user)=>{
    firestore.collection("User").add(user)
}
        //register Button
regBtn.addEventListener("click", async function(e)
{
    e.preventDefault();
    var signUpNm=signupName.value;
    var signUpEm=signupEmail.value;
    var signUpPs=signupPass.value;
    if(signUpNm && signUpEm && signUpPs)
    {
    try {
        if(signupPass.value === signupRepeat.value) 
        {
            var signeduser=await auth.createUserWithEmailAndPassword(signUpEm,signUpPs);
        
    
        }
       
        userObj={
            UserName:signUpNm,
            UserEmail:signUpEm
        }
        await firestore.collection("Admin").doc(signeduser.user.uid).set(userObj);
        alert("User Created");
        
    } catch (error) {
        alert(error.message)
        
    }
}
else{
    alert("Fields are Empty")
}
   

    

  //using database but its not a professional approach

    // {
    //     var userarray={
    //         user_Name:signupName.value,
    //         user_Email:signupEmail.value,
    //         user_pass:signupPass.value,
    //     }
    //     add(userarray);
       

    // }
    // else{
    //     alert("Password not match")
    //     // console.log(signupPass)
    //     // console.log(signupRepeat)
    // }
   
    signupEmail.value="";
    signupName.value="";
    signupPass.value="";
    signupRepeat.value="";


})