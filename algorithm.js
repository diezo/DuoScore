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

    var percentage = 99;
    
    percentage = (sum <= 100) ? sum : (sum - 50);
    percentage = (percentage < 60) ? (percentage + 30) : percentage;
    percentage = (percentage >= 100) ? 99 : percentage;

    const level = ((percentage + first) % 2 == 0) ? "f" : "l";

    return [percentage, level];
}