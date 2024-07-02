$(document).ready(()=>{
    document.getElementById('wyloguj').addEventListener('mouseenter',function(){
        document.getElementById('wyloguj').style.cursor = "pointer";
    });
    document.getElementById('wyloguj').addEventListener('mouseleave',function(){
        document.getElementById('wyloguj').style.cursor = "default";
    });
    document.getElementById('b1').addEventListener('mouseenter',function(){
        document.getElementById('b1').style.cursor = "pointer";
    });
    document.getElementById('b1').addEventListener('mouseleave',function(){
        document.getElementById('b1').style.cursor = "default";
    });
    $('#usun').on('mouseenter',function(){
        this.style.cursor = "pointer";
    });
    $('#usun').on('mouseleave',function(){
        this.style.cursor = "default";
    });
    $('#usun').on('click',async function(){
        const response = await fetch('/usun',{
            method:'DELETE',
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify( {login: $("#sp").text().replace(/\s/g,"")})
    });
        if(response.status == 200){
            window.location.href = "/";
        }});
    let m =  $('.niewybrane');
    $('.niewybrane').on('click',(e)=>{
       if(e.currentTarget.className == "wybrane najechane"||e.currentTarget.className =="wybrane"){
        e.currentTarget.className = "niewybrane";
       }
       else{
        e.currentTarget.className = "wybrane";
       }
    });
    $(m).on('mouseenter',(e)=>{
        e.currentTarget.classList.add("najechane");
    });
    $(m).on('mouseleave',(e)=>{
        e.currentTarget.classList.remove('najechane');
    });
    let nazwy = "";
    $('#b1').on('click',()=>{
        $('.wybrane').each((index)=>{$('.wybrane').eq(index).text()});

    });
    $('input').on('click',(e)=>{$(e.currentTarget).parent().trigger('click');});
    $('#wyloguj').on('click',async ()=>{
        const response = await fetch("/wyloguj",{
            method:'DELETE',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify({
                login: $("#sp").text().replace(/\s/g,"")
            })
        });
        if(response.status == 200){
        window.location.href = "/log";}
        else{
            console.log(response.json());
        }
    });
    $('#b1').on('click',async function(){
        const t = [];
        $('.wybrane').each(function(index){
            if($(this).children('input').val().replace(/\s/g,"") != "" && isNaN($(this).children('input').val()) == false ){
            t.push({
                nazwa:$(this).children('.nazwa').text(),
                ilość:Number($(this).children('input').val())
            });}
        });
       const res =  await fetch('/zam',{
            method:'POST',
            headers:{
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(t)
        });
        if(res.status == 200){
            window.location.href = 'zam/szczegolowe';
        }

    });

});