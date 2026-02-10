let data = JSON.parse(localStorage.getItem("habits")) || [];

let chart;

function save(){
    localStorage.setItem("habits", JSON.stringify(data));
}

function addGoal(){

    let input = document.getElementById("goalInput");

    if(input.value==="") return;

    data.push({
        id: Date.now(),
        name: input.value,
        checks: Array(31).fill(0)
    });

    input.value="";

    save();
    render();
}

function toggle(id, day){

    let habit = data.find(h=>h.id===id);

    habit.checks[day] = (habit.checks[day]+1)%3;

    save();
    render();
}

function render(){

    let body = document.getElementById("gridBody");

    body.innerHTML="";

    let totalDone=0, totalFail=0, totalPending=0;

    data.forEach(habit=>{

        let tr=document.createElement("tr");

        let doneCount=0;

        let html=`<td class="border p-2">${habit.name}</td>`;

        habit.checks.forEach((c,i)=>{

            let cls="pending";

            if(c===1){
                cls="completed";
                doneCount++;
                totalDone++;
            }
            else if(c===2){
                cls="failed";
                totalFail++;
            }
            else totalPending++;

            html+=`
            <td class="border">
                <div class="cell ${cls}"
                onclick="toggle(${habit.id},${i})">
                ${c===1?"✓":c===2?"✕":""}
                </div>
            </td>`;
        });

        let percent=Math.round(doneCount/31*100);

        html+=`<td class="border p-2">${percent}%</td>`;

        tr.innerHTML=html;

        body.appendChild(tr);
    });

    drawChart(totalDone,totalFail,totalPending);
}

function drawChart(done,fail,pending){

    let ctx=document.getElementById("chart");

    if(chart) chart.destroy();

    chart=new Chart(ctx,{

        type:"doughnut",

        data:{
            labels:["Done","Fail","Pending"],
            datasets:[{
                data:[done,fail,pending]
            }]
        }
    });
}

render();
