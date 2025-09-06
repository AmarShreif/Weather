let inputSearch = document.getElementById("input-search");
let btn = document.getElementById("btn");
let nameCity = [];
let currentData = [];
let forecast = [];
let loadingOverlay = document.getElementById("loadingOverlay");

//  أول ما الصفحة تفتح
window.addEventListener("load", () => {
  // هنا بنستخدم window.addEventListener("load") علشان الكود يشتغل بعد ما كل العناصر في الصفحة تجهز.
  // يعني أول ما تفتح الصفحة → يتنفذ الكود الخاص بتحديد الموقع.

  if ("geolocation" in navigator) {
    // — بيتحقق إذا كان المتصفح يدعم Geolocation API. لو مش مدعوم، ينفذ else ويستخدم "Alex" كـ fallback.

    navigator.geolocation.getCurrentPosition(
      // هاي الدالة غير متزامنة: بتفتح نافذة طلب إذن للمستخدم، وإذا وافق ترجع الـ position في دالة success، وإلا تنفذ error.

      (pos) => {
        // pos كائن يحتوي coords و timestamp.

        const { latitude, longitude } = pos.coords;
        // pos.coords.latitude و pos.coords.longitude هما خط العرض والطول.

        alert(`تم العثور علي موقعك ✅`);
        // استدعاء API بالـ lat,lon
        getWeather(`${latitude},${longitude}`);
        // getWeather(${latitude},${longitude}) — بتنادي دالتك لجلب الطقس وبتجيب البلد الي ف موقع
      },
      (err) => {
        alert(` لم أستطع جلب موقعك⚠️`);
        getWeather("Alex");
      },
      { enableHighAccuracy: true, timeout: 10000 }
      // enableHighAccuracy: true → يطلب دقة أعلى (GPS) — قد يأخذ وقت/بطارية أكثر.
      // timeout: 10000 → لو لم تُحدد الإحداثيات خلال 10 ثواني، سيتم استدعاء error مع كود 3.
    );
  } else {
    alert("⚠️ متصفحك لا يدعم تحديد الموقع. سيتم عرض الطقس لمدينة الإسكندرية.");
    getWeather("Alex");
  }
});

inputSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    let inputData = inputSearch.value.trim();
    // trim() عشان يمسح المسافات الفاضية.
    if (inputData !== "") {
      getWeather(inputData);
      console.log(inputData);
    }
  }
  // لو المستخدم كتب مدينة وضغط Enter → يستدعي getWeather().
});

btn.addEventListener("click", () => {
  let inputData = inputSearch.value.trim();
  // trim() عشان يمسح المسافات الفاضية.
  if (inputData !== "") {
    getWeather(inputData);
  }
  //  لو ضغط زرار البحث  يستدعي getWeather()ء.
});

