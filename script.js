/* =====================================================
   ASTRALIS 会計計算機
===================================================== */

/* =========================
   商品マスタ
========================= */

const productMaster = [

    {
        name: "ルナリア・ベア",
        price: 50000
    },

    {
        name: "オーレリア・ベア",
        price: 100000
    },

    {
        name: "クリスタル・ブルーム",
        price: 50000
    },

    {
        name: "ルナ・エクラ",
        price: 50000
    },

    {
        name: "フルール・ジュエル",
        price: 50000
    },

    {
        name: "ルナ・アメジスト",
        price: 50000
    },

    {
        name: "オーロラ・キス",
        price: 100000
    },

    {
        name: "ルビー・ロゼ",
        price: 100000
    },

    {
        name: "エメラルド・ミスト",
        price: 100000
    },

    {
        name: "パープル・ミラージュ",
        price: 100000
    },

    {
        name: "期間限定商品（30％）",
        price: 50000
    },

    {
        name: "期間限定商品（50％）",
        price: 100000
    }
];

/* =========================
   現在の商品
========================= */

let products = [];


/* =========================
   商品追加
========================= */

function addProduct() {

    products.push({

        name: "",

        price: 0,

        quantity: 1

    });

    updateDisplay();

}


/* =========================
   商品削除
========================= */

function deleteProduct(index) {

    products.splice(index, 1);

    updateDisplay();

}


/* =========================
   商品変更
========================= */

function updateProduct(index, field, value) {

    if (!products[index]) {
        return;
    }


    /* 商品 */

    if (field === "name") {

        products[index].name = value;

        const selectedProduct =
            productMaster.find(
                product => product.name === value
            );

        if (selectedProduct) {

            products[index].price =
                selectedProduct.price;

        } else {

            products[index].price = 0;

        }

    }


    /* 数量 */

    if (field === "quantity") {

        let quantity = Number(value);

        if (
            !Number.isFinite(quantity) ||
            quantity < 0
        ) {

            quantity = 0;

        }

        products[index].quantity = quantity;

    }


    updateDisplay();

}


/* =========================
   商品プルダウン
========================= */

function createProductOptions(selectedName) {

    let html = "";

    html += `
        <option value="">
            商品を選択してください
        </option>
    `;


    productMaster.forEach(product => {

        const selected =
            product.name === selectedName
                ? "selected"
                : "";

        html += `
            <option
                value="${escapeHtml(product.name)}"
                ${selected}
            >
                ${escapeHtml(product.name)}
            </option>
        `;

    });


    return html;

}


/* =========================
   数量プルダウン
========================= */

function createQuantityOptions(quantity) {

    const standardQuantities =
        [10, 20, 30, 40, 50];

    let html = "";

    html += `
        <option value="">
            数量
        </option>
    `;


    standardQuantities.forEach(number => {

        const selected =
            Number(quantity) === number
                ? "selected"
                : "";

        html += `
            <option
                value="${number}"
                ${selected}
            >
                ${number}個
            </option>
        `;

    });


    return html;

}


/* =========================
   商品表示
========================= */

function updateDisplay() {

    const list =
        document.getElementById("product-list");

    list.innerHTML = "";


    products.forEach((product, index) => {

        const item =
            document.createElement("div");

        item.className = "product";


        item.innerHTML = `

            <div class="product-header">

                <span class="product-number">
                    商品 ${index + 1}
                </span>

                <button
                    class="delete-button"
                    onclick="deleteProduct(${index})"
                >
                    削除
                </button>

            </div>


            <div class="product-grid">

                <select
                    onchange="
                        updateProduct(
                            ${index},
                            'name',
                            this.value
                        )
                    "
                >

                    ${createProductOptions(product.name)}

                </select>


                <div class="quantity-box">

                    <span class="quantity-label">
                        数量
                    </span>

                    <select
                        onchange="
                            updateProduct(
                                ${index},
                                'quantity',
                                this.value
                            )
                        "
                    >

                        ${createQuantityOptions(product.quantity)}

                    </select>

                </div>

            </div>


            <div class="price-area">

                <div class="price-box">

                    <span class="price-label">
                        単価
                    </span>

                    <div class="price-value">
                        ${formatYen(product.price)}
                    </div>

                </div>


     <div class="quantity-box" style="${[10, 20, 30, 40, 50].includes(Number(product.quantity)) ? 'display:none;' : ''}">
    <span class="quantity-label">
        その他の数量
    </span>

    <input
        type="number"
        min="0"
        placeholder="自由入力"
        value="${
            [10, 20, 30, 40, 50].includes(Number(product.quantity))
                ? ""
                : product.quantity || ""
        }"
        oninput="
            updateProduct(
                ${index},
                'quantity',
                this.value
            )
        "
    >
</div>

            </div>


            <div class="product-subtotal">

                <span>
                    商品小計
                </span>

                <strong>
                    ${formatYen(
                        product.price *
                        product.quantity
                    )}
                </strong>

            </div>

        `;


        list.appendChild(item);

    });


    updateTotal();

}


/* =========================
   合計計算
========================= */

function updateTotal() {

    let subtotal = 0;


    products.forEach(product => {

        const price =
            Number(product.price) || 0;

        const quantity =
            Number(product.quantity) || 0;

        subtotal +=
            price * quantity;

    });


    /* 合計 */

    const total = subtotal;


    /* 白市民割 10%OFF */

    const whiteCitizen =
        Math.floor(total * 0.9);


    /* 初心者割 30%OFF */

    const beginner =
        Math.floor(total * 0.7);


    document.getElementById(
        "subtotal"
    ).textContent =
        formatYen(subtotal);


    document.getElementById(
        "total"
    ).textContent =
        formatYen(total);


    document.getElementById(
        "white-citizen-total"
    ).textContent =
        formatYen(whiteCitizen);


    document.getElementById(
        "beginner-total"
    ).textContent =
        formatYen(beginner);

}


/* =========================
   支払い金額
========================= */

function updatePayment() {

    const payment =
        Number(
            document.getElementById(
                "payment"
            ).value
        ) || 0;

}


/* =========================
   全クリア
========================= */

function clearAll() {

    products = [];



    updateDisplay();

}


/* =========================
   円表示
========================= */

function formatYen(value) {

    return (
        "¥" +
        Number(value || 0)
            .toLocaleString("ja-JP")
    );

}


/* =========================
   HTMLエスケープ
========================= */

function escapeHtml(value) {

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


/* =========================
   FiveM 閉じる処理
========================= */

function closeCalculator() {

    fetch(
        `https://${GetParentResourceName()}/close`,
        {

            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({})

        }
    );

}


/* =========================
   初期表示
========================= */

updateDisplay();
