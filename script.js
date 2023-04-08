const callBtn = document.getElementById("call-btn");
const resultDiv = document.getElementById("result");

function serverRequest() {
    callBtn.disabled = true;
    fetch("https://govee-server.onrender.com/run")
        .then((response) => response.text())
        .then((data) => {
            if (data.includes("Success")) {
                resultDiv.style.color = "#23BF4D";
            } else if (data.includes("Error")) {
                resultDiv.style.color = "#EA2323";
            } else {
                resultDiv.style.color = "#000000";
            }
            resultDiv.innerText = data;
            callBtn.disabled = false;
        })
        .catch((error) => {
            resultDiv.style.color = "#EA2323";
            resultDiv.innerText = "Error fetching data";
            callBtn.disabled = false;
            console.error(error);
        });
}

callBtn.addEventListener("click", serverRequest);
