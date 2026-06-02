/* ============================================
   منطق الحجز المشترك
   ============================================ */

// أسعار الحجز بالساعة
const hourlyPrices = {
    morning: { '4': 60, '6': 80, '8': 100, '10': 130 },
    evening: { '4': 65, '6': 95, '8': 115, '10': 155 }
};

// أسعار الحجز الشهري
const monthlyPrices = {
    '1': 800,
    '2': 1400,
    '3': 1800
};

// أسعار الحجز المقيم
const residentPrices = {
    '1': 1200,
    '3': 3200,
    '6': 5800,
    '12': 10000
};

function updateHourlyPrice() {
    const hours = document.getElementById('hours')?.value;
    const workersCount = document.getElementById('workers_count')?.value;
    const period = document.getElementById('pickup_period')?.value;
    const priceDisplay = document.getElementById('price_display');
    const priceText = document.getElementById('price_text');
    const priceExplanation = document.getElementById('price_explanation');

    if (!hours || !workersCount || !period || !priceDisplay) return;

    if (hourlyPrices[period] && hourlyPrices[period][hours]) {
        const basePrice = hourlyPrices[period][hours];
        const totalPrice = basePrice * parseInt(workersCount);
        priceText.textContent = totalPrice + ' ريال';
        if (parseInt(workersCount) > 1) {
            priceExplanation.textContent = `السعر الأساسي: ${basePrice} ريال × ${workersCount} عاملات = ${totalPrice} ريال`;
        } else {
            priceExplanation.textContent = `السعر الأساسي: ${basePrice} ريال لعاملة واحدة`;
        }
        priceDisplay.style.display = 'block';
    } else {
        priceDisplay.style.display = 'none';
    }
}

function updateMonthlyPrice() {
    const months = document.getElementById('months')?.value;
    const workersCount = document.getElementById('workers_count')?.value;
    const priceDisplay = document.getElementById('price_display');
    const priceText = document.getElementById('price_text');
    const priceExplanation = document.getElementById('price_explanation');

    if (!months || !workersCount || !priceDisplay) return;

    const basePrice = monthlyPrices[months] || 0;
    if (basePrice) {
        const totalPrice = basePrice * parseInt(workersCount);
        priceText.textContent = totalPrice + ' ريال / شهر';
        if (parseInt(workersCount) > 1) {
            priceExplanation.textContent = `السعر الأساسي: ${basePrice} ريال × ${workersCount} عاملات = ${totalPrice} ريال`;
        } else {
            priceExplanation.textContent = `السعر الأساسي: ${basePrice} ريال لعاملة واحدة`;
        }
        priceDisplay.style.display = 'block';
    } else {
        priceDisplay.style.display = 'none';
    }
}

function updateResidentPrice() {
    const duration = document.getElementById('duration')?.value;
    const priceDisplay = document.getElementById('price_display');
    const priceText = document.getElementById('price_text');
    const priceExplanation = document.getElementById('price_explanation');

    if (!duration || !priceDisplay) return;

    const price = residentPrices[duration] || 0;
    if (price) {
        priceText.textContent = price + ' ريال';
        const durationText = duration === '1' ? 'شهر واحد' : duration === '3' ? '3 أشهر' : duration === '6' ? '6 أشهر' : 'سنة كاملة';
        priceExplanation.textContent = `السعر الإجمالي لـ ${durationText}`;
        priceDisplay.style.display = 'block';
    } else {
        priceDisplay.style.display = 'none';
    }
}

// حفظ بيانات الخطوة مؤقتاً في الجلسة الحالية
function saveStep(stepNum, data) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    sessionStorage.setItem(key, JSON.stringify(data));
}

function getCurrentBookingIdKey(bookingType) {
    return `booking_${bookingType}_current_id`;
}

function getBookingsCollection() {
    if (!window.isFirebaseReady || !window.db) {
        throw new Error('Firebase Firestore is not configured. Paste your Firebase config in firebase-config.js.');
    }

    return window.db.collection('bookings');
}

async function upsertBookingProgress(bookingType, data, status = 'incomplete') {
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now();
        sessionStorage.setItem(currentIdKey, bookingId);
    }

    const bookingRef = getBookingsCollection().doc(bookingId);
    const existingBooking = await bookingRef.get();
    const bookingData = {
        ...data,
        id: bookingId,
        booking_type: bookingType,
        updatedAt: now,
        status
    };

    if (!existingBooking.exists) {
        bookingData.createdAt = now;
    }

    await bookingRef.set(bookingData, { merge: true });
    return bookingId;
}

// قراءة بيانات خطوة من الجلسة الحالية
function loadStep(stepNum) {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    const key = `booking_${bookingType}_step${stepNum}`;
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// مسح بيانات الحجز الحالي
function clearBooking() {
    const bookingType = window.BOOKING_TYPE || 'hourly';
    for (let i = 1; i <= 4; i++) {
        sessionStorage.removeItem(`booking_${bookingType}_step${i}`);
    }
}

// حفظ الحجز المكتمل في قاعدة بيانات الحجوزات
async function saveCompletedBooking(bookingData) {
    const bookingType = bookingData.booking_type || sessionStorage.getItem('current_booking_type') || window.BOOKING_TYPE || 'hourly';
    const currentIdKey = getCurrentBookingIdKey(bookingType);
    let bookingId = sessionStorage.getItem(currentIdKey);
    const now = new Date().toISOString();

    if (!bookingId) {
        bookingId = 'BK-' + Date.now();
    }

    const completedBooking = {
        ...bookingData,
        id: bookingId,
        booking_type: bookingType,
        updatedAt: now,
        status: bookingData.status || 'completed'
    };

    const bookingRef = getBookingsCollection().doc(bookingId);
    const existingBooking = await bookingRef.get();

    if (!existingBooking.exists) {
        completedBooking.createdAt = now;
    }

    await bookingRef.set(completedBooking, { merge: true });
    sessionStorage.removeItem(currentIdKey);
    return bookingId;
}

// تشغيل صوت النجاح
function playSuccessSound() {
    const audio = document.getElementById('success-sound');
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
    }
}

// الأسماء العربية للجنسيات
const nationalityNames = {
    filipina: 'فلبينية', indonesian: 'إندونيسية', indian: 'هندية',
    srilankan: 'سريلانكية', nepali: 'نيبالية', ethiopian: 'إثيوبية', other: 'أخرى'
};

// الأسماء العربية للمحافظات
const governorateNamesMap = {
    riyadh: "الرياض", jeddah: "جدة", makkah: "مكة المكرمة",
    madinah: "المدينة المنورة", dammam: "الدمام", khobar: "الخبر",
    taif: "الطائف", abha: "أبها", khamis: "خميس مشيط",
    buraydah: "بريدة", unayzah: "عنيزة", tabuk: "تبوك",
    hail: "حائل", jizan: "جازان", najran: "نجران",
    baha: "الباحة", sakaka: "سكاكا", arar: "عرعر",
    ahsa: "الأحساء", jubail: "الجبيل", yanbu: "ينبع", qatif: "القطيف"
};
