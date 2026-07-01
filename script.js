// ==========================
// العناصر
// ==========================
const addTaskBtn = document.getElementById("addTaskBtn");
const darkModeBtn = document.getElementById("darkModeBtn");
const taskModal = document.getElementById("taskModal");
const taskInput = document.getElementById("taskInput");
const saveTask = document.getElementById("saveTask");
const closeModal = document.getElementById("closeModal");
const taskList = document.getElementById("taskList");
const completedList = document.getElementById("completedList");
const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const progressText = document.getElementById("progressText");
const progressBar = document.getElementById("progressBar");
// ==========================
// البيانات
// ==========================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
// ==========================
// حفظ البيانات
// ==========================
function saveData(){
    localStorage.setItem("tasks",JSON.stringify(tasks));
}
// ==========================
// تحديث الإحصائيات
// ==========================
function updateStats(){
    const total = tasks.length;
    const completed =
    tasks.filter(task=>task.completed).length;
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    let percent = 0;
    if(total > 0){
        percent = Math.round((completed/total)*100);
    }
    progressText.textContent = percent + "%";
    progressBar.style.width = percent + "%";
}
// ==========================
// فتح نافذة إضافة المهمة
// ==========================
addTaskBtn.onclick = ()=>{
    taskModal.classList.add("active");
    taskInput.focus();
};
// ==========================
// غلق النافذة
// ==========================
closeModal.onclick = ()=>{
    taskModal.classList.remove("active");
    taskInput.value = "";
};
// غلق عند الضغط خارجها
window.onclick = (e)=>{
    if(e.target === taskModal){
        taskModal.classList.remove("active");
        taskInput.value = "";
    }
};
// ==========================
// إضافة مهمة
// ==========================
function addTask(){
    const text = taskInput.value.trim();
    if(text === "") return;
    tasks.push({
        text:text,
        completed:false
    });
    saveData();
    renderTasks();
    taskInput.value="";
    taskModal.classList.remove("active");
}
saveTask.onclick = addTask;
// إضافة بالضغط على Enter
taskInput.addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){
        addTask();
    }
});
// ==========================
// عرض المهام
// ==========================
function renderTasks(){
    taskList.innerHTML="";
    completedList.innerHTML="";
    tasks.forEach((task,index)=>{
        const li=document.createElement("li");
        li.innerHTML=`
        <input type="checkbox"
        ${task.completed ? "checked":""}>
        <span>${task.text}</span>
        `;
        const checkBox=li.querySelector("input");
        checkBox.addEventListener("change",()=>{
            tasks[index].completed=checkBox.checked;
            saveData();
            renderTasks();
        });
        if(task.completed){
            completedList.appendChild(li);
        }else{
            taskList.appendChild(li);
        }
    });
    updateStats();
}
// ==========================
// تشغيل أول مرة
// ==========================
renderTasks();
// ==========================
// المؤقت
// ==========================
const minutesInput = document.getElementById("minutesInput");
const timerDisplay = document.getElementById("timerDisplay");
const startTimer = document.getElementById("startTimer");
const pauseTimer = document.getElementById("pauseTimer");
const resetTimer = document.getElementById("resetTimer");
const bell = new Audio("bell.mp3");
let timer = null;
let secondsLeft =
Number(localStorage.getItem("timer")) ||
Number(minutesInput.value) * 60;
function updateTimer(){
    const m = Math.floor(secondsLeft/60);
    const s = secondsLeft%60;
    timerDisplay.textContent =`
    ${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}
function saveTimer(){
    localStorage.setItem("timer",secondsLeft);
}
function runTimer(){
    clearInterval(timer);
    timer = setInterval(()=>{
        if(secondsLeft>0){
            secondsLeft--;
            updateTimer();
            saveTimer();
        }else{
            clearInterval(timer);
            localStorage.removeItem("timer");
            bell.play();
            alert("🎉 انتهت الجلسة!");
        }
    },1000);
}
startTimer.onclick=()=>{
    if(secondsLeft<=0){
        secondsLeft=
        Number(minutesInput.value)*60;
    }
    runTimer();
};
pauseTimer.onclick=()=>{
    clearInterval(timer);
};
resetTimer.onclick=()=>{
    clearInterval(timer);
    secondsLeft=
    Number(minutesInput.value)*60;
    updateTimer();
    saveTimer();
};
updateTimer();
if(localStorage.getItem("timer")){
    runTimer();
}
// ==========================
// الساعة
// ==========================
const today =
document.getElementById("today");
const clock =
document.getElementById("clock");
function updateClock(){
    const now = new Date();
    const days=[
        "الأحد",
        "الإثنين",
        "الثلاثاء",
        "الأربعاء",
        "الخميس",
        "الجمعة",
        "السبت"
    ];
    today.textContent=`${days[now.getDay()]} ${now.getDate()} / ${now.getMonth()+1} / ${now.getFullYear()}`;
    clock.textContent=
    now.toLocaleTimeString("ar-EG");
}
setInterval(updateClock,1000);
updateClock();
// ==========================
// الوضع الليلي
// ==========================
if(localStorage.getItem("theme")=="dark"){
    document.body.classList.add("dark");
}
darkModeBtn.onclick=()=>{
    document.body.classList.toggle("dark");
    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
    }else{
        localStorage.setItem("theme","light");
    }
};
