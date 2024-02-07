const submit = document.querySelector("#submit")
const first_name = document.querySelector("#first-name")
const second_name = document.querySelector("#second-name")
const main_container = document.querySelector("#main")
const loading_container = document.querySelector("#loading")
const result_container = document.querySelector("#result")
const result_percentage_display = document.querySelector("#result-percentage")

var latestPercentage = null;

function init() {first_name.focus();}

first_name.addEventListener("keypress", () => second_name.focus());
second_name.addEventListener("keypress", e => {if (e.keyCode == 13) enter()});
submit.addEventListener("click", enter);

function enter()
{
    const a = first_name.value.toString().trim();
    const b = second_name.value.toString().trim();

    if (a != "" && b != "")
    {
        score(a, b).then(percentageLove =>
            {
                latestPercentage = percentageLove; load();
            })
    }
}

async function score(x, y)
{
    const a = x.toString().trim().toLowerCase();
    const b = y.toString().trim().toLowerCase();

    const numbers = [..."0123456789"];

    const d1 = [...new Uint8Array(await crypto.subtle.digest("SHA-1", new TextEncoder().encode(a)))].map(x => x.toString(16).padStart(2, "0")).join("");
    const d2 = [...new Uint8Array(await crypto.subtle.digest("SHA-1", new TextEncoder().encode(b)))].map(x => x.toString(16).padStart(2, "0")).join("");

    const pair = (d1 > d2) ? (d1 + d2) : (d2 + d1)
    const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-1", new TextEncoder().encode(pair)))].map(x => x.toString(16).padStart(2, "0")).join("");

    var sum = 0;
    var first = 0;

    for (let i = 0; i <= digest.length; i++)
    {
        first = (first == null) ? digest[i] : first;
        sum += (numbers.includes(digest[i])) ? parseInt(digest[i]) : 0;
    }

    var percentageLove = 99;
    
    percentageLove = (sum <= 100) ? sum : (sum - 50);
    percentageLove = (percentageLove < 60) ? (percentageLove + 30) : percentageLove;
    percentageLove = (percentageLove >= 100) ? 99 : percentageLove;

    return percentageLove;
}

function load()
{
    submit.disabled = true;
    first_name.disabled = true;
    second_name.disabled = true;

    main_container.style.display = "none";
    loading_container.style.display = "inline-block";

    set_percentage(0);
}

function set_percentage(i)
{
    const gap = (i <= 95) ? (Math.floor(Math.random() * 10) + 1) : (Math.floor(Math.random() * 200) + 30);

    setTimeout(() =>
    {
        loading_container.innerHTML = i + "%";
        
        if (i < 100) set_percentage(i + 1);
        else setTimeout(done, 1000);
    }, gap);
}

function done()
{
    loading_container.style.display = "none";

    result_percentage_display.innerHTML = latestPercentage + "%";
    result_container.style.display = "inline-block";
}