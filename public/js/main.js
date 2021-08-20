function participate(){
    let btn = document.getElementById('part')
    let id = btn.getAttribute('data-id')
    axios.post('events/participate/'+id)
    .then((res)=> {
        console.log(res.data)
        alert("The Participation was created successfuly")
        window.location.href = '/events'
    })
    .catch( (err)=> {
        console.log(err)
    })
}
function deleteEventatt(){
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    
    axios.delete('/events/deleteatt/'+ id)
    .then( (res)=> {
        console.log(res.data)
        alert('event attribut was deleted')
        window.location.href = '/events'
    })

    .catch( (err)=> {

        console.log(err)
    })

}
function deleteEvent() {
    let btn = document.getElementById('deleteBtn')
    let id = btn.getAttribute('data-id')
    
    axios.delete('/events/delete/'+ id)
    .then( (res)=> {
        console.log(res.data)
        alert('event was deleted')
        window.location.href = '/events'
    })

    .catch( (err)=> {

        console.log(err)
    })

}


//upload avatar 

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader()

        reader.onload = function(e) {
            let image = document.getElementById("imagePlaceholder")
            image.style.display = "block"
            image.src = e.target.result

        }

        reader.readAsDataURL(input.files[0])
    }
}
function myFunction() {
    var x = document.getElementById("confirm_password");
    var y=document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
    if (y.type === "password") {
        y.type = "text";
      } else {
        y.type = "password";
      }
  } 

