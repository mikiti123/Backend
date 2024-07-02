// {/* <div class="nr"><% var nr = zamowienie.id; %> <%= nr %></div>
//         <div class="data"><% var dat = zamowienie.data.toISOString(); var normalna = dat.split('T')[0];var godzina = zamowienie.data.getHours(); var minuta = zamowienie.data.getMinutes(); var praw = normalna +" o godzinie "+ godzina + ":"+minuta; %> <%= praw %></div>
//         <div class="koszt"><% var cal = koszty</div> */}
$(document).ready(()=>{
    const zamowienie = JSON.parse(JSON.stringify(<%- zamowienie %>));
    const koszt = JSON.parse(JSON.stringify(<%- koszty %>));
    const poj = document.createElement('div');
    console.log(zamowienie);
});