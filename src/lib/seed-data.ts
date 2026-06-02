// داده‌های اولیه فروشگاه استوک سیتی — استخراج‌شده از لیست کالاهای مغازه.
// این داده‌ها فقط یک‌بار (هنگام خالی بودن دیتابیس) درج می‌شوند و بعداً از پنل ادمین قابل ویرایش‌اند.

export interface SeedCategory {
    slug: string
    name: string
    sort_order: number
}

export interface SeedBrand {
    slug: string
    name: string
}

export interface SeedProduct {
    model_number: string
    title: string
    brandName: string
    categorySlug: string
    specifications: Record<string, string>
    key_features: string[]
    stock_status: "in_stock" | "call_for_price" | "out_of_stock"
    stock_quantity: number | null
}

/* دسته‌بندی‌ها                                                          */
export const seedCategories: SeedCategory[] = [
    { slug: "contactor", name: "کنتاکتور", sort_order: 1 },
    { slug: "contactor-reversing", name: "کنتاکتور اکبند", sort_order: 2 },
    { slug: "miniature", name: "کلید مینیاتوری", sort_order: 3 },
    { slug: "mccb", name: "کلید اتوماتیک", sort_order: 4 },
]

/* ابزار کمکی ساخت محصول                                                */
const slugify = (s: string) =>
    s
        .toLowerCase()
        .trim()
        .replace(/\+/g, "-")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

// کنتاکتور
function contactor(
    code: string,
    brand: string,
    amp: string,
    qty: number | null = null,
): SeedProduct {
    return {
        model_number: code,
        title: `کنتاکتور ${brand} ${amp}`,
        brandName: brand,
        categorySlug: "contactor",
        specifications: { نوع: "کنتاکتور قدرت", "جریان نامی": amp, برند: brand },
        key_features: [
            "مناسب راه‌اندازی موتورهای صنعتی",
            "بدنه مقاوم و کنتاکت‌های نقره‌ای با عمر بالا",
            "قابل نصب روی ریل و تابلوی برق",
        ],
        stock_status: "in_stock",
        stock_quantity: qty,
    }
}

// کنتاکتور اکبند (دارای اینترلاک مکانیکی برای چپگرد/راستگرد)
function reversing(code: string, brand: string, amp: string): SeedProduct {
    return {
        model_number: code,
        title: `کنتاکتور اکبند ${brand} ${amp}`,
        brandName: brand,
        categorySlug: "contactor-reversing",
        specifications: {
            نوع: "کنتاکتور اکبند (اینترلاک)",
            "جریان نامی": amp,
            برند: brand,
        },
        key_features: [
            "مجهز به اینترلاک مکانیکی جهت تغییر جهت موتور",
            "ایمنی بالا در مدارهای چپگرد/راستگرد",
            "نصب آسان روی ریل استاندارد",
        ],
        stock_status: "in_stock",
        stock_quantity: null,
    }
}

// کلید مینیاتوری
function miniature(
    code: string,
    brand: string,
    curve: string,
    poles: string = "تک پل",
): SeedProduct {
    return {
        model_number: code,
        title: `کلید مینیاتوری ${brand} ${curve} (${poles})`,
        brandName: brand,
        categorySlug: "miniature",
        specifications: {
            نوع: "کلید مینیاتوری (MCB)",
            "منحنی/جریان": curve,
            "تعداد پل": poles,
            برند: brand,
        },
        key_features: [
            "حفاظت در برابر اضافه‌بار و اتصال‌کوتاه",
            "قطع سریع و مطمئن مدار",
            "قابل نصب روی ریل DIN",
        ],
        stock_status: "in_stock",
        stock_quantity: null,
    }
}

