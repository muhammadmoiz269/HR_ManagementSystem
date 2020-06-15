var addbtn=document.querySelector(".addbtn")
var page1=document.querySelector(".page1")
var page2=document.querySelector(".page2")
var back=document.querySelector(".inner-back")
var content=document.querySelector(".columns-content")
var create=document.querySelector(".inner-create")
var updateBtn=document.querySelector(".updateBtn")
var search=document.querySelector(".searching")
var image=document.querySelector(".image")




var userDate=document.getElementById("User-date")
var userCredit=document.getElementById("User-credit")
var userDebit=document.getElementById("User-debit")
var userBalance=document.getElementById("User-balance")
var userDescription=document.getElementById("User-description")
var names=document.querySelector(".names")
var amount=document.getElementById("amt")
var signoutBtn=document.querySelector(".signoutBtn")
 
var updateid;
var id;


            //fetching id from url

var Fetched_Id = location.hash.substring(1,location.hash.length);
var decryptedBytes = CryptoJS.AES.decrypt(Fetched_Id, "employee data");
var uid = decryptedBytes.toString(CryptoJS.enc.Utf8);


            //connect firestore and auth functionality from database
var firestore=firebase.firestore();
var auth=firebase.auth();



content.innerHTML="";

        //add button
addbtn.addEventListener("click",function()
{
    page1.classList.add('blur')
    page2.classList.add('opaque')

})

        //update Button
updateBtn.addEventListener("click", async function(extraInfo)
 {
    var EmpInfo=await firestore.collection("EmployeeData").get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
       
        
        if(updateid==doc.id)
            {
          firestore.collection("EmployeeData").doc(doc.id).get();
        //   console.log(doc.id)

          var empDate=userDate.value;
          var empCredit=userCredit.value;
          var empDebit=userDebit.value;
          var empBalance=userBalance.value;
          var empDescription=userDescription.value;
          var empid=uid;
      
          try {
      
              EmployeeObj={
                  EmployeesDate:empDate,
                  EmployeesCredit:empCredit,
                  EmployeesDebit:empDebit,
                  EmployeesBalance:empBalance,
                  EmployeesDescription:empDescription.toLowerCase(),
                  EmployeesId:empid,
              }
      
              
              firestore.collection("EmployeeData").doc(doc.id).update(EmployeeObj);
              render();
      
              
          }
           catch (error) {
           alert(error.message)
      
              
          }
          userDate.value="";
          userCredit.value="";
          userDebit.value="";
          userBalance.value="";
          userDescription.value="";      

     
            
            } 
           
    })
 })
        //back Button
back.addEventListener("click",function()
{
    page1.classList.remove('blur')
    page2.classList.remove('opaque')


    // page2.classList.remove('opaque')

    create.classList.remove('opaque')
    updateBtn.classList.remove('opaque')
    
    userDate.value="";
    userCredit.value="";
    userDebit.value="";
    userBalance.value="";
    userDescription.value="";

})


        //create button 
create.addEventListener("click",async function(e)
{
    
    e.preventDefault();
    
    var empDate= new Date(userDate.value);
    var dt=empDate.getDate();
    var mn=empDate.getMonth()+1;
    var empCredit=userCredit.value;
    var empDebit=userDebit.value;
    var empBalance=userBalance.value;
    var empDescription=userDescription.value;
    var empid=uid;

if(empDate && empCredit && empDebit && empBalance && empDescription)
{
    try {

        EmployeeObj={
            EmployeesDate:(dt+"/"+mn),
            EmployeesCredit:empCredit,
            EmployeesDebit:empDebit,
            EmployeesBalance:empBalance,
            EmployeesDescription:empDescription.toLowerCase(),
            EmployeesId:empid,
        }

        
        await firestore.collection("EmployeeData").add(EmployeeObj);
        render();

        
    }
     catch (error) {
     alert(error.message)

        
    }
    location.reload();

}
    else{
        alert("Fields are Empty")
    }
    userDate.value="";
    userCredit.value="";
    userDebit.value="";
    userBalance.value="";
    userDescription.value="";
    

})
var ImageFun=(img)=>{
    image.insertAdjacentHTML("beforeend",
    `
    <div class="innerimage">
    <img src="${img}" width="100px" height="100px" style="border-radius:50%">             
    </div>
    `)

} 


            //add function for rendering real time values
