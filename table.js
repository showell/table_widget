build_prime_table();

function dom_tr(...child_elems) {
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

function simple_table_widget({ make_header_row, num_rows, make_tr }) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    table.append(thead);
    thead.append(make_header_row());

    const tbody = document.createElement("tbody");
    table.append(tbody);

    function repopulate() {
        console.log("repopulate", table.id);
        tbody.innerHTML = "";
        for (let i = 0; i < num_rows; ++i) {
            tbody.append(make_tr(i));
        }
    }

    return {table, repopulate};
}

function maybe_stripe(elem, i, color) {
    if (i % 2) {
        setStyles(elem, {
            background: color,
        });
    }

    return elem;
}

function wire_up_reverse_button({th, callback}) {
    const button = document.createElement("button");
    button.innerText = "reverse";
    button.addEventListener("click", callback);
    th.append("  ", button);
}

function build_number_store(ints) {
    let my_ints = ints.slice();

    function get_integers() {
        return my_ints;
    }

    function size() {
        return my_ints.length;
    }

    function reverse() {
        my_ints.reverse();
    }

    return {get_integers, size, reverse};
}

function build_prime_store() {
    return build_number_store([2, 3, 5, 7, 11, 13, 17]);
}

function build_prime_table() {
    function container() {
        return document.querySelector("#prime_squares");
    }

    const number_store = build_prime_store();
    const table_widget = build_integer_table_widget({number_store});
    const table = table_widget.table;

    table.id = "prime_squares";
    table_widget.repopulate();
    container().append(table);

    function reverse() {
        number_store.reverse();
        table_widget.repopulate();
    }

    wire_up_reverse_button({
        th: table_widget.th_n,
        callback: reverse,
    });
}

function build_integer_table_widget({number_store}) {
    function styled_th() {
        const elem = document.createElement("th");
        return setStyles(elem, {
            background: "darkseagreen",
            color: "darkblue",
        });
    }

    function make_th_n() {
        const th = styled_th();
        th.id = "integer-th-n";
        th.append("Number");
        return th;
    }

    function make_th_square() {
        const th = styled_th();
        th.id = "integer-th-square";
        th.innerHTML = "n<sup>2</sup>";
        return th;
    }

    function make_header_row() {
        return dom_tr(th_n, th_square);
    }

    function style_integer_table(table) {
        style_generic_table(table);
        setStyles(table, {
            textAlign: "center",
        });
        return table;
    }

    function num_rows() {
        return number_store.size();
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
        const td = dom_td({ id, elem: `${n}` });
        return style_td_n(td);
    }

    function make_td_square(n) {
        const id = make_td_id(n, "square");
        const td = dom_td({ id, elem: square_str(n) });
        return style_td_square(td);
    }

    function make_tr(i) {
        const current_ints = number_store.get_integers();
        const n = current_ints[i];
        const tr = dom_tr(make_td_n(n), make_td_square(n));
        return style_tr(tr, i);
    }

    const th_n = make_th_n();
    const th_square = make_th_square();

    const table_widget = simple_table_widget({
        make_header_row,
        num_rows: num_rows(),
        make_tr,
    });

    style_integer_table(table_widget.table);

    return {
        table: table_widget.table,
        repopulate: table_widget.repopulate,
        th_n,
        th_square,
    }
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