// کلید اتوماتیک (کمپکت)
function mccb(
    code: string,
    brand: string,
    amp: string,
    kind: "تنظیمی" | "فیکس",
    qty: number | null,
    extra: string = "",
): SeedProduct {
    const title = `کلید اتوماتیک ${kind} ${brand} ${amp}${extra ? " " + extra : ""}`
    return {
        model_number: code,
        title,
        brandName: brand,
        categorySlug: "mccb",
        specifications: {
            نوع: `کلید اتوماتیک ${kind}`,
            "جریان نامی": amp,
            برند: brand,
            ...(extra ? { توضیح: extra } : {}),
        },
        key_features: [
            "حفاظت اصلی تابلوهای توزیع برق",
            kind === "تنظیمی" ? "جریان قطع قابل تنظیم" : "جریان قطع ثابت کارخانه‌ای",
            "قدرت قطع بالا و طول عمر زیاد",
        ],
        stock_status: qty && qty > 0 ? "in_stock" : "call_for_price",
        stock_quantity: qty,
    }
}

/* محصولات                                                             */
const contactors: SeedProduct[] = [
    contactor("1000009", "Schneider", "9A"),
    contactor("1000012", "Schneider", "12A"),
    contactor("1000018", "Schneider", "18A"),
    contactor("1000032", "Schneider", "32A"),
    contactor("1000050", "Schneider", "50A"),
    contactor("1000065", "LS", "65A"),
    contactor("1000075", "Hyundai", "75A"),
    contactor("1000085", "LS", "85A"),
    contactor("1000090", "Telemecanique", "90A"),
    contactor("1000150", "Schneider", "150A"),
    contactor("1000165", "Schneider", "65A"),
    contactor("1000682", "LS", "22A"),
    contactor("1000684", "Telemecanique", "65A"),
    contactor("1000685", "Telemecanique", "40A"),
    contactor("1000686", "Telemecanique", "50A"),
    contactor("1000687", "Siemens", "60A"),
    contactor("1000688", "Siemens", "45A"),
    contactor("1000689", "MEC", "75A"),
    contactor("1000690", "MEC", "65A"),
    contactor("1000691", "MEC", "100A"),
    contactor("1000692", "Telemecanique", "18A"),
    contactor("1000693", "Telemecanique", "32A"),
    contactor("1000694", "Telemecanique", "9A"),
    contactor("1000695", "Telemecanique", "12A"),
    contactor("1000696", "Chint", "9A"),
    contactor("1000697", "Chint", "32A"),
    contactor("1000698", "Sprecher+Schuh", "9A"),
    contactor("1000699", "Eaton", "9A"),
    contactor("1000700", "Allen-Bradley", "32A"),
    contactor("1000701", "Himel", "265A"),
    contactor("1000702", "Schneider", "265A"),
    contactor("1000703", "Sprecher+Schuh", "140-380A"),
    contactor("1000704", "Sprecher+Schuh", "180A"),
    contactor("1000705", "RK", "CNN-75 / 75A"),
    contactor("1000714", "Telemecanique", "80A"),
    contactor("1000715", "Hyundai", "400A"),
    contactor("1000716", "Siemens", "210A"),
    contactor("1000717", "Siemens", "300A"),
    contactor("1000718", "LS", "12A"),
    contactor("1000719", "LS", "9A"),
    contactor("1000720", "Schneider", "185A"),
    contactor("1000721", "LS", "80A"),
    contactor("1000722", "Chint", "CJX 18A"),
    contactor("1000723", "Chint", "CJX 12A"),
    contactor("1000724", "Schwan", "9A"),
    contactor("1000725", "Schwan", "12A"),
]

const reversings: SeedProduct[] = [
    reversing("1000706", "Hyundai", "18A"),
    reversing("1000707", "Kaveh", "E80 / 80A"),
    reversing("1000708", "Himel", "32A"),
    reversing("1000709", "Hyundai", "32A"),
    reversing("1000710", "ABB", "50A (24V)"),
    reversing("1000711", "Hyundai", "65A"),
    reversing("1000712", "ABB", "26A (24V)"),
    reversing("1000713", "ABB", "9A (24V)"),
]