async function getWeather(city) {
  try {
    // قبل ما يبدأ التحميل → يظهر overlay (loading spinner).

    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=1c67aade343d42f59f5124501241406&q=${city}`
    );
    // fetch 👉 بيجيب البيانات من API لمكان معين.
    let data = await response.json();
    console.log(data);

    // await response.json() 👉 يحول البيانات من JSON لكائن JavaScript.

    nameCity = data.location.name;
    // nameCity (اسم المدينة).

    currentData = data.current;
    // currentData (الحالة الحالية).

    forecast = data.forecast.forecastday;
    // forecast (الأيام).

    displayWeather();
    // بعدين يستدعي displayWeather() لعرض البيانات على الصفحة.
    inputSearch.value = "";
    // search بيبقي فاضي
  } catch (error) {
    console.error("Error:", error);
  } finally {
    document.body.classList.add("loaded");
  }

  // في الآخر → يخفي الـ overlay تاني.
  // سواء ف error او الdata جت
}

function displayWeather() {
  let dayData = forecast[0];
  let hours = dayData.hour;
  console.log(hours);
  let dateObj = new Date(dayData.date);
  // هنا بتحول القيمة اللي جاية من الـ API (زي "2025-09-05") إلى كائن تاريخ (Date object) في جافاسكريبت.
  // يعني dateObj دلوقتي بقى عبارة عن تاريخ كامل جافاسكريبت يقدر يتعامل معاه (اليوم + الشهر + السنة + التوقيت الافتراضي).
  let formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    // toLocaleDateString → دي ميثود في الـ Date بتخلي التاريخ يتعرض بصيغة مناسبة حسب اللغة أو الـ locale اللي تختاره (هنا: "en-US").
    // الباراميتر التاني { weekday: "long" } بيقولله: "هاتلي اليوم (weekday) باسم كامل".
  });

  cartona = `
    <div class="text-center mb-5 text-white">
      <h1
        class="display-1 fw-bolder animate__animated animate__fadeInDown"
      >
        ${nameCity}
      </h1>
      <h3 class="animate__animated animate__fadeInUp animate__delay-1s">
        ${formattedDate}  <span>${dayData.date}</span>
      </h3>
    </div>

  

      <div class="row g-3 my-4">
            <div class="col-12 col-md-3 animate__animated animate__fadeInUp">
              <div class="card text-center h-100">
                <p>
                  <i class="fa-solid fa-temperature-high"></i> Max-Temp : ${dayData.day.maxtemp_c}
                  <sup class="fs-3 top-0">°</sup><br />
                  <i class="fa-solid fa-temperature-low"></i> Min-Temp : ${dayData.day.mintemp_c}
                  <sup class="fs-3 top-0">°</sup>
                </p>
              </div>
            </div>

            <div
              class="col-12 col-md-3 animate__animated animate__fadeInUp animate__delay-1s"
            >
              <div class="card text-center h-100">
                <p><i class="fa-solid fa-wind"></i> Wind-kph :${dayData.day.maxwind_mph}</p>
              </div>
            </div>

            <div
              class="col-12 col-md-3 animate__animated animate__fadeInUp animate__delay-2s"
            >
              <div class="card text-center h-100">
                <p>Sunrise : ${dayData.astro.sunrise}  <br />Sunset :${dayData.astro.sunset} </p>
              </div>
            </div>

            <div
              class="col-12 col-md-3 animate__animated animate__fadeInUp animate__delay-3s"
            >
              <div class="card text-center h-100">
                <p class="m-0">${dayData.day.condition.text} <img src="${dayData.day.condition.icon}" alt="" /></p>
              </div>
            </div>
          </div>

           <div class="text-center text-white  animate__animated animate__zoomIn animate__delay-1s">
                <h1 class="display-2 fw-bold">
                ${currentData.temp_c}<sup>°</sup>c
                </h1>
                <p class="fs-3 m-0">${currentData.condition.text}</p>
                <img src="${currentData.condition.icon}" class="photo" alt="" />
          </div>

          
          
  `;

  let hourCards = "";

  for (let i = 0; i < hours.length; i++) {
    let hour = hours[i];
    let dateObj = new Date(hour.time);

    // نجيب الوقت بصيغة 12 ساعة مع AM/PM
    let time12 = dateObj.toLocaleTimeString("en-US", {
      hour: "numeric", // يعرض الساعة (مثلاً 6 أو 12)
      minute: "2-digit", // يعرض الدقايق (مثلاً 00 أو 05)
      hour12: true, // يخليها بصيغة 12 ساعة مع AM/PM
    });

    hourCards += `
      <div class="hour-card animate__animated animate__fadeInDown animate__delay-1s ">
            <div>${time12} </div>
            <div class="temp">${hour.temp_c}°</div>
            <div>${hour.condition.text.split(" ", 1).join(" ")}</div>
            <div> <img src="${hour.condition.icon}" alt="" /></div>
          </div>
    `;
  }

  document.getElementById("weatherContainer").innerHTML = cartona;
  document.getElementById("hourCards").innerHTML = hourCards;
}
