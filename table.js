build_person_table();
build_fruits_table();
build_prime_table();
build_even_number_table();

function list_renderer({ parent_elem, make_child, get_num_rows }) {
    function overwrite(i, elem) {
        console.log("overwrite", i);
        if (i >= parent_elem.children.length) {
            parent_elem.append(elem);
        } else {
            parent_elem.replaceChild(elem, parent_elem.children[i]);
        }
    }

    function is_child_too_far_down(i) {
        // TODO: integrate once I guarantee tables get wrapped in a scroll
        // container early enough.
        const scroll_container = parent_elem.closest(".table_scroll_container");
        const child_top = parent_elem.children[i].getBoundingClientRect().top;
        const container_bottom =
            scroll_container.getBoundingClientRect().bottom;
        console.log(Math.floor(child_top), Math.floor(container_bottom));

        return child_top > container_bottom;
    }

    function repopulate_range(lo, hi) {
        for (let i = lo; i < hi; ++i) {
            overwrite(i, make_child(i));
        }
    }

    function compress(num_rows) {
        for (let i = parent_elem.children.length - 1; i >= num_rows; --i) {
            parent_elem.children[i].remove();
        }
    }

    function repopulate() {
        const num_rows = get_num_rows();
        compress(num_rows);
        repopulate_range(0, num_rows);
    }

    function resize_list() {
        /*
            The contract here is that none of the existing data elements
            have changed.
        */
        const num_rows = get_num_rows();
        compress(num_rows);
        repopulate_range(parent_elem.children.length, num_rows);
    }

    return { resize_list, repopulate };
}

function simple_table_widget({
    make_header_row,
    make_tr,
    get_num_rows,
    maxHeight,
}) {
    function resize_list() {
        console.log("resize_list", table.id);
        my_renderer.resize_list();
    }

    function repopulate() {
        console.log("repopulate", table.id);
        my_renderer.repopulate();
    }

    const { table, thead, tbody } = dom_empty_table();

    thead.append(make_header_row());

    // It is important to wrap the table with a scrolling container
    // BEFORE you start rendering the list of rows.

    const scroll_container = wrap_table(table, maxHeight);

    const my_renderer = list_renderer({
        parent_elem: tbody,
        make_child: make_tr,
        get_num_rows,
    });

    repopulate();

    return { scroll_container, table, repopulate, resize_list };
}

function dom_empty_table() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    table.append(thead);

    const tbody = document.createElement("tbody");
    table.append(tbody);

    return { table, thead, tbody };
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

function wrap_table(table, maxHeight) {
    const div = document.createElement("div");

    div.className = "table_scroll_container";

    setStyles(div, {
        display: "inline-block",
        overflowY: "scroll",
        maxHeight,
    });

    div.append(table);
    return div;
}

function easy_table({ header_title, items }) {
    function make_header_row() {
        const th = document.createElement("th");
        th.innerText = header_title;
        return dom_tr(th);
    }

    function make_tr(i) {
        const id = `item-${i}`;
        const elem = document.createElement("span");
        elem.innerText = items[i];
        return dom_tr(dom_td({ id, elem }));
    }

    function get_num_rows() {
        return items.length;
    }

    const maxHeight = "150px";

    const widget = simple_table_widget({
        make_header_row,
        make_tr,
        get_num_rows,
        maxHeight,
    });

    style_generic_table(widget.table);

    return widget.table;
}

function build_person_table() {
    const header_title = "Employee";
    const items = ["alice", "bob", "cindy"];
    const table = easy_table({ header_title, items });
    table.id = "persons-table";

    document.querySelector("#persons").append(table);
}

function build_fruits_table() {
    const header_title = "Fruit";
    const items = ["apple", "banana", "grape", "pineapple"];
    const table = easy_table({ header_title, items });
    table.id = "persons-table";

    document.querySelector("#fruits").append(table);
}

function grow_data_even_numbers({ even_numbers, resize_list }) {
    /*
        This is to exercise our data-resizing code.
    */
    const container = document.querySelector("#even_numbers");

    function shrink() {
        even_numbers.pop();
        even_numbers.pop();
        even_numbers.pop();
        even_numbers.pop();
        resize_list();
    }

    function grow() {
        even_numbers.push(even_numbers.length * 2);
        even_numbers.push(even_numbers.length * 2);
        even_numbers.push(even_numbers.length * 2);
        even_numbers.push(even_numbers.length * 2);
        resize_list();
    }

    function make_button(label) {
        const button = document.createElement("button");
        button.innerText = label;
        setStyles(button, {
            margin: "5px",
            padding: "7Px",
        });
        return button;
    }

    function make_shrink_button() {
        const button = make_button("shrink (remove 4 rows)");
        container.prepend(button);
        button.addEventListener("click", shrink);
    }

    function make_grow_button() {
        const button = make_button("grow (add 4 rows)");
        container.prepend(button);
        button.addEventListener("click", grow);
    }

    grow();
    make_shrink_button();
    make_grow_button();
}

function build_even_number_table() {
    function container() {
        return document.querySelector("#even_numbers");
    }

    let even_numbers = [];

    const number_store_callback = {
        get_integers: () => even_numbers,
        size: () => even_numbers.length,
    };

    const maxHeight = "300px";

    const table_widget = build_integer_table_widget({
        number_store_callback,
        maxHeight,
    });
    const table = table_widget.table;

    table.id = "even_numbers";
    setStyles(table_widget.th_n, {
        color: "darkgreen",
    });

    setStyles(table_widget.th_square, {
        color: "darkred",
        background: "lightgreen",
    });

    container().append(table_widget.scroll_container);

    grow_data_even_numbers({
        even_numbers,
        resize_list: table_widget.resize_list,
    });
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

    const maxHeight = "200px";

    const table_widget = build_integer_table_widget({
        number_store_callback,
        maxHeight,
    });
    const table = table_widget.table;

    table.id = "prime_squares";
    container().append(table);

    wire_up_reverse_button({
        th: table_widget.th_n,
        callback: reverse,
    });
}

function build_integer_table_widget({ number_store_callback, maxHeight }) {
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
            width: "365px",
        });
        return table;
    }

    function style_td_n(td) {
        td = style_generic_td(td);
        return setStyles(td, {
            color: "blue",
            width: "230px",
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

    function get_num_rows() {
        return number_store_callback.size();
    }

    const th_n = make_th_n();
    const th_square = make_th_square();

    const { scroll_container, table, resize_list, repopulate } =
        simple_table_widget({
            make_header_row,
            make_tr,
            get_num_rows,
            maxHeight,
        });

    style_integer_table(table);

    return {
        scroll_container,
        table,
        repopulate,
        resize_list,
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
