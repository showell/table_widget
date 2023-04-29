build_prime_table();
build_even_number_table();

function list_renderer({ parent_elem, make_child, get_num_rows }) {
    function repopulate() {
        parent_elem.innerHTML = "";
        for (let i = 0; i < get_num_rows(); ++i) {
            parent_elem.append(make_child(i));
        }
    }

    return { repopulate };
}

function simple_table_widget({ make_header_row, make_tr }) {
    const {table, thead, tbody} = dom_empty_table();

    thead.append(make_header_row());

    let my_num_rows = 0;

    function get_num_rows() {
        return my_num_rows;
    }

    const my_renderer = list_renderer({
        parent_elem: tbody,
        make_child: make_tr,
        get_num_rows,
    });

    function repopulate(num_rows) {
        my_num_rows = num_rows;
        console.log("repopulate", table.id);
        my_renderer.repopulate();
    }

    return { table, repopulate };
}

function dom_empty_table() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    table.append(thead);

    const tbody = document.createElement("tbody");
    table.append(tbody);

    return { table, thead, tbody }
}

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

function maybe_stripe(elem, i, color) {
    if (i % 2) {
        setStyles(elem, {
            background: color,
        });
    }

    return elem;
}

function wire_up_reverse_button({ th, callback }) {
    const button = document.createElement("button");
    button.innerText = "reverse";
    button.addEventListener("click", callback);
    th.append("  ", button);
}

function wrap_table(table) {
    const div = document.createElement("div");

    setStyles(div, {
        display: "inline-block",
        overflowY: "scroll",
        maxHeight: "400px",
    });

    div.append(table);
    return div;
}

function build_even_number_table() {
    function container() {
        return document.querySelector("#even_numbers");
    }

    function bump() {
        i += 1;
        if (i > 20) {
            clearInterval(bump_id);
            return;
        }
        even_numbers.push(i * 2);
        table_widget.repopulate();
    }

    let i = 0;
    const even_numbers = [];

    const number_store_callback = {
        get_integers: () => even_numbers,
        size: () => even_numbers.length,
    };

    const table_widget = build_integer_table_widget({ number_store_callback });
    const table = table_widget.table;

    table.id = "even_numbers";
    setStyles(table_widget.th_square, {
        color: "darkred",
        background: "lightgreen",
    });

    bump();
    container().append(wrap_table(table));

    const bump_id = setInterval(bump, 500);
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

    return { get_integers, size, reverse };
}

function build_prime_store() {
    return build_number_store([2, 3, 5, 7, 11, 13, 17]);
}

function build_prime_table() {
    function container() {
        return document.querySelector("#prime_squares");
    }

    function reverse() {
        number_store.reverse();
        table_widget.repopulate();
    }

    const number_store = build_prime_store();
    const number_store_callback = {
        get_integers: number_store.get_integers,
        size: number_store.size,
    };

    const table_widget = build_integer_table_widget({ number_store_callback });
    const table = table_widget.table;

    table.id = "prime_squares";
    table_widget.repopulate();
    container().append(table);

    wire_up_reverse_button({
        th: table_widget.th_n,
        callback: reverse,
    });
}

function build_integer_table_widget({ number_store_callback }) {
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
        return number_store_callback.size();
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
            width: "130px",
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
        const current_ints = number_store_callback.get_integers();
        const n = current_ints[i];
        const tr = dom_tr(make_td_n(n), make_td_square(n));
        return style_tr(tr, i);
    }

    function repopulate() {
        table_widget.repopulate(number_store_callback.size());
    }

    const th_n = make_th_n();
    const th_square = make_th_square();

    const table_widget = simple_table_widget({
        make_header_row,
        make_tr,
    });

    style_integer_table(table_widget.table);

    return {
        table: table_widget.table,
        repopulate,
        th_n,
        th_square,
    };
}

function style_generic_table(table) {
    setStyles(table, {
        border: "1px solid black",
        borderCollapse: "collapse",
        margin: "auto",
        display: "block",
    });

    for (const th of table.querySelectorAll("th")) {
        setStyles(th, {
            padding: "4px",
            position: "sticky",
            top: "0px",
            border: "1px solid black",
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
