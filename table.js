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

function make_simple_table({ make_header_row, num_rows, make_tr }) {
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

function maybe_stripe(elem, i, color) {
    if (i % 2) {
        setStyles(elem, {
            background: color,
        });
    }

    return elem;
}

function build_integer_table() {
    const primes = [2, 3, 5, 7, 11, 13];
    const current_ints = primes;

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
        return table;
    }

    function container() {
        return document.querySelector("#integers");
    }

    function num_rows() {
        return current_ints.length;
    }

    function make_header_row() {
        const elem = dom_header_row(integer_headers);
        setStyles(elem, {
            background: "darkseagreen",
            color: "darkblue",
        });
        return elem;
    }

    function style_td_n(td) {
        td = style_generic_td(td);
        return setStyles(td, {
            color: "blue",
        });
    }

    function style_td_square(td) {
        td = style_generic_td(td);
        return setStyles(td, {
            color: "darkred",
            width: "70px",
            fontSize: "150%",
        });
    }

    function style_tr(tr, i) {
        return maybe_stripe(tr, i, "lightgray");
    }

    function make_td_id(n, field) {
        return `integer-table-${n}-${field}`;
    }

    function square_str(n) {
        return `${n * n}`;
    }

    function make_td_n(n) {
        const id = make_td_id(n, "n");
        const td = dom_td({ id, elem: `${n}`});
        return style_td_n(td);
    }

    function make_td_square(n) {
        const id = make_td_id(n, "square");
        const td = dom_td({ id, elem: square_str(n) });
        return style_td_square(td);
    }

    function make_tr(i) {
        const n = current_ints[i];
        const tr = dom_tr([make_td_n(n), make_td_square(n)]);
        return style_tr(tr, i);
    }

    const table = make_simple_table({
        make_header_row,
        num_rows: num_rows(),
        make_tr,
    });
    table.id = "integer_table";
    style_integer_table(table);
    container().append(table);
}

function style_generic_table(table) {
    setStyles(table, {
        border: "1px solid black",
        borderCollapse: "collapse",
    });

    for (const th of table.querySelectorAll("th")) {
        setStyles(th, {
            border: "1px solid black",
            padding: "4px",
        });
    }
}

function style_generic_td(td) {
    setStyles(td, {
        border: "1px solid black",
        padding: "4px",
    });
    return td;
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
    return elem;
}

build_integer_table();
