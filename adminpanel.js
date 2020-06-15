var addbtn=document.querySelector(".addbtn")
var page1=document.querySelector(".page1")
var page2=document.querySelector(".page2")
var back=document.querySelector(".inner-back")
var create=document.querySelector(".inner-create")
var next=document.querySelector(".next")
var del=document.querySelector(".del")
var date=document.querySelector(".date-child")





var username=document.getElementById("U-name")
var userfathername=document.getElementById("U-fname")
var usercnic=document.getElementById("U-cnic")
var userdesignation=document.getElementById("U-designation")
var userdate=document.getElementById("U-date")
var userimg=document.getElementById("employeepic");

var searchbar=document.querySelector(".searching")
var contentArea=document.querySelector(".content-area")
var reference=firebase.storage().ref();
// console.log(reference)

var id;



             //connect firestore and auth functionality from database
var firestore=firebase.firestore();
var auth=firebase.auth();

            //time and date
 const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December" ];
         

var fun1=new Date();
date.innerHTML=(fun1.getDate()+"-"+monthNames[fun1.getMonth()]+"-"+fun1.getFullYear());

            //add button
addbtn.addEventListener("click",function()
{
    page1.classList.add('blur')
    page2.classList.add('opaque')

})
            //back button
back.addEventListener("click",function()
{
    page1.classList.remove('blur')
    page2.classList.remove('opaque')

    username.value="";
    userfathername.value="";
    usercnic.value="";
    userdesignation.value="";
    userdate.value="";
    userimg.value="";
    // page2.classList.remove('opaque')

})

            //next button
contentArea.addEventListener("click",function(extraInfo)
{
    if(Array.from(extraInfo.target.classList).includes("next"))
    {
        var newid=extraInfo.target.id;
            //transfering id from admin page to employee page
            var encryptedAES = CryptoJS.AES.encrypt(newid, "employee data");

    location.assign(`./employee.html#${encryptedAES}`)
    
    
  
    }
    
})
            //create button
create.addEventListener("click",async function(e)
{
    var checker=0;
    e.preventDefault();
  

        //making obj to store store values in database 
   try {

    const file=document.getElementById("employeepic").files[0];
    
    const imgData={
        contentType:file.type,

    }
    const fileRef=reference.child(`Employee-`+file.name);
    const uploadimg=await fileRef.put(file,imgData)
    const imgurl=await uploadimg.ref.getDownloadURL();

    var empName=username.value;
    var empFatherName=userfathername.value;
    var empDesignation=userdesignation.value;
    var empCnic=usercnic.value;
    var empDate=userdate.value;

    if(empName && empFatherName && empDesignation && empCnic && empDate)

    {  
       //checking if cnic is unique then pass
       var EmpCnicCheck=await firestore.collection("Employee").get();
       EmpCnicCheck.forEach(doc => {
           var EmployeeCheck=doc.data();
           if(EmployeeCheck.EmployeeCnic==empCnic)
           {
               checker=1;
           }
           
         

       })

       if(checker==1)
       {
           alert("CNIC Exist")
        //    console.log(checker)
        usercnic.value="";
       
     

       }

       if(checker==0)
       {
        empObj={
            EmployeeName:empName.toLowerCase(),
            EmployeeFatherName:empFatherName,
            EmployeeDesignation:empDesignation,
            EmployeeCnic:empCnic,
            EmployeeJoiningdate:empDate,
            EmployeeImg:imgurl,
    
    
        }
        // console.log(checker)

          //passing that obj here in database
            await firestore.collection("Employee").add(empObj);
            render();
            username.value="";
            userfathername.value="";
            usercnic.value="";
            userdesignation.value="";
            userdate.value="";
            userimg.value="";
           

       }
      

   }
   else{
       alert("Fields are Empty")
   }
   
}

  
   catch (error) {
       alert(error.message)
       
   }

  

})


            //add function for rendering real time values
var add=(name,designation,cnic,id,img)=>{


    
    contentArea.insertAdjacentHTML("beforeend",
    `
    <div class="person1-content persons">
    <div class="image flex">
        <div class="innerimage">
        <img src="${img}" width="100%" height="100%" style="border-radius:50%">
        </div>
    </div>
    <div class="content">
        <div class="name info">
            <p>${name}</p>
        </div>
        <div class="designation info">
            <p>${designation}</p>

        </div>
        <div class="cnic info">
            <p>${cnic}</p>
        </div>
    </div>
    <div class="icons">
        <div class="icon1">
            <i class="fas fa-angle-double-right next" id=${id}></i>
        </div>
        <div class="icon2">
            <i class="fas fa-trash-alt del " id=${cnic}></i>
        </div>
    </div>

</div>`
    )

}

    //render function for rendering divs on content area
var render=async(e)=>{
    contentArea.innerHTML="";
    var EmpInfo=await firestore.collection("Employee").get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
        
        add(EmployeeData.EmployeeName,EmployeeData.EmployeeDesignation,EmployeeData.EmployeeCnic,doc.id,EmployeeData.EmployeeImg)
        
        // id=doc.id;
        // console.log(id)
    });




}
render();

                //search button
searchbar.addEventListener("input", async function(e)
{
   
    var List=[];
    var EmpInfo=await firestore.collection("Employee").get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
        if(EmployeeData.EmployeeName.includes(searchbar.value.toLowerCase()) || EmployeeData.EmployeeName.includes(searchbar.value.toUpperCase()) || EmployeeData.EmployeeCnic.includes(searchbar.value.toLowerCase()))
        {
           List.push(EmployeeData)
           
        }
        contentArea.innerHTML="";
        for(var i=0;i<List.length;i++)
        {

        add(List[i].EmployeeName,List[i].EmployeeDesignation,List[i].EmployeeCnic,doc.id,List[i].EmployeeImg)

          
        }
        
        
    });

    

})
                //delete functionality
contentArea.addEventListener("click", async function(extraInfo)
{
    var EmpInfo=await firestore.collection("Employee").get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
        if(extraInfo.target.id===EmployeeData.EmployeeCnic)
        {

        firestore.collection("Employee").doc(doc.id).delete();
        render();

        }

    })
    
})