var add=(date,credit,debit,balance,description,Id)=>{
    content.insertAdjacentHTML("beforeend",
    `
    <div class="content1 outercontent">
                          
    <div class="cont-date cont flex">
        <p>${date}</p>
    </div>
    <div class="cont-desdes cont flex">
        <p>${credit}</p>
    </div>
    <div class="cont-credit cont flex">
        <p>${debit}</p>
    </div>
    <div class="cont-debit cont flex">
        
        <p>${description}</p>
    </div>
    <div class="cont-icons cont flex">
        <i class="fas fa-retweet update" id=${Id}></i>
        <i class="fas fa-trash-alt delete" id=${Id}></i>
    </div>

</div>
    `
    )
  
    

  
}
    //initializing amount value for Amonut field
var newamount=0;

    //render function for rendering divs on content area
var render=async(e)=>{
    content.innerHTML="";

    var EmpInfo=await firestore.collection("EmployeeData").where("EmployeesId","==",uid).get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
        add(EmployeeData.EmployeesDate,EmployeeData.EmployeesCredit,EmployeeData.EmployeesDebit,EmployeeData.EmployeesBalance,EmployeeData.EmployeesDescription,doc.id)

        
        
        //logic for Amount button

         var credit=EmployeeData.EmployeesCredit
         var debit=EmployeeData.EmployeesDebit;
        newamount = newamount+(credit-debit);
        amount.textContent=newamount;
   
        
       
       
    });

            //only taking first name by splitting string
    var UserInfo=await firestore.collection("Employee").doc(uid).get();
    var userName=UserInfo.data().EmployeeName.split(" ")[0]
    var empimg=UserInfo.data().EmployeeImg;

  
    names.textContent=userName;
    image.innerHTML="";

    //rendering image
    image.insertAdjacentHTML("beforeend",
    `
    <div class="innerimage">
    <img src="${empimg}" width="100%" height="100%" style="border-radius:50%">             
    </div>
    `)


  



}
render();
            //delete functionality
content.addEventListener("click", async function(extraInfo)
{
    if(Array.from(extraInfo.target.classList).includes("delete"))
    {
    var EmpInfo=await firestore.collection("EmployeeData").get();
    EmpInfo.forEach(doc => {
        var EmployeeData=doc.data();
        if(extraInfo.target.id==doc.id)
        {
        firestore.collection("EmployeeData").doc(doc.id).delete();
        render();
        }
        
       
    })
}           
                    //update functionality
     if(Array.from(extraInfo.target.classList).includes("update"))
    {
        var EmpInfo=await firestore.collection("EmployeeData").get();
        EmpInfo.forEach(doc => {
            var EmployeeData=doc.data();
            if(extraInfo.target.id==doc.id)
            {
                updateid=doc.id;
                page1.classList.add('blur')
                page2.classList.add('opaque')

              firestore.collection("EmployeeData").doc(doc.id).get();
            //   console.log(doc.id)
                
            

            userDate.value=EmployeeData.EmployeesDate;
            userCredit.value=EmployeeData.EmployeesCredit;
            userDebit.value=EmployeeData.EmployeesDebit;
            userBalance.value=EmployeeData.EmployeesBalance;
            userDescription.value=EmployeeData.EmployeesDescription;
            

            
            create.classList.remove('opaque')
            updateBtn.classList.add('opaque')
     
              
            }
        })
       
  
    }
    
    
})

            //signOut Button
signoutBtn.addEventListener("click",function()
{
    location.assign("./adminpanel.html");
    // await auth.signout();
})
            //Search 
search.addEventListener("input", async function()
{
    var List=[];
    var EmpSearchInfo=await firestore.collection("EmployeeData").where("EmployeesId","==",uid).get();
    EmpSearchInfo.forEach(doc => {
        var EmployeeSearchData=doc.data();
        if(EmployeeSearchData.EmployeesDescription.includes(search.value.toLowerCase()))
        {
            
           List.push(EmployeeSearchData)
           
        }
      
        content.innerHTML="";
        for(var i=0;i<List.length;i++)
        {
            add(List[i].EmployeesDate,List[i].EmployeesCredit,List[i].EmployeesDebit,List[i].balance,List[i].EmployeesDescription,doc.id);
        }
        
        
    });
})