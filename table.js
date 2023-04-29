function dom_header_row(headers) {
    const tr = document.createElement("tr");
    for (const h of headers) {
        const th = document.createElement("th");
        th.id = h.id;
        th.innerHTML = h.innerHTML;
        tr.append(th);
    }
    return tr;
}

function dom_tr(child_elems) {
    const tr = document.createElement("tr");
    tr.append(...child_elems);
    return tr;
}

function dom_td({ id, elem }) {
    const td = document.createElement("td");
    td.id = id;
    td.append(elem);
    return td;
}

function style_generic_table(table) {
    setStyles(table, {
        border: "1px solid blue",
        borderCollapse: "collapse",
    });

    for (const th of table.querySelectorAll("th")) {
        setStyles(th, {
            border: "1px solid blue",
            padding: "4px",
        });
    }
}

function style_generic_td(td) {
    setStyles(td, {
        border: "1px solid blue",
        padding: "4px",
    });
    return td;
}

function make_table({ make_header_row, num_rows, make_tr }) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    table.append(thead);
    thead.append(make_header_row());

    const tbody = document.createElement("tbody");
    table.append(tbody);

    for (let i = 0; i < num_rows; ++i) {
        tbody.append(make_tr(i));
    }

    return table;
}

function build_integer_table() {
    const integer_data = [
        { n: 0, square: 0 },
        { n: 1, square: 1 },
        { n: 2, square: 4 },
        { n: 3, square: 9 },
        { n: 4, square: 16 },
        { n: 5, square: 25 },
        { n: 6, square: 36 },
    ];

    // assume innerHTML comes from calling some templates or whatever
    const integer_headers = [
        { id: "n", innerHTML: "Number" },
        { id: "square", innerHTML: "n<sup>2</sup>" },
    ];

    function style_integer_table(table) {
        style_generic_table(table);
        setStyles(table, {
            textAlign: "center",
        });
        setStyles(table.querySelector("thead"), {
            background: "darkseagreen",
        });
    }

    function container() {
        return document.querySelector("#integers");
    }

    function num_rows() {
        return integer_data.length;
    }

    function make_header_row() {
        return dom_header_row(integer_headers);
    }

    function style_td_n(td) {
        return style_generic_td(td);
    }

    function style_td_square(td) {
        td = style_generic_td(td);
        setStyles(td, {
            background: "antiquewhite",
            color: "blue",
            width: "60px",
        });
        return td;
    }

    function make_td_n(data) {
        const td = dom_td({ id: `n-${data.n}`, elem: data.n });
        return style_td_n(td);
    }

    function make_td_square(data) {
        const td = dom_td({ id: `square-${data.n}`, elem: data.square });
        return style_td_square(td);
    }

    function make_tr(i) {
        const data = integer_data[i];
        const td_makers = [make_td_n, make_td_square];
        return dom_tr([make_td_n(data), make_td_square(data)]);
    }

    const table = make_table({
        make_header_row,
        num_rows: num_rows(),
        make_tr,
    });
    table.id = "integer_table";
    style_integer_table(table);
    container().append(table);
}

function setStyles(elem, styles) {
    const info = [];
    const label = elem.id
        ? `#${elem.id}`
        : elem.className
        ? `.${elem.className}`
        : elem.tagName;

    info.push(`\nSetting styles for ${label}\n`);

    for (const [f, v] of Object.entries(styles)) {
        info.push(`  ${f}: ${v};`);
        elem.style[f] = v;
    }

    // console.trace(info.join("\n"));
}

build_integer_table();