const miniatures: SeedProduct[] = [
    miniature("1010001", "Hyundai", "C16"),
    miniature("1010002", "Hyundai", "C25"),
    miniature("1010003", "Hyundai", "C32"),
    miniature("1010004", "Hyundai", "C4"),
    miniature("1010005", "Hyundai", "C6"),
    miniature("1010007", "Merlin Gerin", "C25"),
    miniature("1010008", "Merlin Gerin", "C16"),
    miniature("1010009", "Merlin Gerin", "C10"),
    miniature("1010010", "Merlin Gerin", "C6"),
    miniature("1010011", "Schneider", "C25"),
    miniature("1010012", "Schneider", "C6"),
    miniature("1010013", "Faraz", "C25"),
    miniature("1010014", "Faraz", "C16"),
    miniature("1010015", "Sassin", "C25"),
    miniature("1010016", "Sassin", "C6"),
    miniature("1010017", "Unelec", "C16"),
    miniature("1010018", "Unelec", "C10"),
    miniature("1010019", "F&G", "C10"),
    miniature("1010020", "F&G", "C6"),
    miniature("1010021", "Schwan", "C16"),
    miniature("1010022", "iPTK", "C6"),
    miniature("1010023", "Himel", "C6"),
    miniature("1010024", "Setin", "C25"),
    miniature("1010025", "Pitek", "C32"),
    miniature("1010026", "Kaveh", "C63"),
    miniature("1010027", "Shiran", "B6"),
    miniature("1010028", "Shiran", "C10"),
    miniature("1010029", "Shiran", "C16"),
    miniature("1010030", "Eaton", "xPole B6"),
    miniature("1010031", "Eaton", "xPole C25"),
    miniature("1010032", "Eaton", "xPole C40"),
    miniature("1010033", "Eaton", "xPole C16"),
    miniature("1010034", "Eaton", "xPole C10"),
    miniature("1010035", "Kupp", "B10"),
    miniature("1010036", "Hyundai", "C16", "دو پل"),
]

const mccbs: SeedProduct[] = [
    mccb("1020111", "LS", "100A", "تنظیمی", 11),
    mccb("1020129", "Dorman Smith", "63A", "تنظیمی", 1),
    mccb("1020131", "Siemens", "800A", "تنظیمی", 2),
    mccb("1020132", "Merlin Gerin", "250A", "فیکس", 2),
    mccb("1020143", "Zavir", "250A", "تنظیمی", 1),
    mccb("1020148", "LS", "100A", "تنظیمی", 1, "چهار پل"),
    mccb("1020149", "Siemens", "160A", "تنظیمی", 1),
    mccb("2000100", "Schneider", "70-100A", "تنظیمی", 18),
    mccb("2000103", "Schneider", "60A", "فیکس", 5),
    mccb("2000104", "Schneider", "30A", "فیکس", 1),
    mccb("2000106", "Schneider", "1600A", "تنظیمی", 2),
    mccb("2000113", "LS", "75A", "فیکس", 4),
    mccb("2000114", "LS", "175A", "فیکس", 1),
    mccb("2000115", "LS", "250A", "تنظیمی", 1),
    mccb("2000118", "ABB", "500A", "تنظیمی", 1),
    mccb("2000119", "ABB", "800A", "تنظیمی", 1),
    mccb("2000120", "ABB", "400A", "تنظیمی", 1),
    mccb("2000121", "ABB", "1250A", "تنظیمی", 1),
    mccb("2000123", "CBI", "100A", "تنظیمی", 1),
    mccb("2000124", "CBI", "63A", "تنظیمی", 1),
    mccb("2000125", "Moeller", "160A", "تنظیمی", 1),
    mccb("2000126", "Moeller", "20A", "تنظیمی", 1),
    mccb("2000127", "Pars Fanal", "150A", "فیکس", 1),
    mccb("2000134", "Merlin Gerin", "250A", "تنظیمی", 1),
    mccb("2000135", "Hyundai", "400A", "تنظیمی", 1),
    mccb("2000136", "Hyundai", "60A", "فیکس", 2),
    mccb("2000137", "Hyundai", "32A", "فیکس", 1),
]

export const seedProducts: SeedProduct[] = [
    ...contactors,
    ...reversings,
    ...miniatures,
    ...mccbs,
]

/* برندها به‌صورت خودکار از روی محصولات ساخته می‌شوند */
export const seedBrands: SeedBrand[] = Array.from(
    new Set(seedProducts.map((p) => p.brandName)),
)
    .sort()
    .map((name) => ({ name, slug: slugify(name) }))

export { slugify }
