/* ============================================
   بيانات المدن والأحياء في المملكة العربية السعودية
   ============================================ */

const saudiCities = {
    riyadh: {
        name: "الرياض",
        districts: ["الياسمين","النرجس","الملقا","حطين","العقيق","الصحافة","قرطبة","الرمال","النسيم","النسيم الشرقي","النسيم الغربي","اليرموك","الخليج","الشفا","بدر","العزيزية","العليا","الملز","السليمانية","الروضة","الحمراء","الفيحاء","النعيم","النخيل","الفلاح","الخرج","الورود","الأسكان","المونسية"]
    },
    jeddah: {
        name: "جدة",
        districts: ["الروضة","الزهراء","الشاطئ","السلامة","النعيم","البساتين","الحمراء","الصفا","الربوة","الفيصلية","الجامعة","البلد","أبحر","الحمدانية"]
    },
    makkah: {
        name: "مكة المكرمة",
        districts: ["العزيزية","العوالي","الشرائع","بطحاء قريش","الكعكية","المعابدة","الحجون","العتيبية","النوارية"]
    },
    madinah: {
        name: "المدينة المنورة",
        districts: ["قربان","شوران","العريض","العزيزية","الدفاع","الروضة","الخالدية"]
    },
    dammam: {
        name: "الدمام",
        districts: ["الشاطئ","الفيصلية","الروضة","الخليج","الواحة","الريان"]
    },
    khobar: {
        name: "الخبر",
        districts: ["العقربية","الراكة","الثقبة","الحزام الذهبي","الخزامى","اليرموك"]
    },
    taif: {
        name: "الطائف",
        districts: ["الشفا","الهدا","الحوية","شهار","السداد"]
    },
    abha: {
        name: "أبها",
        districts: ["المنسك","الموظفين","الخالدية","السد","شمسان"]
    },
    khamis: {
        name: "خميس مشيط",
        districts: ["الواحة","الريان","النزهة","الخالدية","الشفا"]
    },
    buraydah: {
        name: "بريدة",
        districts: ["الريان","النهضة","الروضة","الصفاء","الإسكان"]
    },
    unayzah: {
        name: "عنيزة",
        districts: ["الروضة","الريان","الواحة","السلام","المنار"]
    },
    tabuk: {
        name: "تبوك",
        districts: ["الورود","المروج","الفيصلية","الصفا","النهضة"]
    },
    hail: {
        name: "حائل",
        districts: ["النقرة","المنتزه","الشفاء","الوسيطاء","الخزامى"]
    },
    jizan: {
        name: "جازان",
        districts: ["السويس","الروضة","المطار","الشاطئ","الصفا"]
    },
    najran: {
        name: "نجران",
        districts: ["الفيصلية","الخالدية","الروضة","العريسة"]
    },
    baha: {
        name: "الباحة",
        districts: ["الظفير","الحاوية","الرغدان","الشفا"]
    },
    sakaka: {
        name: "سكاكا",
        districts: ["اللقائط","الربوة","الفيصلية","المروج"]
    },
    arar: {
        name: "عرعر",
        districts: ["المساعدية","المنصورية","الفيصلية","بدنة"]
    },
    ahsa: {
        name: "الأحساء",
        districts: ["المبرز","الفيصلية","الروضة","النسيم","الريان"]
    },
    jubail: {
        name: "الجبيل",
        districts: ["الفناتير","الحويلات","الفيحاء","الندى"]
    },
    yanbu: {
        name: "ينبع",
        districts: ["البحر","السميري","الصناعية","الشرم"]
    },
    qatif: {
        name: "القطيف",
        districts: ["سيهات","تاروت","القديح","صفوى","العوامية"]
    }
};

const governorateNames = {
    riyadh: "الرياض", jeddah: "جدة", makkah: "مكة المكرمة",
    madinah: "المدينة المنورة", dammam: "الدمام", khobar: "الخبر",
    taif: "الطائف", abha: "أبها", khamis: "خميس مشيط",
    buraydah: "بريدة", unayzah: "عنيزة", tabuk: "تبوك",
    hail: "حائل", jizan: "جازان", najran: "نجران",
    baha: "الباحة", sakaka: "سكاكا", arar: "عرعر",
    ahsa: "الأحساء", jubail: "الجبيل", yanbu: "ينبع", qatif: "القطيف"
};

function loadRegions() {
    const governorateSelect = document.getElementById('governorate');
    const regionSelect = document.getElementById('region');
    const districtInput = document.getElementById('district');
    const selectedGovernorate = governorateSelect.value;

    regionSelect.innerHTML = '<option value="">اختر المنطقة</option>';
    districtInput.value = '';

    if (selectedGovernorate && saudiCities[selectedGovernorate]) {
        saudiCities[selectedGovernorate].districts.forEach(district => {
            const option = document.createElement('option');
            option.value = district;
            option.textContent = district;
            regionSelect.appendChild(option);
        });
    }
}

function loadDistricts() {
    const regionSelect = document.getElementById('region');
    const districtInput = document.getElementById('district');
    if (regionSelect.value) {
        districtInput.value = regionSelect.value;
    }
}
