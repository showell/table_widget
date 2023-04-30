const { dom_tr, dom_td, maybe_stripe } = window.dom_helpers;

const { style_generic_table, setStyles } = window.style_helpers;

const { simple_table_widget, wire_up_reverse_button } = window.table_helpers;

const { build_integer_table_widget } = window.integer_table_helper;

build_person_table();
build_fruits_table();
build_prime_table();
build_even_number_table();

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

    const { table } = simple_table_widget({
        make_header_row,
        make_tr,
        get_num_rows,
        maxHeight,
    });

    style_generic_table(table);

    return table;
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

    const { table, resize_list, scroll_container, th_number, th_square } =
        build_integer_table_widget({
            number_store_callback,
            maxHeight,
        });

    table.id = "even_numbers";
    setStyles(th_number, {
        color: "darkgreen",
    });

    setStyles(th_square, {
        color: "darkred",
        background: "lightgreen",
    });

    container().append(scroll_container);

    grow_data_even_numbers({
        even_numbers,
        resize_list,
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

    const number_store = build_prime_store();
    const number_store_callback = {
        get_integers: number_store.get_integers,
        size: number_store.size,
    };

    const maxHeight = "200px";

    const { table, th_number, repopulate } = build_integer_table_widget({
        number_store_callback,
        maxHeight,
    });

    table.id = "prime_squares";
    container().append(table);

    wire_up_reverse_button({
        th: th_number,
        callback: reverse,
    });

    function reverse() {
        number_store.reverse();
        repopulate();
    }
}
